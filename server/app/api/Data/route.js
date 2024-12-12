import fs from 'fs';
import path from 'path';

export async function GET() {
  const filePath = path.join(process.cwd(), 'data', 'eventData.json');

  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return new Response(data, { status: 200 });
  } catch (error) {
    return new Response('Error reading data', { status: 500 });
  }
}

export async function POST(request) {
  const filePath = path.join(process.cwd(), 'data', 'eventData.json');
  const body = await request.json();

  try {
    fs.writeFileSync(filePath, JSON.stringify(body, null, 2), 'utf8');
    return new Response('Data saved successfully', { status: 200 });
  } catch (error) {
    return new Response('Error saving data', { status: 500 });
  }
}
