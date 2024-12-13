import { useState, useEffect } from "react";
import styles from "./InfoEditor.module.css";

const InfoEditor = ({ data, onUpdate }) => {
  const [infoData, setInfoData] = useState(data);

  const handleChange = (key, value) => {
    const updatedData = { ...infoData, [key]: value };
    setInfoData(updatedData);
  };

  useEffect(() => {
    onUpdate(infoData);
  }, [infoData]);

  return (
    <div className={styles.infoEditor}>
      <h2>공연 정보 편집기</h2>
      
      <div className={styles.inputGroup}>
        <label>Title</label>
        <input
          type="text"
          value={infoData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Title"
        />
      </div>
      
      <div className={styles.inputGroup}>
        <label>Short Title</label>
        <input
          type="text"
          value={infoData.shortTitle}
          onChange={(e) => handleChange("shortTitle", e.target.value)}
          placeholder="Short Title"
        />
      </div>
      
      <div className={styles.inputGroup}>
        <label>Subtitle</label>
        <input
          type="text"
          value={infoData.subtitle}
          onChange={(e) => handleChange("subtitle", e.target.value)}
          placeholder="Subtitle"
        />
      </div>
      
      <div className={styles.inputGroup}>
        <label>Date</label>
        <input
          type="text"
          value={infoData.date}
          onChange={(e) => handleChange("date", e.target.value)}
          placeholder="Date"
        />
      </div>
      
      <div className={styles.inputGroup}>
        <label>Times</label>
        <input
          type="number"
          value={infoData.times}
          onChange={(e) => handleChange("times", e.target.value)}
          placeholder="Times"
        />
      </div>
      
      <div className={styles.inputGroup}>
        <label>Place</label>
        <input
          type="text"
          value={infoData.place}
          onChange={(e) => handleChange("place", e.target.value)}
          placeholder="Place"
        />
      </div>
      
      <div className={styles.inputGroup}>
        <label>Poster URL</label>
        <input
          type="text"
          value={infoData.poster}
          onChange={(e) => handleChange("poster", e.target.value)}
          placeholder="Poster URL"
        />
      </div>
    </div>
  );
};

export default InfoEditor;
