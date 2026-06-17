import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function GET() {
  try {
    const db = readDb();
    return NextResponse.json({ wishes: db.wishes });
  } catch (error) {
    console.error('GET Wishes Error:', error);
    return NextResponse.json({ error: 'Failed to retrieve wishes.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, text, color } = body;

    if (!name || !text) {
      return NextResponse.json({ error: 'Missing name or blessing text.' }, { status: 400 });
    }

    const db = readDb();

    // Create a new wish card
    const newWish = {
      id: `wish-${Date.now()}`,
      name,
      text,
      color: color || '#FAF8F3',
      timestamp: new Date().toISOString()
    };

    db.wishes.push(newWish);
    const success = writeDb(db);

    if (!success) {
      return NextResponse.json({ error: 'Failed to save wish.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, wish: newWish });
  } catch (error) {
    console.error('POST Wishes Error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
