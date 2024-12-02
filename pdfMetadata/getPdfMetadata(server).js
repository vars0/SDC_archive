// pages/api/getPdfMetadata.js

import nextConnect from 'next-connect';
import multer from 'multer';
import { PDFDocument } from 'pdf-lib';

const upload = multer({
  storage: multer.memoryStorage(), // 메모리에 파일 저장
});

const handler = nextConnect();

handler.use(upload.single('file')); // single('file')은 클라이언트에서 전송한 필드명에 맞춰서

handler.post(async (req, res) => {
  try {
    const pdfBuffer = req.file.buffer;
    const pdfDoc = await PDFDocument.load(pdfBuffer);

    // PDF 메타데이터 추출
    const metadata = pdfDoc.getMetadata();

    res.status(200).json(metadata);
  } catch (error) {
    res.status(500).json({ error: 'PDF 처리 중 오류가 발생했습니다.' });
  }
});

export default handler;
