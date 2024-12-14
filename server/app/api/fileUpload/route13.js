import { NextResponse } from "next/server";
import admin from "firebase-admin";

// Firebase Admin 초기화
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET, // 환경 변수로 버킷 설정
  });
}

export async function POST(req) {
  try {
    const bucket = admin.storage().bucket();

    // 요청 본문에서 데이터 읽기
    const { filePath, content } = await req.json(); // filePath와 content는 클라이언트에서 제공

    if (!filePath || !content) {
      return NextResponse.json({ error: "filePath와 content가 필요합니다." }, { status: 400 });
    }

    // Firebase Storage에 파일 업로드
    const file = bucket.file(filePath);
    await file.save(JSON.stringify(content), {
      contentType: "application/json", // JSON 파일의 MIME 타입 설정
    });

    return NextResponse.json({ message: "파일 업로드 성공!", filePath });
  } catch (error) {
    console.error("파일 업로드 오류:", error);
    return NextResponse.json({ error: "파일 업로드 중 문제가 발생했습니다." }, { status: 500 });
  }
}
