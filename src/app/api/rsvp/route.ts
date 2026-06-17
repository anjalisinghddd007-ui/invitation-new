import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, guests, events, foodPreference } = body;

    // Validate inputs
    if (!name || !email || !phone || !events || events.length === 0) {
      return NextResponse.json({ error: 'Missing required RSVP fields.' }, { status: 400 });
    }

    const db = readDb();
    
    // Create new RSVP
    const newRsvp = {
      id: `rsvp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name,
      email,
      phone,
      guests: Number(guests) || 1,
      events,
      foodPreference: foodPreference || 'Vegetarian',
      timestamp: new Date().toISOString()
    };

    db.rsvps.push(newRsvp);
    const success = writeDb(db);

    if (!success) {
      return NextResponse.json({ error: 'Failed to write to database.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, rsvp: newRsvp });
  } catch (error) {
    console.error('RSVP API Error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
