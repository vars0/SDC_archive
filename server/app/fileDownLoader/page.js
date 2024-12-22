'use client'

import React, { useState, useEffect } from 'react';
import JSZip from 'jszip';  // JSZip 라이브러리 import

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  // 전체 다운로드 기능
  const handleDownloadAll = async () => {
    const zip = new JSZip();
    setLoading(true);

    // 각 파일을 다운로드하여 압축
    try {
      for (const fileName of files) {
        const content = await getFileContent(fileName);
        if (content) {
          zip.file(fileName, content);  // 압축에 파일 추가
        }
      }

      // 압축 파일 생성 후 다운로드
      zip.generateAsync({ type: 'blob' }).then((blob) => {
        const a = document.createElement('a');
        const url = URL.createObjectURL(blob);
        a.href = url;
        a.download = 'all_files.zip';  // 다운로드할 파일명
        a.click();
        URL.revokeObjectURL(url);  // URL 해제
      });
    } catch (err) {
      setError('파일 다운로드 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 파일 내용 가져오기
  const getFileContent = async (fileName) => {
    try {
      const res = await fetch(`/api/GetFileData?fileName=${fileName}`);
      if (!res.ok) {
        throw new Error('파일 다운로드에 실패했습니다.');
      }

      const data = await res.blob();  // 바이너리 파일을 Blob 형식으로 가져옴
      return data;  // Blob 데이터를 반환
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
        <>
          <button onClick={handleDownloadAll}>전체 파일 다운로드</button>
          <ul>
            {files.map((file) => (
              <FileItem key={file} fileName={file} />
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

// 파일 항목 (파일명 + 다운로드 링크)
const FileItem = ({ fileName }) => {
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
  }, [fileName]);

  // 파일 내용 가져오기 함수
  const getFileContent = async (fileName) => {
    try {
      const res = await fetch(`/api/GetFileData?fileName=${fileName}`);
      if (!res.ok) {
        throw new Error('파일 다운로드에 실패했습니다.');
      }

      const data = await res.blob();  // 바이너리 파일을 Blob 형식으로 가져옴
      return data;  // Blob 데이터를 반환
    } catch (err) {
      console.error('파일 내용 가져오기 오류:', err);
      return null;
    }
  };

  return (
    <li>
      <strong>{fileName}</strong>
      {loading && <p>Loading content...</p>}
      {!loading && fileContent && (
        <button onClick={() => downloadFile(fileContent, fileName)}>
          파일 다운로드
        </button>
      )}
      {!loading && !fileContent && <p>내용을 표시할 수 없습니다.</p>}
    </li>
  );
};

// 파일 다운로드 함수
const downloadFile = (blob, fileName) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);  // 사용 후 URL 해제
};

export default FileList;
