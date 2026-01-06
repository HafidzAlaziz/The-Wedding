-- Hapus kolom yang tidak lagi digunakan
ALTER TABLE guests DROP COLUMN IF EXISTS phone;
ALTER TABLE guests DROP COLUMN IF EXISTS attendance;
