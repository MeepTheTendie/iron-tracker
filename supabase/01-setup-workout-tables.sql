-- Iron Tracker - Main Database Setup
-- Run this SQL in Supabase SQL Editor
--
-- IMPORTANT: This file creates tables, adds RLS policies, and inserts data.
-- Run this FIRST before any other Supabase SQL files.
--
-- Schedule: Monday (Upper A), Wednesday (Lower A), Friday (Upper B), Saturday (Lower B)

-- ============================================================================
-- STEP 1: Drop existing tables (start fresh)
-- ============================================================================
DROP TABLE IF EXISTS public.workout_exercises CASCADE;
DROP TABLE IF EXISTS public.workouts CASCADE;
DROP TABLE IF EXISTS public.exercises CASCADE;
DROP TABLE IF EXISTS public.workout_logs CASCADE;

-- ============================================================================
-- STEP 2: Create tables
-- ============================================================================

-- Exercises table (24 exercises for the 8-week program)
CREATE TABLE public.exercises (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    muscle_group TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workouts table (4 workouts per week)
CREATE TABLE public.workouts (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    day_of_week TEXT NOT NULL,  -- 'Monday', 'Wednesday', 'Friday', 'Saturday'
    workout_type TEXT NOT NULL, -- 'upper_a', 'lower_a', 'upper_b', 'lower_b'
    description TEXT,
    phase INTEGER DEFAULT 1,    -- For future 8-week progression
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Junction table: links exercises to workouts
CREATE TABLE public.workout_exercises (
    id SERIAL PRIMARY KEY,
    workout_id INTEGER REFERENCES public.workouts(id) ON DELETE CASCADE,
    exercise_id INTEGER REFERENCES public.exercises(id) ON DELETE CASCADE,
    sets INTEGER NOT NULL DEFAULT 3,
    reps INTEGER NOT NULL DEFAULT 10,
    rest_seconds INTEGER DEFAULT 45,
    sort_order INTEGER DEFAULT 0,  -- For display order
    phase INTEGER DEFAULT 1,       -- For future progression
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workout logs table (tracks completed sets)
CREATE TABLE public.workout_logs (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    exercise_name TEXT NOT NULL,
    weight INTEGER,
    reps INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- STEP 3: Enable RLS and create policies (CRITICAL for anon key access)
-- ============================================================================

-- exercises table
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON public.exercises FOR SELECT USING (true);

-- workouts table
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON public.workouts FOR SELECT USING (true);

-- workout_exercises table
ALTER TABLE public.workout_exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON public.workout_exercises FOR SELECT USING (true);

-- workout_logs table
ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON public.workout_logs FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON public.workout_logs FOR INSERT WITH CHECK (true);

-- ============================================================================
-- STEP 4: Insert exercises (24 total)
-- ============================================================================

INSERT INTO public.exercises (name, muscle_group, notes) VALUES
-- Upper Body A
('Dumbbell Pullover', 'Chest/Lats', 'Keep arms slightly bent'),
('Dumbbell Bench Press', 'Chest', 'Feet flat on floor'),
('Arnold Press', 'Shoulders', 'Rotate palms as you press'),
('Dumbbell Curl', 'Biceps', 'Keep elbows stationary'),
('Overhead Tricep Extension', 'Triceps', 'Keep upper arms vertical'),
('Lying Leg Raise', 'Abs', 'Lower back pressed to floor'),
-- Upper Body B
('Bent Over Dumbbell Row', 'Back', 'Flat back, pull to hip'),
('Incline Dumbbell Bench Press', 'Chest', 'Set bench to 30-45 degrees'),
('Dumbbell Reverse Fly', 'Rear Delts', 'Squeeze shoulder blades'),
('Cable Curl', 'Biceps', 'Control the negative'),
('Straight Bar Tricep Extension', 'Triceps', 'Elbows pinned to sides'),
('Plank', 'Core', 'Keep body in straight line'),
-- Lower Body A
('Goblet Squat', 'Quads/Glutes', 'Elbows inside knees'),
('Hip Thrust', 'Glutes', 'Squeeze at top'),
('Walking Lunge', 'Quads/Glutes', 'Step forward, back knee down'),
('Stiff Leg Deadlift', 'Hamstrings', 'Feel the stretch'),
('Standing Calf Raise', 'Calves', 'Full range of motion'),
('Oblique Crunch', 'Obliques', 'Rotate at waist'),
-- Lower Body B
('Squat Jumps', 'Quads/Glutes', 'Land soft, explode up'),
('Standing Glute Kickback', 'Glutes', 'Squeeze at top'),
('Leg Curl', 'Hamstrings', 'Control movement'),
('Leg Extension', 'Quads', 'Pause and squeeze'),
('Seated Calf Raise', 'Calves', 'Full stretch'),
('Sit-Up', 'Abs', 'Full range of motion');

-- ============================================================================
-- STEP 5: Insert workouts (4 total)
-- ============================================================================

INSERT INTO public.workouts (name, day_of_week, workout_type, description) VALUES
('Upper Body A', 'Monday', 'upper_a', 'Dumbbell-focused upper body'),
('Lower Body A', 'Wednesday', 'lower_a', 'Squat and hinge focused'),
('Upper Body B', 'Friday', 'upper_b', 'Row and fly focused'),
('Lower Body B', 'Saturday', 'lower_b', 'Explosive and isolation');

-- ============================================================================
-- STEP 6: Link exercises to workouts (24 links total)
-- ============================================================================

-- Upper Body A (workout_id = 1)
INSERT INTO public.workout_exercises (workout_id, exercise_id, sets, reps, rest_seconds, sort_order) VALUES
(1, 1, 2, 10, 45, 1),  -- Dumbbell Pullover
(1, 2, 2, 10, 45, 2),  -- Dumbbell Bench Press
(1, 3, 2, 10, 45, 3),  -- Arnold Press
(1, 4, 2, 10, 30, 4),  -- Dumbbell Curl
(1, 5, 2, 10, 30, 5),  -- Overhead Tricep Extension
(1, 6, 2, 10, 30, 6);  -- Lying Leg Raise

-- Lower Body A (workout_id = 2)
INSERT INTO public.workout_exercises (workout_id, exercise_id, sets, reps, rest_seconds, sort_order) VALUES
(2, 13, 2, 10, 45, 1), -- Goblet Squat
(2, 14, 2, 10, 45, 2), -- Hip Thrust
(2, 15, 2, 10, 45, 3), -- Walking Lunge
(2, 16, 2, 10, 30, 4), -- Stiff Leg Deadlift
(2, 17, 2, 10, 30, 5), -- Standing Calf Raise
(2, 18, 2, 10, 30, 6); -- Oblique Crunch

-- Upper Body B (workout_id = 3)
INSERT INTO public.workout_exercises (workout_id, exercise_id, sets, reps, rest_seconds, sort_order) VALUES
(3, 7, 2, 20, 45, 1),  -- Bent Over Dumbbell Row
(3, 8, 2, 20, 45, 2),  -- Incline Dumbbell Bench Press
(3, 9, 2, 20, 30, 3),  -- Dumbbell Reverse Fly
(3, 10, 2, 20, 30, 4), -- Cable Curl
(3, 11, 2, 20, 30, 5), -- Straight Bar Tricep Extension
(3, 12, 2, 30, 30, 6); -- Plank

-- Lower Body B (workout_id = 4)
INSERT INTO public.workout_exercises (workout_id, exercise_id, sets, reps, rest_seconds, sort_order) VALUES
(4, 19, 2, 20, 45, 1), -- Squat Jumps
(4, 20, 2, 20, 45, 2), -- Standing Glute Kickback
(4, 21, 2, 20, 30, 3), -- Leg Curl
(4, 22, 2, 20, 30, 4), -- Leg Extension
(4, 23, 2, 20, 30, 5), -- Seated Calf Raise
(4, 24, 2, 20, 30, 6); -- Sit-Up

-- ============================================================================
-- STEP 7: Verify
-- ============================================================================

SELECT 'Workouts created: ' || COUNT(*) as status FROM public.workouts;
SELECT 'Exercises created: ' || COUNT(*) as status FROM public.exercises;
SELECT 'Exercise links created: ' || COUNT(*) as status FROM public.workout_exercises;
