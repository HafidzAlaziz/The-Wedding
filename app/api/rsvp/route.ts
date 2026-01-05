import sql from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, phone, total_guests, attendance } = body;

        const result = await sql`
            INSERT INTO guests (name, phone, total_guests, attendance)
            VALUES (${name}, ${phone}, ${total_guests}, ${attendance})
            RETURNING id
        `;

        return NextResponse.json(result[0]);
    } catch (error) {
        console.error('RSVP API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
