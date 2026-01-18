# Iron Tracker - Persistent Project Context

**Last Updated:** January 17, 2026 (UI fixes applied)

---

## Quick Status Summary

✅ **Domain:** https://myworkouttracker.xyz (live)  
✅ **Database:** 4 workouts, 24 exercises, 24 links loaded  
✅ **Stack:** React 19, Vite, TanStack Router, Supabase, Tailwind CSS 4  
✅ **Vercel:** Auto-deploys from GitHub

## User Profile

- **Name:** MeepTheTendie
- **Age:** 31, Weight: 280 lbs, Male
- **Goal:** Fat loss through strength training + cardio
- **Job:** Call center (sedentary office work)
- **Step Tracking:** Uses phone app/device (can integrate in future)
- **Schedule:** Mon/Wed/Fri/Sat workouts, Church on Sundays

## Daily Rituals (Always Show in This Order)

1. **15x AM Squats**
2. **7k Steps** (reduced from 10k for sedentary job - user decision)
3. **1 Hour Stationary Bike**
4. **15x PM Squats**

**Feature:** When all 4 completed → Show celebration card ("All Rituals Complete!") instead of list.

## Workout Schedule (8-Week Beginner Fat Loss Program)

| Day       | Workout      | Focus                                     | Exercises   |
| --------- | ------------ | ----------------------------------------- | ----------- |
| Monday    | Upper Body A | Chest, Shoulders, Arms (Dumbbell-focused) | 6 exercises |
| Wednesday | Lower Body A | Quads, Glutes, Hamstrings (Squat/Hinge)   | 6 exercises |
| Friday    | Upper Body B | Back, Rear Delts, Core (Row/Fly-focused)  | 6 exercises |
| Saturday  | Lower Body B | Glutes, Calves (Explosive/Isolation)      | 6 exercises |

## Database Schema (Supabase)

**Tables:**

- `exercises` - 24 rows (reference data)
- `workouts` - 4 rows (schedule)
- `workout_exercises` - 24 rows (links exercises to workouts)
- `workout_logs` - Tracks completed sets with weight/reps
- `daily_habits` - Tracks habit completion by date

**RLS Policies:** All tables have `USING (true)` for anon key access (no auth yet).

## Supabase Project

- **Project ID:** ibgkdujzzovcvyrfibjl
- **URL:** https://ibgkdujzzovcvyrfibjl.supabase.co
- **Anon Key:** Stored in Vercel environment variables
- **Service Role Key:** Available in conversation context (for CLI)

## Important Notes

### Authentication

- No user authentication yet (data is per-device/browser)
- User uses GitHub OAuth for Supabase dashboard login
- Service role key available but Supabase CLI doesn't support GitHub OAuth flow

### Environment Variables (Vercel)

```
VITE_SUPABASE_URL=https://ibgkdujzzovcvyrfibjl.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Known Issues / Gotchas

1. Supabase dashboard requires GitHub OAuth - can't use CLI directly
2. Daily habits table created with upsert on date conflict
3. Workout logs need daily date field populated on insert

## SQL Files Location

All Supabase setup SQL is in `/supabase/` directory:

- `01-setup-workout-tables.sql` - Main database setup (ready to run)

## Communication Style

- Direct and practical
- User likes back-and-forth collaboration
- User prefers I ask questions when unclear
- User appreciates mobile-first design
- User will share credentials when needed for direct access
- **IMPORTANT: Show design changes to user before committing**

## User Preferences Confirmed

✅ Mobile-first design (phone browser primary use)
✅ Bottom navigation bar (Home | History | Exercises)
✅ Clean UI (remove duplicate headers)
✅ Full-width dark header (no white gaps)
✅ Adequate bottom padding (pb-24 for nav bar)
✅ 7k steps goal (not 10k)
✅ Celebration card when all habits complete

## User Declined (For Now)

❌ Progress photos
❌ Meal tracking
❌ User authentication
❌ Social features

## Files Modified (Recent)

- `src/components/Header.tsx` - Mobile bottom nav
- `src/components/HabitTracker.tsx` - Completion celebration
- `src/routes/index.tsx` - Clean dashboard
- `supabase/01-setup-workout-tables.sql` - Database schema

**Redesign attempt (reverted):**

- `src/components/BrushStrokes.tsx` - Created then deleted
- `src/components/MiniMeep.tsx` - Created then deleted

## For Next Session

1. Database is fully set up - no SQL needed
2. App should display today's workout correctly
3. If issues, check Vercel deployment and browser cache
4. User may want to add step tracking integration later
5. User prefers original design - AVOID major redesigns without explicit approval

---

## Session Notes (January 14, 2026)

**Attempted:** Japanese-inspired redesign with:

- Brush stroke decorations and SVG corner flourishes
- Mini Meep mascot character with 5 animated variants
- Fredoka One, Nunito, Space Mono fonts
- Coral/cream/teal/gold color palette
- Framer Motion animations throughout

**Result:** Design didn't meet user expectations, reverted via Vercel instant rollback

**User Preference Confirmed:** Original clean design preferred. Any design changes should be minimal and shown to user before committing.

---

**CONTEXT NOTE:** This file is manually maintained. Update when project structure changes.
