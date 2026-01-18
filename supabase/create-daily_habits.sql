-- Create daily_habits table for tracking daily rituals
CREATE TABLE IF NOT EXISTS daily_habits (
  date DATE PRIMARY KEY,
  am_squats BOOLEAN DEFAULT FALSE,
  steps_7k BOOLEAN DEFAULT FALSE,
  bike_1hr BOOLEAN DEFAULT FALSE,
  pm_squats BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disable RLS for this table (app uses anon key)
ALTER TABLE daily_habits DISABLE ROW LEVEL SECURITY;

-- Insert a test record
INSERT INTO daily_habits (date, am_squats, steps_7k, bike_1hr, pm_squats)
VALUES ('2026-01-18', FALSE, FALSE, FALSE, FALSE)
ON CONFLICT (date) DO NOTHING;

-- Verify
SELECT * FROM daily_habits ORDER BY date DESC LIMIT 7;
