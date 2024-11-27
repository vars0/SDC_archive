import fs from 'fs/promises';
import path from 'path';

export async function POST(request) {
  try {
    // 파일 경로 정의
    const inputDir = path.join(process.cwd(), 'info');
    const outputPath = path.join(process.cwd(), 'profile', 'profile.json');

    // 파일 읽기
    const files = await fs.readdir(inputDir);
    const jsonFiles = files.filter(file => file.endsWith('.json'));

    let aggregatedData = {};

    for (const file of jsonFiles) {
      const filePath = path.join(inputDir, file);
      const content = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(content);

      const historyTag = file.replace('.json', '');

      // 데이터 분석 로직
      for (const [role, value] of Object.entries(data)) {
        if (Array.isArray(value)) {
          value.forEach(person => {
            const key = `${person.class}-${person.name}`;
            if (!aggregatedData[key]) {
              aggregatedData[key] = {
                class: person.class,
                name: person.name,
                num: 0,
                leaderNum: 0,
                history: [],
              };
            }
            aggregatedData[key].num += 1;
            aggregatedData[key].history.push(historyTag);
          });
        } else if (typeof value === 'object') {
          const key = `${value.class}-${value.name}`;
          if (!aggregatedData[key]) {
            aggregatedData[key] = {
              class: value.class,
              name: value.name,
              num: 0,
              leaderNum: 0,
              history: [],
            };
          }
          aggregatedData[key].num += 1;
          if (value.isleader) aggregatedData[key].leaderNum += 1;
          aggregatedData[key].history.push(historyTag);
        }
      }
    }

    // 결과 저장
    const outputData = Object.values(aggregatedData);
    await fs.writeFile(outputPath, JSON.stringify(outputData, null, 2), 'utf-8');

    return new Response(JSON.stringify({ success: true, data: outputData }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
    });
  }
}
