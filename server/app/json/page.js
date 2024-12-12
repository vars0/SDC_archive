'use client'

import { useEffect, useState } from 'react';
import CastEditor from './CastEditor';
import CrewEditor from './CrewEditor';
import styles from './page.module.css';

export default function Home() {
  const [Data, setData] = useState(null);

  useEffect(() => {
    // Data API에서 데이터를 가져옵니다.
    fetch('/api/Data')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(err => console.error(err));
  }, []);

  const saveData = async () => {
    try {
      await fetch('/api/Data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(Data),
      });
      alert('저장 완료!');
    } catch (error) {
      console.error('저장 실패:', error);
      alert('저장 실패');
    }
  };

  const handleUpdate = (updatedData) => {
    setData(updatedData);
  };

  useEffect(() => {
    console.log("Data change",Data);
  }, [Data]);

  if (!Data) return <div>Loading...</div>;

  // console.log(Data);
  return (
    <div className={styles.container}>
      <h1>{Data.title}</h1>
      <button className={styles.button} onClick={saveData}>Save</button>
      <CastEditor data={Data.캐스트} rawData={Data} onUpdate={handleUpdate} />
      <CrewEditor data={Data} onUpdate={handleUpdate} />
    </div>
  );
}
