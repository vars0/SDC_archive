import fs from "fs/promises";
import path from "path";

export async function POST(request) {
  try {
    // 디렉터리와 파일 경로 정의
    const path = require("path");
    const inputDir = path.join(process.cwd(), "..", "info"); // 입력 JSON 파일 디렉토리
    const outputPath = path.join(process.cwd(), "..",  "profile.json"); // 결과 파일 경로

    // 입력 파일 읽기
    const files = await fs.readdir(inputDir);
    const jsonFiles = files.filter((file) => file.endsWith(".json"));

    let peopleData = {};

    for (const file of jsonFiles) {
      const filePath = path.join(inputDir, file);
      const content = await fs.readFile(filePath, "utf-8");
      const data = JSON.parse(content);

      const historyTag = file.replace(".json", "");

      for (const thData of data) {
        // 데이터 분석
        for (const [role, value] of Object.entries(thData)) {
          if (Array.isArray(value)) {
            // 배열 데이터 처리 (e.g., "조연출", "기획")
            value.forEach((person) => {
              const key = `${person.class}-${person.name}`;
              if (!peopleData[key]) {
                // 새로운 사람 추가
                peopleData[key] = {
                  class: person.class,
                  name: person.name,
                  roles: [],
                  totalRoles: 0,
                  totalLeaderRoles: 0,
                };
              }
              // 역할 추가
              let existingRole = peopleData[key].roles.find(
                (r) => r.role === role
              );
              if (!existingRole) {
                existingRole = { role, history: [] };
                peopleData[key].roles.push(existingRole);
              }
              // 히스토리 추가
              if (!existingRole.history.includes(historyTag)) {
                existingRole.history.push(historyTag);
              }
              // 역할 수 증가
              peopleData[key].totalRoles += 1;
            });
          } else if (typeof value === "object") {
            // 단일 객체 데이터 처리 (e.g., "연출", "기획팀장")
            const key = `${value.class}-${value.name}`;
            if (!peopleData[key]) {
              // 새로운 사람 추가
              peopleData[key] = {
                class: value.class,
                name: value.name,
                roles: [],
                totalRoles: 0,
                totalLeaderRoles: 0,
              };
            }
            // 역할 추가
            let existingRole = peopleData[key].roles.find(
              (r) => r.role === role
            );
            if (!existingRole) {
              existingRole = { role, history: [] };
              peopleData[key].roles.push(existingRole);
            }
            // 히스토리 추가
            if (!existingRole.history.includes(historyTag)) {
              existingRole.history.push(historyTag);
            }
            // 역할 수 증가
            peopleData[key].totalRoles += 1;
            // 리더 역할 수 증가
            if (value.isleader) {
              peopleData[key].totalLeaderRoles += 1;
            }
          }
        }
      }
    }

    // 결과 저장
    const outputData = Object.values(peopleData);
    await fs.writeFile(
      outputPath,
      JSON.stringify(outputData, null, 2),
      "utf-8"
    );

    return new Response(JSON.stringify({ success: true, data: outputData }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
      }
    );
  }
}
