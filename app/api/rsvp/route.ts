import sql from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { guest_names, total_guests } = body;

        // Backward compatibility for 'name' if needed, or just use first guest
        const main_name = guest_names && guest_names.length > 0 ? guest_names[0] : "Tamu";

        // Generate Short Unique Code (3-5 chars)
        const unique_code = Math.random().toString(36).substring(2, 7).toUpperCase();

        const result = await sql`
            INSERT INTO guests (name, total_guests, guest_names, unique_code)
            VALUES (${main_name}, ${total_guests}, ${JSON.stringify(guest_names)}, ${unique_code})
            RETURNING id, unique_code
        `;

        return NextResponse.json(result[0]);
    } catch (error) {
        console.error('RSVP API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
