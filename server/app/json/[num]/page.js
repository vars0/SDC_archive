"use client";

import { useEffect, useState } from "react";
import InfoEditor from "./InfoEditor";
import CastEditor from "./CastEditor";
import CrewEditor from "./CrewEditor";
import UploadStatus from "./UploadStatus";
import styles from "./page.module.css";
import { use } from "react";

export default function Home(props) {
  const para = use(props.params);
  const num = para.num;

  const [data, setData] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("idle"); // 업로드 상태: idle, uploading, success, error

  //json 데이터 다운로드
  useEffect(() => {
    const fetchJsonData = async () => {
      try {
        const response = await fetch(
          `/api/fileDownload?filePath=info/${num}.json`
        );
        if (!response.ok) {
          throw new Error("데이터 로드 실패");
        }
        setData(await response.json());
        console.log("JSON 데이터:", data);
      } catch (error) {
        console.error("오류 발생:", error);
      }
    };

    fetchJsonData();
  }, []);

  // 업로드 상태 초기화 (3초 후)
  useEffect(() => {
    if (uploadStatus === "success" || uploadStatus === "error") {
      const timer = setTimeout(() => setUploadStatus("idle"), 3000);
      return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리
    }
  }, [uploadStatus]);

  //json 파일 업로드
  const uploadFile = async () => {
    setUploadStatus("uploading"); // 업로드 시작
    try {
      const response = await fetch("/api/fileUpload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filePath: `info/${num}.json`, // 저장할 파일 경로
          content: data, // 업로드할 데이터
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "업로드 실패");
      }

      setUploadStatus("success"); // 업로드 성공
      console.log("업로드 성공:", result);
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

  useEffect(() => {
    console.log("Data change", data);
  }, [data]);

  if (!data) return <div>Loading...</div>;

  // console.log(Data);
  return (
    <div className={styles.container}>
      <h1>{num}.json</h1>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <button className={styles.button} onClick={uploadFile}>파일 업로드</button>
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
