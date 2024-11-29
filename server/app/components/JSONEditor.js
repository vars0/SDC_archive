'use client';

import { useState, useEffect } from 'react';

export default function JSONEditor({ fileName }) {
    const [jsonData, setJsonData] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // JSON 파일 로드
        const loadJson = async () => {
            try {
                const response = await fetch(`/info/${fileName}`);
                const data = await response.json();
                setJsonData(data);
            } catch (err) {
                setError('Failed to load JSON');
            } finally {
                setLoading(false);
            }
        };
        loadJson();
    }, [fileName]);

    const handleSave = async () => {
        try {
            await fetch(`/info/${fileName}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(jsonData),
            });
            alert('Saved successfully!');
        } catch (err) {
            alert('Error saving file');
        }
    };

    if (loading) return <div>Loading {fileName}...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div style={{ margin: '20px 0' }}>
            <h2>{fileName}</h2>
            <textarea
                value={JSON.stringify(jsonData, null, 2)}
                onChange={(e) => setJsonData(JSON.parse(e.target.value))}
                rows={20}
                style={{ width: '100%' }}
            />
            <button onClick={handleSave}>Save</button>
        </div>
    );
}
