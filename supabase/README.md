# Supabase Database Setup

Run these SQL files in order in Supabase SQL Editor.

## Order of Execution

### 1. `01-setup-workout-tables.sql`

**Purpose:** Creates all workout-related tables with proper RLS policies
**What it does:**

- Creates `exercises` table (24 exercises)
- Creates `workouts` table (4 workouts: Mon/Wed/Fri/Sat)
- Creates `workout_exercises` junction table
- Creates `workout_logs` table
- Enables RLS with public read access (works with anon key)
- Inserts all exercise and workout data

**Expected output:**

```
Workouts: 4
Exercises: 24
Links: 24
```

### 2. `02-workout-logs.sql`

**Purpose:** Ensures workout_logs table has proper policies (optional if #1 ran successfully)
**What it does:**

- Creates workout_logs table if missing
- Adds RLS policies for read/write access

## Troubleshooting

If you get "no rows returned" when querying workouts:

1. Check RLS policies exist
2. Verify Supabase URL and anon key in Vercel
3. Hard refresh browser (Ctrl+Shift+R)

## Files in This Directory

- `01-setup-workout-tables.sql` - Main database setup (run this!)
- `02-workout-logs.sql` - Workout logging table (optional)
