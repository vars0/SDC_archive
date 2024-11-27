import fs from 'fs';
import path from 'path';

// JSON 파일 경로 설정
const infoDir = path.join(process.cwd(), 'info');
const profileDir = path.join(process.cwd(), 'profile');
const profileFile = path.join(profileDir, 'profile.json');

// 비동기적으로 파일을 읽고 분석하는 함수
const processJsonFiles = async () => {
  const jsonFiles = ['123th.json', '124th.json'];
  let result = [];

  // 파일을 하나씩 읽어서 처리
  for (const file of jsonFiles) {
    const filePath = path.join(infoDir, file);

    try {
      // 비동기적으로 파일을 읽음
      const data = await fs.promises.readFile(filePath, 'utf-8');
      const parsedData = JSON.parse(data);

      // 각 파일에 대해 사람별 정보를 처리
      parsedData.forEach(item => {
        const roles = ['연출', '조연출', '기획팀장', '기획']; // 직책 종류

        roles.forEach(role => {
          if (item[role]) {
            // 직책이 단일 객체일 경우 처리
            if (Array.isArray(item[role])) {
              item[role].forEach(person => {
                addPersonToResult(person, file, role);
              });
            } else {
              addPersonToResult(item[role], file, role);
            }
          }
        });
      });
    } catch (error) {
      console.error(`Error reading or parsing file ${file}:`, error);
      throw new Error(`Failed to process file: ${file}`);
    }
  }

  // 결과 파일에 저장
  try {
    await fs.promises.writeFile(profileFile, JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error writing profile.json:', error);
    throw new Error('Failed to write profile.json');
  }
};

// 사람 정보를 결과에 추가하는 함수
const addPersonToResult = (person, fileName, role) => {
  let existingPerson = result.find(p => p.class === person.class && p.name === person.name);

  if (!existingPerson) {
    // 새로운 사람이라면 추가
    existingPerson = {
      class: person.class,
      name: person.name,
      num: 0,
      leaderNum: 0,
      history: []
    };
    result.push(existingPerson);
  }

  // num, leaderNum 및 history 업데이트
  existingPerson.num += 1;  // 등장 횟수 증가
  if (person.isleader) {
    existingPerson.leaderNum += 1;  // 리더 횟수 증가
  }

  if (!existingPerson.history.includes(fileName)) {
    existingPerson.history.push(fileName);  // 등장한 파일 기록
  }
};

// API 핸들러
export async function GET(req) {
  try {
    await processJsonFiles();
    return new Response(JSON.stringify({ message: 'Data processed and saved successfully.' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: `An error occurred: ${error.message}` }), { status: 500 });
  }
}
