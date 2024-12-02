// components/PdfUploader.js

import { useState } from 'react';

export default function PdfUploader() {
  const [metadata, setMetadata] = useState(null);
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/getPdfMetadata', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      setMetadata(result);
    } catch (error) {
      console.error('파일 처리 중 오류 발생:', error);
    }
  };

  return (
    <div>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button onClick={handleUpload}>PDF 메타데이터 가져오기</button>

      {metadata && (
        <div>
          <h3>PDF 메타데이터</h3>
          <p>제목: {metadata.title}</p>
          <p>작성자: {metadata.author}</p>
          <p>주제: {metadata.subject}</p>
        </div>
      )}
    </div>
  );
}
