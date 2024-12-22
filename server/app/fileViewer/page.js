'use client'

import React, { useState, useEffect } from 'react';

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  // 파일 목록 가져오기
  useEffect(() => {
    const fetchFileList = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch('/api/GetFileList');  // GetFileList API 호출
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || '파일 목록을 가져오는 데 실패했습니다.');
        }

        // 'info/'로 시작하고 숫자나 'W'로 시작하는 파일만 필터링
        const filteredFiles = data.files.filter(file => /^(info\/)(\d|W)/.test(file));

        setFiles(filteredFiles);  // 필터링된 파일 목록 상태에 저장
      } catch (err) {
        setError(err.message);  // 오류 상태 업데이트
      } finally {
        setLoading(false);  // 로딩 상태 해제
      }
    };

    fetchFileList();
  }, []);

  // 파일 내용을 가져오기
  const getFileContent = async (fileName) => {
    try {
      const res = await fetch(`/api/GetFileData?fileName=${fileName}`);
      if (!res.ok) {
        throw new Error('파일 다운로드에 실패했습니다.');
      }

      const data = await res.json();  // JSON 파일이라면 JSON 데이터로 변환
      return data;  // JSON 데이터를 반환
    } catch (err) {
      console.error('파일 내용 가져오기 오류:', err);
      return null;
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>파일 목록</h1>
      {files.length === 0 ? (
        <p>파일이 없습니다.</p>
      ) : (
        <ul>
          {files.map((file) => (
            <FileItem key={file} fileName={file} getFileContent={getFileContent} />
          ))}
        </ul>
      )}
    </div>
  );
};

// 파일 항목 (파일명 + 내용)
const FileItem = ({ fileName, getFileContent }) => {
  const [fileContent, setFileContent] = useState(null);
  const [loading, setLoading] = useState(true);

  // 파일 내용 가져오기
  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      const content = await getFileContent(fileName);
      setFileContent(content);
      setLoading(false);
    };

    fetchContent();
  }, [fileName, getFileContent]);

  return (
    <li>
      <strong>{fileName}</strong>
      {loading && <p>Loading content...</p>}
      {fileContent ? (
        <pre>{JSON.stringify(fileContent, null, 2)}</pre>  // JSON 내용 표시
      ) : (
        <p>내용을 표시할 수 없습니다.</p>  // 내용이 없거나 오류가 발생한 경우
      )}
    </li>
  );
};

export default FileList;
