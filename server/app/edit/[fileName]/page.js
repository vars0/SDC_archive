import { readJson } from '../../utils/fileOperations';
import EditorClient from './EditorClient';

export default async function EditFilePage({ params }) {
    const { fileName } = params;

    // JSON 데이터 읽기
    const data = await readJson(`${fileName}.json`);

    return (
        <div>
            <h1>{fileName} 파일 편집</h1>
            <EditorClient fileName={fileName} initialData={data} />
        </div>
    );
}
