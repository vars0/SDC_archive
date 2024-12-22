// app/api/GetFileData/route.js
import { storage, ref, getDownloadURL } from "../../../firebaseConfig";

// 파일을 다운로드하여 데이터를 반환하는 API
export async function GET(req) {
  try {
    // 요청 파라미터에서 파일 이름 추출
    const url = new URL(req.url);
    const fileName = url.searchParams.get('fileName');  // 쿼리 파라미터로 파일 이름을 받음

    if (!fileName) {
      return new Response(
        JSON.stringify({ error: "파일 이름을 제공해야 합니다." }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Firebase Storage의 해당 파일 참조
    const fileRef = ref(storage, `${fileName}`);

    // 해당 파일의 다운로드 URL 가져오기
    const downloadURL = await getDownloadURL(fileRef);

    // 다운로드 URL을 통해 파일 데이터 가져오기
    const fileResponse = await fetch(downloadURL);
    if (!fileResponse.ok) {
      throw new Error('파일을 다운로드하는 데 실패했습니다.');
    }

    // 파일 데이터 반환
    const fileData = await fileResponse.arrayBuffer();  // 파일을 ArrayBuffer 형식으로 받기
    
    return new Response(fileData, {
      status: 200,
      headers: { 'Content-Type': 'application/octet-stream' }  // 파일 데이터를 반환
    });

  } catch (error) {
    console.error("파일 데이터 가져오기 실패:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
