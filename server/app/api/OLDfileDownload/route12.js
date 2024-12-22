import { NextResponse } from "next/server";
import admin from "firebase-admin";
import path from "path";
import { log } from "console";

// Firebase Admin 초기화
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_KEY); // 환경 변수에서 서비스 계정 키 가져오기
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET, // 환경 변수로 버킷 이름 설정
  });
}

// if (!admin.apps.length) {
//   // Firebase 서비스 계정 키 파일 경로
//   const serviceAccount = path.resolve("/vars-test-bed-firebase-adminsdk.json"); // 실제 경로로 수정

//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount), // 서비스 계정 키로 인증
//     storageBucket: process.env.FIREBASE_STORAGE_BUCKET, // 환경 변수로 버킷 이름 설정
//   });
// }

// GET 요청 처리
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const filePath = searchParams.get("filePath"); // 쿼리 매개변수에서 파일 경로 가져오기
  let errrrr = "0";


  if (!filePath) {
    return NextResponse.json(
      { error: "filePath 파라미터가 필요합니다." },
      { status: 400 }
    );
  }
  try {
    // Firebase Storage에서 파일 가져오기
    const bucket = admin.storage().bucket();
    errrrr = "1";
    const file = bucket.file(filePath);
    errrrr = "2";
    // 파일 다운로드
    const [contents] = await file.download();
    errrrr = "3";
    const jsonData = JSON.parse(contents.toString()); // Buffer를 문자열로 변환 후 JSON 파싱
    errrrr = "4";
    return NextResponse.json(jsonData); // JSON 데이터 반환
  } catch (error) {
    console.error("오류 발생:", error);
    if (error.code === 404) {
      return NextResponse.json(
        { error: "파일을 찾을 수 없습니다." },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: `${errrrr} 파일을 로드하는 중 문제가 발생했습니다.` },
      { status: 500 }
    );
  }
}
