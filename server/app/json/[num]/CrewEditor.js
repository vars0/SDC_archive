// components/CrewEditor.js
import { useState, useEffect } from "react";
import styles from "./CrewEditor.module.css";

const CrewEditor = ({ type, data, onUpdate }) => {
  const [crewData, setCrewData] = useState(data);

  const handleAdd = () => {
    const newCrew = { class: "", studentNo: "", name: "", isleader: false };
    const addedCrew = [...crewData[type], newCrew];
    setCrewData({ ...crewData, [type]: addedCrew });
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
          <div>isleader</div>
        </li>
        {crewData[type].map((member, index) => (
          <li key={index}>
            <input
              type="number"
              value={member.class || ""} // 값이 undefined 또는 null일 때 빈 문자열을 설정
              onChange={(e) => {
                const value = e.target.value ? Number(e.target.value) : ""; // 빈 문자열을 처리하고 숫자로 변환
                handleChange(type, index, "class", value); // 숫자 값으로 전달
              }}
              placeholder="class"
            />
            <input
              type="number"
              value={member.studentNo || ""} // 값이 undefined 또는 null일 때 빈 문자열을 설정
              onChange={(e) => {
                const value = e.target.value ? Number(e.target.value) : ""; // 빈 문자열을 처리하고 숫자로 변환
                handleChange(type, index, "studentNo", value); // 숫자 값으로 전달
              }}
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
            <input
              type="checkbox"
              checked={member.isleader} // 체크박스가 체크되어 있는지 여부를 상태에서 가져옵니다.
              onChange={
                (e) => handleChange(type, index, "isleader", e.target.checked) // 체크박스가 체크되었는지 여부(true/false)로 값을 전달합니다.
              }
              placeholder="isleader"
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
