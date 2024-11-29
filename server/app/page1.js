'use client';

import { useState } from 'react';

export default function Home() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');

  const handleProcessData = async () => {
    setIsProcessing(true);  // 버튼 클릭 후, 처리 중 표시
    setMessage('처리 중...');

    try {
      const response = await fetch('/api/processData', {
        method: 'GET',  // 기본값은 GET, api/processData.js에서 GET 메서드 처리
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage('데이터가 성공적으로 처리되었습니다.');
      } else {
        setMessage(`데이터 처리 중 오류가 발생했습니다: ${data.error}`);
      }
    } catch (error) {
      setMessage(`네트워크 오류가 발생했습니다: ${error.message}`);
    } finally {
      setIsProcessing(false);  // 처리 후 버튼 상태 복구
    }
  };

  return (
    <div>
      <h1>JSON 데이터 분석</h1>
      <button 
        onClick={handleProcessData}
        disabled={isProcessing}  // 처리 중일 때는 버튼 비활성화
      >
        {isProcessing ? '처리 중...' : '데이터 처리 시작'}
      </button>

      {message && <p>{message}</p>}
    </div>
  );
}
