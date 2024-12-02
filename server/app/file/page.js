import fs from "fs";
import path from "path";

export async function generateMetadata() {
  return {
    title: "File List",
  };
}

export default async function FileListPage() {
  const path = require("path");

  // 현재 작업 디렉터리 (SDC_archive/server/)에서 상위 디렉터리로 이동한 후 'docs' 폴더에 접근
  const directoryPath = path.join(process.cwd(), "..", "docs");
  const outputPath = path.join(process.cwd(), "..",  "route.json"); // 결과 파일 경로

  // 폴더 내의 파일 목록 읽기
  const files = fs.readdirSync(directoryPath);

  // 파일 정보를 JSON 형식으로 변환
  const fileNames = files.map((file) => ({
    name: file,
    isDirectory: fs.statSync(path.join(directoryPath, file)).isDirectory(),
  }));
  console.log(fileNames);

  return (
    <div>
      <h1>Files in Folder</h1>
      <ul>
        {fileNames.map((file) => (
          <li key={file.name}>
            {file.name} {file.isDirectory ? "(Folder)" : "(File)"}
          </li>
        ))}
      </ul>
    </div>
  );
}
