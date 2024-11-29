import fs from 'fs';
import path from 'path';
import NavLink from '../components/NavLink';

export default async function EditPage() {
    const jsonDirectory = path.join(process.cwd(), 'info');
    const fileNames = await fs.promises.readdir(jsonDirectory);
    const jsonFiles = fileNames.filter((file) => file.endsWith('.json'));

    return (
        <div>
            <h1>JSON 파일 목록</h1>
            <ul>
                {jsonFiles.map((fileName) => (
                    <li key={fileName}>
                        <NavLink href={`/edit/${fileName.replace('.json', '')}`}>
                            {fileName.replace('.json', '')}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </div>
    );
}
