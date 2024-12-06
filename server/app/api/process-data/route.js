import fs from "fs/promises";
import path from "path";

export async function POST(request) {
  try {
    const inputDir = path.join(process.cwd(), "..", "info"); // 입력 JSON 파일 디렉토리
    const outputPath = path.join(process.cwd(), "..", "profile.json"); // 결과 파일 경로

    // 입력 파일 읽기
    const files = await fs.readdir(inputDir);
    const jsonFiles = files.filter((file) => file.endsWith(".json"));

    const ignoreList = ["연출", "무대감독", "기획팀장"];

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
            value.forEach((person) => {
              const key = `${person.class}-${person.name}`;
              if (!peopleData[key]) {
                peopleData[key] = {
                  class: person.class,
                  name: person.name,
                  history: {},
                  totalRoles: 0,
                  totalLeaderRoles: 0,
                };
              }

              // 히스토리 추가
              if (!peopleData[key].history[historyTag]) {
                peopleData[key].history[historyTag] = [];

                // 역할 수 증가
                peopleData[key].totalRoles += 1;
              }

              // 리더 역할 수 증가
              if (person.isleader) {
                if (ignoreList.includes(role)) {
                  peopleData[key].history[historyTag].push(role);
                } else {
                  peopleData[key].history[historyTag].push(role + "팀장");
                }
                peopleData[key].totalLeaderRoles += 1;
              } else {
                peopleData[key].history[historyTag].push(role);
              }
            });
          } else if (typeof value === "object") {
            const key = `${value.class}-${value.name}`;
            if (!peopleData[key]) {
              peopleData[key] = {
                class: value.class,
                name: value.name,
                history: {},
                totalRoles: 0,
                totalLeaderRoles: 0,
              };
            }

            // 히스토리 추가
            if (!peopleData[key].history[historyTag]) {
              peopleData[key].history[historyTag] = [];

              // 역할 수 증가
              peopleData[key].totalRoles += 1;
            }

            // 리더 역할 수 증가
            if (value.isleader) {
              if (ignoreList.includes(role)) {
                peopleData[key].history[historyTag].push(role); // 팀장 추가하지 않고 role만 추가
              } else {
                peopleData[key].history[historyTag].push(role + "팀장"); // role에 팀장 추가
              }
              peopleData[key].totalLeaderRoles += 1;
            } else {
              peopleData[key].history[historyTag].push(role);
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
