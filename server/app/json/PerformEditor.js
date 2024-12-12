// components/CastEditor.js
import { useState, useEffect } from 'react';
import styles from './PerformEditor.module.css';

const CastEditor = ({ data, onUpdate }) => {
  const [castList, setCastList] = useState(data);

  const handleAdd = () => {
    const newCast = { role: '', class: '', studentNo: '', name: '' };
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
    onUpdate({ ...data, 캐스트: castList });
    console.log(data);
  }, [castList]);

  return (
    <div className={styles.castEditor}>
      <h2>캐스트 편집</h2>
      <button className={styles.addButton} onClick={handleAdd}>Add Cast</button>
      <ul>
        {castList.map((cast, index) => (
          <li key={index}>
            <input
              type="text"
              value={cast.role}
              onChange={(e) => handleChange(index, 'role', e.target.value)}
              placeholder="Role"
            />
            <input
              type="text"
              value={cast.name}
              onChange={(e) => handleChange(index, 'name', e.target.value)}
              placeholder="Name"
            />
            <button onClick={() => handleDelete(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CastEditor;
