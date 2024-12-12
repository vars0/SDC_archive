// components/CrewEditor.js
import { useState, useEffect } from 'react';
import styles from './CrewEditor.module.css';

const CrewEditor = ({ data, onUpdate }) => {
  const [crewData, setCrewData] = useState(data);

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
      <h2>기획팀 편집</h2>
      <ul>
        {crewData.기획.map((member, index) => (
          <li key={index}>
            <input
              type="text"
              value={member.class}
              onChange={(e) => handleChange('기획', index, 'class', e.target.value)}
              placeholder="class"
            />
            <input
              type="text"
              value={member.studentNo}
              onChange={(e) => handleChange('기획', index, 'studentNo', e.target.value)}
              placeholder="studentNo"
            />
            <input
              type="text"
              value={member.name}
              onChange={(e) => handleChange('기획', index, 'name', e.target.value)}
              placeholder="Name"
            />
            <button onClick={() => handleDelete('기획', index)}>Delete</button>
          </li>
        ))}
      </ul>
      {/* 기타 팀을 위한 UI 추가 */}
    </div>
  );
};

export default CrewEditor;