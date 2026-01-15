# Iron Tracker - Project Context

Last updated: January 14, 2026

## Project Overview

A mobile-first workout and habit tracking web app for strength training progress.

**Domain:** https://myworkouttracker.xyz  
**Stack:** React 19, Vite, TanStack Router, Supabase, Tailwind CSS 4, Recharts  
**Platform:** Vercel (auto-deploys from GitHub)

## User Profile

- **Name:** MeepTheTendie
- **Age:** 31
- **Weight:** 280 lbs
- **Goal:** Fat loss through strength training + cardio
- **Job:** Call center (sedentary office work)
- **Schedule:** Mon/Wed/Fri/Sat workouts, Church on Sundays

## Daily Rituals

1. 15x AM Squats
2. 7k Steps (reduced from 10k for sedentary job)
3. 1 Hour Stationary Bike
4. 15x PM Squats

**Feature:** When all 4 habits are completed, shows a celebration card instead of the list.

## Workout Program (8-Week Beginner Fat Loss)

### Schedule

| Day       | Workout      | Focus                                     |
| --------- | ------------ | ----------------------------------------- |
| Monday    | Upper Body A | Chest, Shoulders, Arms (Dumbbell-focused) |
| Wednesday | Lower Body A | Quads, Glutes, Hamstrings (Squat/Hinge)   |
| Friday    | Upper Body B | Back, Rear Delts, Core (Row/Fly-focused)  |
| Saturday  | Lower Body B | Glutes, Calves (Explosive/Isolation)      |

### Database Tables

- `exercises` - 24 exercises
- `workouts` - 4 workouts
- `workout_exercises` - Links exercises to workouts
- `workout_logs` - Tracks completed sets (weight/reps)
- `daily_habits` - Tracks daily rituals

### RLS Policy Note

All tables use `USING (true)` for public read access via anon key (since no user auth yet).

## UI/UX Preferences

- **Mobile-first design** - Primary use case is phone browser
- **Bottom navigation bar** - Home | History | Exercises
- **Clean interface** - Remove duplicate titles/headers
- **Full-width dark header** - No white gaps
- **Adequate bottom padding** - pb-24 to prevent button cutoff

## SQL Files Location

All Supabase setup SQL is in `/supabase/` directory:

- `01-setup-workout-tables.sql` - Main database setup (run this!)

## Supabase Project

- **Project ID:** ibgkdujzzovcvyrfibjl
- **URL:** https://ibgkdujzzovcvyrfibjl.supabase.co

## Known Issues / TODOs

1. `daily_habits` table may not exist - check Supabase Table Editor
2. May need to run SQL to create daily_habits table if missing
3. No user authentication - data is currently per-device

## User Communication Style

- Direct and practical
- Appreciates mobile optimization
- Likes iterative improvements
- Prefers SQL files reviewed before running in Supabase
- Enjoys collaborative problem-solving

## Questions for Future Discussion

1. Should we add user authentication (Supabase Auth)?
2. Do you want progress photos or measurements tracking?
3. Need help creating a meal tracking feature?
4. Interest in workout reminders/notifications?
5. Should we add social features (share progress)?

---

**Note:** This context is manually maintained. Update as project evolves.
