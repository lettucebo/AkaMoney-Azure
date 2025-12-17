-- Migration: Create clickinfo table for click tracking
-- Database: akamoney-clicks (Cloudflare D1)

CREATE TABLE IF NOT EXISTS clickinfo (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL,
    user_agent TEXT,
    referrer TEXT,
    ip_address TEXT,
    timestamp TEXT NOT NULL
);

-- Index for querying clicks by short URL code
CREATE INDEX IF NOT EXISTS idx_clickinfo_code ON clickinfo(code);

-- Index for querying clicks by timestamp
CREATE INDEX IF NOT EXISTS idx_clickinfo_timestamp ON clickinfo(timestamp);
