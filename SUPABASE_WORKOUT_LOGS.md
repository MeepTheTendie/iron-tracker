# Create workout_logs Table

Run this SQL in Supabase SQL Editor to create the workout_logs table:

```sql
-- Create workout_logs table
CREATE TABLE public.workout_logs (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    exercise_name TEXT NOT NULL,
    weight INTEGER,
    reps INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Workout logs viewable by authenticated users" ON public.workout_logs
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Workout logs insertable by authenticated users" ON public.workout_logs
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Workout logs deletable by authenticated users" ON public.workout_logs
    FOR DELETE USING (auth.role() = 'authenticated');

-- Verify
SELECT COUNT(*) as log_count FROM public.workout_logs;
```

This fixes the "Could not find the table 'public.workout_logs'" error.
