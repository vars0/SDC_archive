import { NextResponse } from "next/server";
import admin from "firebase-admin";

// Firebase Admin 초기화
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(), // 서비스 계정 또는 기본 애플리케이션 자격 증명
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET, // 환경 변수로 버킷 이름 설정
  });
}

// GET 요청 처리
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const filePath = searchParams.get("filePath") || "path/to/default-file.json"; // 쿼리 매개변수에서 파일 경로 가져오기

  try {
    const bucket = admin.storage().bucket();
    const file = bucket.file(filePath);

    // Firebase Storage에서 파일 다운로드
    const [contents] = await file.download();
    const jsonData = JSON.parse(contents); // JSON 데이터 파싱

    return NextResponse.json(jsonData); // JSON 데이터 반환
  } catch (error) {
    console.error("오류 발생:", error);
    if (error.code === 404) {
      return NextResponse.json({ error: "파일을 찾을 수 없습니다." }, { status: 404 });
    }
    return NextResponse.json({ error: "파일을 로드하는 중 문제가 발생했습니다." }, { status: 500 });
  }
}
