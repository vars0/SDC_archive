import fs from 'fs';
import path from 'path';

const jsonDirectory = path.join(process.cwd(), 'info');

export async function readJson(fileName) {
    const filePath = path.join(jsonDirectory, fileName);
    const fileContent = await fs.promises.readFile(filePath, 'utf8');
    return JSON.parse(fileContent);
}

export async function writeJson(fileName, data) {
    const filePath = path.join(jsonDirectory, fileName);
    await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}
