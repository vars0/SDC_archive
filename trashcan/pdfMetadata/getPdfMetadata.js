// pages/api/getPdfMetadata.js

import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // 클라이언트에서 보낸 PDF 파일을 받기
      const pdfBuffer = req.body;

      // PDF 파일 로딩
      const pdfDoc = await PDFDocument.load(pdfBuffer);

      // 메타데이터 추출
      const metadata = pdfDoc.getMetadata();

      res.status(200).json(metadata);
    } catch (error) {
      res.status(500).json({ error: 'PDF 처리 중 오류가 발생했습니다.' });
    }
  } else {
    res.status(405).json({ error: '허용되지 않은 HTTP 메소드입니다.' });
  }
}
