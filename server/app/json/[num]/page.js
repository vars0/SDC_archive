"use client";

import { useEffect, useState } from "react";
import InfoEditor from "./InfoEditor";
import CastEditor from "./CastEditor";
import CrewEditor from "./CrewEditor";
import UploadStatus from "./UploadStatus";
import styles from "./page.module.css";
import { use } from "react";
import { storage, ref, uploadString, getDownloadURL } from "../../../firebaseConfig";

export default function Home(props) {
  const para = use(props.params);
  const num = para.num;

  const [data, setData] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("idle"); // 업로드 상태: idle, uploading, success, error

  useEffect(() => {
    // Firebase Storage에서 JSON 파일 가져오기
    const fetchData = async () => {
      try {
        // 파일의 참조를 가져옵니다.
        const fileRef = ref(storage, `info/${num}.json`);

        // 파일의 다운로드 URL을 가져옵니다.
        const url = await getDownloadURL(fileRef);

        // 다운로드한 URL로부터 데이터를 fetch하여 JSON으로 파싱
        const response = await fetch(url);
        const jsonData = await response.json();

        // 데이터를 상태로 설정
        setData(jsonData);
      } catch (err) {
        console.error("Error fetching data from Firebase Storage:", err);
      }
    };

    fetchData();
  }, []); // 페이지 로드 시 한 번만 실행

  // 업로드 상태 초기화 (3초 후)
  useEffect(() => {
    if (uploadStatus === "success" || uploadStatus === "error") {
      const timer = setTimeout(() => setUploadStatus("idle"), 3000);
      return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리
    }
  }, [uploadStatus]);

  // 업로드 함수
  const uploadFile = async () => {
    setUploadStatus("uploading"); // 업로드 시작
    try {
      const filePath = `info/${num}.json`; // 업로드할 파일 경로

      // 파일 참조 생성
      const fileRef = ref(storage, filePath);

      // 데이터를 JSON 문자열로 변환하여 업로드
      const jsonData = JSON.stringify(data);
      await uploadString(fileRef, jsonData, "raw", {
        contentType: "application/json",
      });

      // 업로드 후 다운로드 URL을 가져옵니다.
      const url = await getDownloadURL(fileRef);
      console.log("파일 업로드 성공. 다운로드 URL:", url);

      setUploadStatus("success"); // 업로드 성공
    } catch (error) {
      setUploadStatus("error"); // 업로드 실패
      console.error("업로드 중 오류 발생:", error);
    }
  };

  const handleUpdate = (updatedData) => {
    setData(updatedData);
  };

  const crewTypes = [
    "연출",
    "조연출",
    "스텝리더",
    "기획팀장",
    "무대감독",
    "기획",
    "무대",
    "오퍼",
    "조명",
    "음향",
    "의소분",
  ];

  const renderCrewEditors = () => {
    return crewTypes.map((type) => {
      if (data[type] && data[type].length > 0) {
        return (
          <CrewEditor
            key={type}
            type={type}
            data={data}
            onUpdate={handleUpdate}
          />
        );
      }
      return null;
    });
  };

  const [selectedRole, setSelectedRole] = useState(""); // 추가할 역할군
  const [selectedRoleToDelete, setSelectedRoleToDelete] = useState(""); // 삭제할 역할군
  const [availableRoles, setAvailableRoles] = useState(crewTypes); // 추가할 수 있는 역할군 리스트

  // 역할군 추가 기능
  const addCrewType = () => {
    if (selectedRole && !data[selectedRole]) {
      setData((prevData) => ({
        ...prevData,
        [selectedRole]: [
          { class: "", studentNo: "", name: "", isleader: false },
        ], // 선택된 역할군을 추가
      }));
    }
  };

  // 역할군 삭제 기능
  const removeCrewType = () => {
    if (selectedRoleToDelete && data[selectedRoleToDelete]) {
      const newData = { ...data };
      delete newData[selectedRoleToDelete]; // 선택된 역할군 삭제
      setData(newData);
    }
  };

  // useEffect(() => {
  //   console.log("Data change", data);
  // }, [data]);

  if (!data) return <div>Loading...</div>;

  // console.log(Data);
  return (
    <div className={styles.container}>
      <h1>{num}.json</h1>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <button className={styles.button} onClick={uploadFile}>
          파일 업로드
        </button>
        <UploadStatus status={uploadStatus} />
      </div>

      <InfoEditor data={data} onUpdate={handleUpdate} />

      <div className={styles.roleContainer}>
        {/* 역할군 추가 */}
        <div className={styles.selectWrapper}>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className={styles.selectInput}
          >
            <option value="">역할군 선택</option>
            {availableRoles.map((role) => {
              if (!data[role]) {
                return (
                  <option key={role} value={role}>
                    {role}
                  </option>
                );
              }
              return null; // 이미 있는 역할군은 선택할 수 없음
            })}
          </select>
          <button onClick={addCrewType} className={styles.addButton}>
            추가
          </button>
        </div>

        {/* 역할군 삭제 */}
        <div className={styles.selectWrapper}>
          <select
            value={selectedRoleToDelete}
            onChange={(e) => setSelectedRoleToDelete(e.target.value)}
            className={styles.selectInput}
          >
            <option value="">역할군 선택</option>
            {Object.keys(data).map((role) => {
              if (
                ![
                  "title",
                  "shortTitle",
                  "subtitle",
                  "date",
                  "times",
                  "place",
                  "poster",
                ].includes(role) &&
                data[role].length > 0
              ) {
                return (
                  <option key={role} value={role}>
                    {role}
                  </option>
                );
              }
              return null; // 삭제할 수 있는 역할군만 표시
            })}
          </select>
          <button onClick={removeCrewType} className={styles.deleteButton}>
            삭제
          </button>
        </div>
      </div>

      {renderCrewEditors()}
      <CastEditor data={data.캐스트} rawData={data} onUpdate={handleUpdate} />
    </div>
  );
}
