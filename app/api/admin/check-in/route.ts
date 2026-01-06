import sql from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { id, unique_code } = body;

        let guests;

        if (id) {
            guests = await sql`SELECT * FROM guests WHERE id = ${id}`;
        } else if (unique_code) {
            // Case insensitive search for unique code
            guests = await sql`SELECT * FROM guests WHERE unique_code = ${unique_code.toUpperCase()}`;
        } else {
            return NextResponse.json({ error: 'Data tidak valid' }, { status: 400 });
        }

        if (guests.length === 0) {
            return NextResponse.json({ error: 'Tamu tidak ditemukan' }, { status: 404 });
        }

        const guest = guests[0];

        if (guest.is_present) {
            return NextResponse.json({
                error: `Tamu ${guest.name} sudah melakukan check-in sebelumnya.`
            }, { status: 400 });
        }

        // Update status kehadiran
        await sql`
            UPDATE guests 
            SET is_present = true, "checkInTime" = NOW() 
            WHERE id = ${guest.id}
        `;

        return NextResponse.json({
            success: true,
            message: `Berhasil! Selamat datang ${guest.name}.`,
            guestName: guest.name,
            guestNames: guest.guest_names,
            totalGuests: guest.total_guests
        });
    } catch (error) {
        console.error('Check-in API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
