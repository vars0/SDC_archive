'use client';

import { useState } from 'react';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleProcessData = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/process-data', {
        method: 'POST',
      });

      const result = await response.json();
      if (result.success) {
        setMessage('데이터 처리 완료! 결과가 profile.json에 저장되었습니다.');
      } else {
        setMessage(`오류 발생: ${result.error}`);
      }
    } catch (error) {
      setMessage(`오류 발생: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>JSON 분석기</h1>
      <button
        onClick={handleProcessData}
        disabled={loading}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? '처리 중...' : '데이터 처리 시작'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}
