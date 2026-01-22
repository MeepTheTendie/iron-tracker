# Iron Tracker - Persistent Project Context

**Last Updated:** January 18, 2026 - Migrated to Convex!

---

## Quick Status Summary

✅ **Domain:** https://myworkouttracker.xyz (live)  
✅ **Database:** Convex (migrated from Supabase!)  
✅ **Stack:** React 19, Vite, TanStack Router, Convex, Tailwind CSS 4  
✅ **Deployment:** Vercel auto-deploys from GitHub (no CI workflow needed)

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

## Database (Convex)

**Tables:**

- `dailyHabits` - Tracks habit completion by date
- `workouts` - 4 rows (schedule)
- `exercises` - 24 rows (reference data)
- `workoutExercises` - 24 rows (links exercises to workouts)

## Setup Instructions

### First Time Setup

```bash
cd iron-tracker
npx convex dev
```

This will:

1. Create a Convex project
2. Update .env.local with VITE_CONVEX_URL
3. Auto-create tables from schema.ts
4. Seed the database with workouts and exercises

### Environment Variables

After running `npx convex dev`, your .env.local will have:

```
VITE_CONVEX_URL=https://<project-name>.convex.cloud
```

## Migration from Supabase (January 18, 2026)

- Migrated from Supabase to Convex for simpler DX
- No RLS policies needed
- No SQL migrations
- Functions + tables defined in TypeScript
- Same backend as Toku Tracker

## Important Notes

### Authentication

- No user authentication yet (data is per-device/browser)
- User uses GitHub OAuth for Convex dashboard login (if needed)

### Setup Commands

```bash
# Set up Convex (first time)
cd iron-tracker
npx convex dev

# Run development server
npm run dev

# Build for production
npm run build
```

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
✅ Wes Anderson aesthetic (pastel colors, clean minimalism)
✅ ALL IN ON CONVEX (no more Supabase!)

## Files Modified (Recent)

- `src/lib/convex.ts` - Convex client setup
- `convex/schema.ts` - Database schema
- `convex/dailyHabits.ts` - Habits queries/mutations
- `convex/workouts.ts` - Workout queries
- `src/routes/index.tsx` - Uses Convex instead of Supabase
- `src/components/HabitTracker.tsx` - Uses Convex
- `src/components/WorkoutCard.tsx` - Uses Convex data format
- `.env` - Updated for Convex

---

**PERMANENT RULE (Jan 18, 2026): NO Supabase - use Convex only**

---

**CONTEXT NOTE:** This file is manually maintained. Update when project structure changes.
