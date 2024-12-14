"use client";

import { useEffect, useState } from "react";
import InfoEditor from "./InfoEditor";
import CastEditor from "./CastEditor";
import CrewEditor from "./CrewEditor";
import styles from "./page.module.css";
import { use } from "react";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../../../firebaseConfig";

export default function Home(props) {
  const para = use(props.params);
  const num = para.num;

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJsonData = async () => {
      try {
        const response = await fetch(`/api/fileLoad?filePath=uploads/${num}.json`);
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
  
  

  const handleUpdate = (updatedData) => {
    setData(updatedData);
  };

  useEffect(() => {
    console.log("Data change", data);
  }, [data]);

  if (!data) return <div>Loading...</div>;

  // console.log(Data);
  return (
    <div className={styles.container}>
      <h1>{data.title}</h1>
      {/* <button className={styles.button} onClick={saveData}>
        Save
      </button> */}
      <InfoEditor data={data} onUpdate={handleUpdate} />
      <CrewEditor type="연출" data={data} onUpdate={handleUpdate} />
      <CrewEditor type="조연출" data={data} onUpdate={handleUpdate} />
      <CrewEditor type="기획팀장" data={data} onUpdate={handleUpdate} />
      {/* <CrewEditor type="무대감독" data={data} onUpdate={handleUpdate} /> */}
      <CrewEditor type="기획" data={data} onUpdate={handleUpdate} />
      <CrewEditor type="무대" data={data} onUpdate={handleUpdate} />
      <CrewEditor type="조명" data={data} onUpdate={handleUpdate} />
      <CrewEditor type="음향" data={data} onUpdate={handleUpdate} />
      <CrewEditor type="의소분" data={data} onUpdate={handleUpdate} />
      <CastEditor data={data.캐스트} rawData={data} onUpdate={handleUpdate} />
    </div>
  );
}
