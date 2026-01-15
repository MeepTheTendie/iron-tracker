# Supabase RLS Security Fix - Iron Tracker

## Critical Security Issue

Your database tables have Row Level Security (RLS) disabled, exposing your data to public access.

## Instructions

Run these SQL commands in your Supabase SQL Editor to fix the security issues.

### Step 1: Enable RLS on All Tables

```sql
-- Enable RLS on all tables
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;
```

### Step 2: Create Security Policies

**Note**: Since your app doesn't currently use Supabase Auth (no user authentication), these policies allow access for authenticated users. If you add authentication later, you'll need to add `user_id` columns and update the policies.

```sql
-- Programs table (reference data - read-only for authenticated users)
CREATE POLICY "Programs are viewable by authenticated users" ON public.programs
  FOR SELECT USING (auth.role() = 'authenticated');

-- Program exercises table (reference data)
CREATE POLICY "Program exercises are viewable by authenticated users" ON public.program_exercises
  FOR SELECT USING (auth.role() = 'authenticated');

-- Exercises table (reference data)
CREATE POLICY "Exercises are viewable by authenticated users" ON public.exercises
  FOR SELECT USING (auth.role() = 'authenticated');

-- Daily habits table (user data - allow authenticated users full access)
CREATE POLICY "Authenticated users can view habits" ON public.daily_habits
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert habits" ON public.daily_habits
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update habits" ON public.daily_habits
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete habits" ON public.daily_habits
  FOR DELETE USING (auth.role() = 'authenticated');

-- Workout logs table (user data - allow authenticated users full access)
CREATE POLICY "Authenticated users can view workout logs" ON public.workout_logs
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert workout logs" ON public.workout_logs
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update workout logs" ON public.workout_logs
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete workout logs" ON public.workout_logs
  FOR DELETE USING (auth.role() = 'authenticated');
```

### Step 3: Verify RLS is Enabled

Run this query to verify all tables have RLS enabled:

```sql
SELECT tablename, row_security_active
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('programs', 'program_exercises', 'exercises', 'daily_habits', 'workout_logs');
```

Expected output: All tables should show `true` for `row_security_active`.

### Step 4 to Supabase

: Add Your Domain1. Go to Supabase Dashboard → Authentication → URL Configuration 2. Add `https://myworkouttracker.xyz` to "Redirect URLs" 3. Click Save

## Future Enhancement: Multi-User Support

To support multiple users with proper data isolation:

1. **Add Supabase Authentication**: Enable Email/Password auth in Supabase
2. **Add user_id columns**:
   ```sql
   ALTER TABLE public.daily_habits ADD COLUMN user_id UUID REFERENCES auth.users(id);
   ALTER TABLE public.workout_logs ADD COLUMN user_id UUID REFERENCES auth.users(id);
   ```
3. **Update RLS policies** to filter by user_id:
   ```sql
   CREATE POLICY "Users can only view their own habits" ON public.daily_habits
     FOR SELECT USING (auth.uid() = user_id);
   ```
4. **Update app code** to include user_id in inserts

## Verification

After running the SQL commands:

- Security Advisor warnings should disappear
- Your app should continue working (since it uses the anon key for authenticated requests)
- Unauthorized users cannot access your data

---

Generated: 2026-01-14
Project: Iron Tracker
Domain: myworkouttracker.xyz
