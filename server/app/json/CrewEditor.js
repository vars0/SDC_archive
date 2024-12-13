// components/CrewEditor.js
import { useState, useEffect } from "react";
import styles from "./CrewEditor.module.css";

const CrewEditor = ({ type, data, onUpdate }) => {
  const [crewData, setCrewData] = useState(data);

  const handleAdd = () => {
    const newCast = { class: "", studentNo: "", name: "" };
    setCastList([...castList, newCast]);
  };

  const handleDelete = (section, index) => {
    const updatedCrew = { ...crewData };
    updatedCrew[section] = crewData[section].filter((_, i) => i !== index);
    setCrewData(updatedCrew);
  };

  const handleChange = (section, index, key, value) => {
    const updatedData = { ...crewData };
    updatedData[section][index][key] = value;
    setCrewData(updatedData);
  };

  useEffect(() => {
    onUpdate(crewData);
  }, [crewData]);

  return (
    <div className={styles.crewEditor}>
      <h2>{type} 편집기</h2>
      <button className={styles.addButton} onClick={handleAdd}>
        Add {type}
      </button>
      <ul>
        <li>
          <div>기수</div>
          <div>학번</div>
          <div>이름</div>
        </li>
        {crewData[type].map((member, index) => (
          <li key={index}>
            <input
              type="text"
              value={member.class}
              onChange={(e) =>
                handleChange(type, index, "class", e.target.value)
              }
              placeholder="class"
            />
            <input
              type="text"
              value={member.studentNo}
              onChange={(e) =>
                handleChange(type, index, "studentNo", e.target.value)
              }
              placeholder="studentNo"
            />
            <input
              type="text"
              value={member.name}
              onChange={(e) =>
                handleChange(type, index, "name", e.target.value)
              }
              placeholder="Name"
            />
            <button onClick={() => handleDelete(type, index)}>
              <img src="/trashcan.svg" alt="Delete" width="24" height="24" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CrewEditor;
