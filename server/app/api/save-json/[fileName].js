import { writeJson } from '../utils/fileOperations';

export default async function handler(req, res) {
    const { fileName } = req.query;

    if (req.method === 'POST') {
        try {
            const data = req.body;
            await writeJson(`${fileName}.json`, data);
            res.status(200).json({ message: '파일 저장 완료' });
        } catch (error) {
            res.status(500).json({ error: '파일 저장 중 에러 발생' });
        }
    } else {
        res.status(405).json({ error: '허용되지 않은 메소드' });
    }
}
