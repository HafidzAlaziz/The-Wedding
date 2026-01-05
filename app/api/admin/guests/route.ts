import sql from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const guests = await sql`
            SELECT * FROM guests ORDER BY "createdAt" DESC
        `;
        return NextResponse.json(guests);
    } catch (error) {
        console.error('Admin Guests API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
