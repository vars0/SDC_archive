// pages/api/files.js
import { storage, ref, listAll } from "../../../firebaseConfig";

// GET 요청 처리
export async function GET(req) {
  try {
    // 'info' 폴더의 참조 가져오기
    const listRef = ref(storage, 'info');
    
    // 폴더 내 파일 목록 가져오기
    const result = await listAll(listRef);
    const files = result.items.map(item => item.fullPath);

    // 응답 반환
    return new Response(JSON.stringify({ files }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("파일 목록 가져오기 실패:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}