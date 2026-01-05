import sql from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { id } = body;

        // Cari tamu berdasarkan ID
        const guests = await sql`
            SELECT * FROM guests WHERE id = ${id}
        `;

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
            WHERE id = ${id}
        `;

        return NextResponse.json({
            success: true,
            message: `Berhasil! Selamat datang ${guest.name}.`
        });
    } catch (error) {
        console.error('Check-in API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
