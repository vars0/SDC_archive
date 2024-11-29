'use client';

import { useState } from 'react';

export default function JSONTableEditor({ data, onSave }) {
    const [editedData, setEditedData] = useState(data);

    const handleInputChange = (path, value) => {
        const newData = { ...editedData };
        let target = newData;
        const keys = path.split('.');

        keys.slice(0, -1).forEach((key) => {
            target = target[key];
        });
        target[keys[keys.length - 1]] = value;

        setEditedData(newData);
    };

    const renderFields = (obj, path = '') => {
        return Object.entries(obj).map(([key, value]) => {
            const currentPath = path ? `${path}.${key}` : key;
            if (typeof value === 'object' && !Array.isArray(value)) {
                return (
                    <div key={currentPath}>
                        <h4>{key}</h4>
                        {renderFields(value, currentPath)}
                    </div>
                );
            }
            return (
                <div key={currentPath} style={{ marginBottom: '10px' }}>
                    <label>
                        {key}:
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => handleInputChange(currentPath, e.target.value)}
                            style={{ marginLeft: '10px' }}
                        />
                    </label>
                </div>
            );
        });
    };

    return (
        <div>
            {renderFields(editedData)}
            <button onClick={() => onSave(editedData)} style={{ marginTop: '20px' }}>
                저장
            </button>
        </div>
    );
}
