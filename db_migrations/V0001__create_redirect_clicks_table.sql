-- Create table for tracking redirect clicks
CREATE TABLE IF NOT EXISTS redirect_clicks (
    id SERIAL PRIMARY KEY,
    clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_agent TEXT,
    ip_address TEXT
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_clicked_at ON redirect_clicks(clicked_at DESC);
