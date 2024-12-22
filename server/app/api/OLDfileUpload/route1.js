import { NextResponse } from "next/server";
import admin from "firebase-admin";
// import { json } from "stream/consumers";

// Firebase Admin 초기화 (이미 초기화된 경우 다시 하지 않도록)
if (!admin.apps.length) {
  // Firebase 서비스 계정 키 파일 경로
  const serviceAccount = path.resolve("./vars-test-bed-firebase-adminsdk.json"); // 서비스 계정 경로
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET, // 환경 변수로 버킷 이름 설정
  });
}

export async function POST(req) {
  try {
    // 요청 본문에서 JSON 데이터 읽기
    const { filePath, content } = await req.json();

    if (!filePath || !content) {
      return NextResponse.json(
        { error: "filePath와 content가 필요합니다." },
        { status: 400 }
      );
    }

    // Firebase Storage에 업로드할 파일 버퍼 생성
    const bucket = admin.storage().bucket();
    const file = bucket.file(filePath);

    // JSON 객체를 문자열로 변환 후 버퍼로
    const buffer = Buffer.from(JSON.stringify(content));

    // 업로드
    await file.save(buffer, {
      contentType: "application/json",
      public: true, // 파일을 공개로 설정하려면 true
    });

    return NextResponse.json({ message: "파일 업로드 성공" }); // 성공 메시지 반환
  } catch (error) {
    console.error("업로드 중 오류 발생:", error);
    return NextResponse.json(
      { error: "파일 업로드 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
