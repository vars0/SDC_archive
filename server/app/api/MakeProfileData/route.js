// pages/api/MakeProfileData.js

import { NextResponse } from "next/server";

// 환경변수로 BASE_URL이 설정되어 있다면, 그것을 사용하여 절대 경로를 설정할 수 있습니다.
// 개발 환경에서는 기본적으로 localhost로 설정되지만, 실제 배포에서는 API 서버 주소를 넣어야 할 수 있습니다.
// const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://studious-spork-q7pr4w59gvrw3xvjv-3000.app.github.dev';
const BASE_URL = "https://studious-spork-q7pr4w59gvrw3xvjv-3000.app.github.dev";

export async function POST(request) {
  try {
    // const filesRes = await fetch(
    //   `https://studious-spork-q7pr4w59gvrw3xvjv-3000.app.github.dev/api/GetFileList`
    // );
    // console.log(filesRes);
    // console.log(filesRes.status); // 상태 코드 출력
    // console.log(filesRes.url); // 최종 요청 URL 출력
    // console.log(filesRes.headers.get("Location")); // 리디렉션이 있으면 'Location' 헤더 출력
    const filesRes = await fetch(`https://studious-spork-q7pr4w59gvrw3xvjv-3000.app.github.dev/api/GetFileList`, {
      method: 'GET',
      redirect: 'follow',  // 리디렉션을 따라가도록 설정
    });
    
    if (filesRes.ok) {
      const filesData = await filesRes.json();  // JSON 응답을 파싱
      // 이후 처리ss
    } else {
      console.error('API 요청 실패', filesRes.status);
    }

    const filesData = await filesRes.text(); // JSON을 파싱하기 전에 원시 텍스트 출력
    console.log(filesData);
    if (!filesRes.ok) {
      throw new Error(
        filesData.error || "파일 목록을 가져오는 데 실패했습니다."
      );
    }

    // 'info/'로 시작하고 숫자나 'W'로 시작하는 파일만 필터링
    const files = filesData.files.filter((file) =>
      /^(info\/)(\d|W)/.test(file)
    );

    const ignoreList = ["연출", "조연출", "스텝리더", "무대감독", "기획팀장"];
    let peopleData = {};

    // 파일별 데이터 처리
    for (const file of files) {
      const fileRes = await fetch(
        `${BASE_URL}/api/GetFileData?fileName=${file}`
      );
      const fileData = await fileRes.json();
      if (!fileRes.ok) {
        throw new Error("파일 데이터를 가져오는 데 실패했습니다.");
      }

      const historyTag = file.replace(".json", "");

      // 데이터 처리
      for (const [role, value] of Object.entries(fileData)) {
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

            if (!peopleData[key].history[historyTag]) {
              peopleData[key].history[historyTag] = [];
              peopleData[key].totalRoles += 1;
            }

            // 리더 역할 처리
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

          if (!peopleData[key].history[historyTag]) {
            peopleData[key].history[historyTag] = [];
            peopleData[key].totalRoles += 1;
          }

          if (value.isleader) {
            if (ignoreList.includes(role)) {
              peopleData[key].history[historyTag].push(role);
            } else {
              peopleData[key].history[historyTag].push(role + "팀장");
            }
            peopleData[key].totalLeaderRoles += 1;
          } else {
            peopleData[key].history[historyTag].push(role);
          }
        }
      }
    }

    // 결과 저장 (파일로 저장하는 로직은 API에서는 직접 구현할 수 없으므로, 출력 형식으로)
    const outputData = Object.values(peopleData);
    // 실제 파일로 저장하는 부분은 서버 환경에서 처리할 수 있겠지만, 여기서는 예시로 JSON 반환
    return NextResponse.json(
      { success: true, data: outputData },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
