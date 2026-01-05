-- Jalankan script ini di SQL Editor Neon.tech Anda

CREATE TABLE IF NOT EXISTS guests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  total_guests INTEGER DEFAULT 1,
  attendance TEXT NOT NULL, 
  is_present BOOLEAN DEFAULT FALSE,
  "checkInTime" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Indexing untuk pencarian cepat
CREATE INDEX IF NOT EXISTS idx_guests_name ON guests(name);
CREATE INDEX IF NOT EXISTS idx_guests_phone ON guests(phone);
