// components/CastEditor.js
import { useState, useEffect } from "react";
import styles from "./CastEditor.module.css";

const CastEditor = ({ data, rawData, onUpdate }) => {
  const [castList, setCastList] = useState(data);

  const handleAdd = () => {
    const newCast = { role: "", class: "", studentNo: "", name: "" };
    setCastList([...castList, newCast]);
  };

  const handleDelete = (index) => {
    const updatedCast = castList.filter((_, i) => i !== index);
    setCastList(updatedCast);
  };

  const handleChange = (index, key, value) => {
    const updatedCast = [...castList];
    updatedCast[index][key] = value;
    setCastList(updatedCast);
  };

  useEffect(() => {
    onUpdate({ ...rawData, 캐스트: castList });
  }, [castList]);

  return (
    <div className={styles.castEditor}>
      <h2>캐스트 편집</h2>
      <button className={styles.addButton} onClick={handleAdd}>
        Add Cast
      </button>
      <ul>
        <li>
          <div>기수</div>
          <div>학번</div>
          <div>이름</div>
          <div>배역</div>
        </li>
        {castList.map((cast, index) => (
          <li key={index}>
            <input
              type="text"
              value={cast.class}
              onChange={(e) => handleChange(index, "class", e.target.value)}
              placeholder="class"
            />
            <input
              type="text"
              value={cast.studentNo}
              onChange={(e) => handleChange(index, "studentNo", e.target.value)}
              placeholder="studentNo"
            />
            <input
              type="text"
              value={cast.name}
              onChange={(e) => handleChange(index, "name", e.target.value)}
              placeholder="Name"
            />
            <input
              type="text"
              value={cast.role}
              onChange={(e) => handleChange(index, "role", e.target.value)}
              placeholder="Role"
            />
            <button onClick={() => handleDelete(index)}>
              <img src="/trashcan.svg" alt="Delete" width="24" height="24" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CastEditor;
