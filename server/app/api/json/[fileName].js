import path from 'path';
import fsPromises from 'fs/promises';

export default async function handler(req, res) {
    const { fileName } = req.query;
    const filePath = path.join(process.cwd(), 'info', fileName);

    if (req.method === 'GET') {
        try {
            const fileContents = await fsPromises.readFile(filePath, 'utf8');
            res.status(200).json(JSON.parse(fileContents));
        } catch (err) {
            res.status(500).json({ error: 'Failed to load JSON' });
        }
    } else if (req.method === 'POST') {
        try {
            await fsPromises.writeFile(filePath, JSON.stringify(req.body, null, 2));
            res.status(200).json({ message: 'File saved successfully' });
        } catch (err) {
            res.status(500).json({ error: 'Failed to save JSON' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
