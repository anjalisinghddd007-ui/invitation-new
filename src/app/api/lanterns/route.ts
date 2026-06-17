import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function GET() {
  try {
    const db = readDb();
    return NextResponse.json({ lanterns: db.lanterns });
  } catch (error) {
    console.error('GET Lanterns Error:', error);
    return NextResponse.json({ error: 'Failed to retrieve lanterns.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, wish } = body;

    if (!name || !wish) {
      return NextResponse.json({ error: 'Missing name or wish details.' }, { status: 400 });
    }

    const db = readDb();

    // Create a new lantern entry
    const newLantern = {
      id: `l-${Date.now()}`,
      name,
      wish,
      timestamp: new Date().toISOString()
    };

    db.lanterns.push(newLantern);
    const success = writeDb(db);

    if (!success) {
      return NextResponse.json({ error: 'Failed to log lantern release.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, lantern: newLantern });
  } catch (error) {
    console.error('POST Lanterns Error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
