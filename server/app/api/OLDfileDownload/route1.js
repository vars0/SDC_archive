import { NextResponse } from "next/server";
import { storage } from "../../../firebaseConfig";
import { ref, getDownloadURL } from "firebase/storage";
import fetch from "node-fetch"; // 서버에서 fetch 사용
import path from "path";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const filePath = searchParams.get("filePath");

  if (!filePath) {
    return NextResponse.json(
      { error: "filePath 파라미터가 필요합니다." },
      { status: 400 }
    );
  }

  try {
    // Firebase Storage에서 파일 URL 가져오기
    const storageRef = ref(storage, filePath);
    const downloadURL = await getDownloadURL(storageRef);

    // 파일 데이터 가져오기
    const fileResponse = await fetch(downloadURL);
    if (!fileResponse.ok) {
      throw new Error("Firebase Storage에서 파일을 가져오는 중 오류가 발생했습니다.");
    }

    const fileContents = await fileResponse.text();

    // JSON 데이터 반환
    try {
      const jsonData = JSON.parse(fileContents); // JSON으로 파싱
      return NextResponse.json(jsonData);
    } catch (err) {
      console.error("파일을 JSON으로 파싱할 수 없습니다:", err);
      return NextResponse.json(
        { error: "파일이 JSON 형식이 아닙니다." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("오류 발생:", error);
    return NextResponse.json(
      { error: "파일을 로드하는 중 문제가 발생했습니다." },
      { status: 500 }
    );
  }
}
