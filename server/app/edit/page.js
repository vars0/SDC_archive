import path from 'path';
import fs from 'fs';
import JSONEditor from '../components/JSONEditor';

export default async function EditPage() {
    // JSON 파일 목록 가져오기
    const jsonDirectory = path.join(process.cwd(), 'info');
    const fileNames = await fs.promises.readdir(jsonDirectory);
    const jsonFiles = fileNames.filter((file) => file.endsWith('.json'));

    return (
        <div>
            <h1>Edit JSON Files</h1>
            <div>
                {jsonFiles.map((fileName) => (
                    <JSONEditor key={fileName} fileName={fileName} />
                ))}
            </div>
        </div>
    );
}
