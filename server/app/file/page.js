import fs from "fs";
import path from "path";

export async function generateMetadata() {
  return {
    title: "File List",
  };
}

const readDirectory = (directoryPath) => {
  const items = fs.readdirSync(directoryPath);
  const result = items.map((item) => {
    const itemPath = path.join(directoryPath, item);
    const stats = fs.statSync(itemPath);

    if (stats.isDirectory()) {
      return {
        name: item,
        isDirectory: true,
        children: readDirectory(itemPath), // 재귀적으로 폴더 내부 탐색
      };
    }

    return {
      name: item,
      isDirectory: false,
    };
  });
  return result;
};

export default async function FileListPage() {
  // 현재 작업 디렉터리 (SDC_archive/server/)에서 상위 디렉터리로 이동한 후 'docs' 폴더에 접근
  const directoryPath = path.join(process.cwd(), "..", "docs");
  const outputPath = path.join(process.cwd(), "..", "route.json");

  // 폴더 내의 파일 목록 읽기 및 구조 생성
  const fileStructure = readDirectory(directoryPath);

  // 결과를 JSON 파일로 저장
  fs.writeFileSync(outputPath, JSON.stringify(fileStructure, null, 2));

  return null; // 화면에 표시하는 작업은 필요 없으므로 null 반환
}
