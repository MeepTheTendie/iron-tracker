-- Iron Tracker - 8 Week Beginner Fat Loss Workout Plan
-- Run this SQL in Supabase SQL Editor
-- Based on muscleandstrength.com beginner fat loss program

-- Enable RLS first if not already enabled
ALTER TABLE IF EXISTS EXISTS public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS EXISTS public.workout_exercises ENABLE ROW LEVEL SECURITY;

-- Drop existing tables if they exist (for fresh setup)
DROP TABLE IF EXISTS public.workout_exercises;
DROP TABLE IF EXISTS public.workouts;
DROP TABLE IF EXISTS public.exercises;

-- Create exercises table
CREATE TABLE public.exercises (
id SERIAL PRIMARY KEY,
name TEXT NOT NULL,
muscle_group TEXT,
notes TEXT,
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workouts table
CREATE TABLE public.workouts (
id SERIAL PRIMARY KEY,
name TEXT NOT NULL,
day_of_week TEXT NOT NULL, -- 'Monday', 'Tuesday', etc.
description TEXT,
workout_type TEXT NOT NULL, -- 'upper_a', 'lower_a', 'upper_b', 'lower_b'
phase INTEGER DEFAULT 1, -- Week 1-4 = Phase 1, Week 5-8 = Phase 2
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workout_exercises junction table
CREATE TABLE public.workout_exercises (
id SERIAL PRIMARY KEY,
workout_id INTEGER REFERENCES public.workouts(id) ON DELETE CASCADE,
exercise_id INTEGER REFERENCES public.exercises(id) ON DELETE CASCADE,
sets INTEGER NOT NULL DEFAULT 3,
reps INTEGER NOT NULL DEFAULT 10,
rest_seconds INTEGER DEFAULT 45,
sort_order INTEGER DEFAULT 0,
phase INTEGER DEFAULT 1, -- Which phase this applies to (1 or 2)
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert exercises
INSERT INTO public.exercises (name, muscle_group, notes) VALUES
-- Upper Body A
('Dumbbell Pullover', 'Chest/Lats', 'Keep arms slightly bent throughout'),
('Dumbbell Bench Press', 'Chest', 'Feet flat on floor, back arched slightly'),
('Arnold Press', 'Shoulders', 'Rotate palms as you press up'),
('Dumbbell Curl', 'Biceps', 'Keep elbows stationary'),
('Overhead Tricep Extension', 'Triceps', 'Keep upper arms vertical'),
('Lying Leg Raise', 'Abs', 'Lower back pressed to floor'),
-- Upper Body B
('Bent Over Dumbbell Row', 'Back', 'Flat back, pull to hip'),
('Incline Dumbbell Bench Press', 'Chest', 'Set bench to 30-45 degrees'),
('Dumbbell Reverse Fly', 'Rear Delts', 'Slight bend in elbows, squeeze shoulder blades'),
('Cable Curl', 'Biceps', 'Control the negative'),
('Straight Bar Tricep Extension', 'Triceps', 'Elbows pinned to sides'),
('Plank', 'Core', 'Keep body in straight line'),
-- Lower Body A
('Goblet Squat', 'Quads/Glutes', 'Elbows inside knees at bottom'),
('Hip Thrust', 'Glutes', 'queeze at top, full range of motion'),
('Walking Lunge', 'Quads/Glutes', 'Step forward, back knee almost touches ground'),
('Stiff Leg Deadlift', 'Hamstrings', 'Slight bend in knees, feel the stretch'),
('Standing Calf Raise', 'Calves', 'Full range of motion'),
('Oblique Crunch', 'Obliques', 'Rotate at the waist'),
-- Lower Body B
('Squat Jumps', 'Quads/Glutes', 'Landing soft, explode up'),
('Standing Glute Kickback', 'Glutes', 'Squeeze glute at top'),
('Leg Curl', 'Hamstrings', 'Control the movement'),
('Leg Extension', 'Quads', 'Pause and squeeze at top'),
('Seated Calf Raise', 'Calves', 'Full stretch and contraction'),
('Sit-Up', 'Abs', 'Full range of motion');

-- Insert workouts
INSERT INTO public.workouts (name, day_of_week, description, workout_type, phase) VALUES
('Upper Body A', 'Monday', 'Dumbbell-focused upper body workout', 'upper_a', 1),
('Lower Body A', 'Wednesday', 'Squat and hinge focused lower body', 'lower_a', 1),
('Upper Body B', 'Friday', 'Row and fly focused upper body', 'upper_b', 1),
('Lower Body B', 'Sunday', 'Explosive and isolation lower body', 'lower_b', 1);

-- Link exercises to Upper Body A (Phase 1)
INSERT INTO public.workout_exercises (workout_id, exercise_id, sets, reps, rest_seconds, sort_order, phase) VALUES
(1, 1, 2, 10, 45, 1, 1), -- Dumbbell Pullover
(1, 2, 2, 10, 45, 2, 1), -- Dumbbell Bench Press
(1, 3, 2, 10, 45, 3, 1), -- Arnold Press
(1, 4, 2, 10, 30, 4, 1), -- Dumbbell Curl
(1, 5, 2, 10, 30, 5, 1), -- Overhead Tricep Extension
(1, 6, 2, 10, 30, 6, 1); -- Lying Leg Raise

-- Link exercises to Lower Body A (Phase 1)
INSERT INTO public.workout_exercises (workout_id, exercise_id, sets, reps, rest_seconds, sort_order, phase) VALUES
(2, 13, 2, 10, 45, 1, 1), -- Goblet Squat
(2, 14, 2, 10, 45, 2, 1), -- Hip Thrust
(2, 15, 2, 10, 45, 3, 1), -- Walking Lunge (Each Leg)
(2, 16, 2, 10, 30, 4, 1), -- Stiff Leg Deadlift
(2, 17, 2, 10, 30, 5, 1), -- Standing Calf Raise
(2, 18, 2, 10, 30, 6, 1); -- Oblique Crunch (Each Side)

-- Link exercises to Upper Body B (Phase 1)
INSERT INTO public.workout_exercises (workout_id, exercise_id, sets, reps, rest_seconds, sort_order, phase) VALUES
(3, 7, 2, 20, 45, 1, 1), -- Bent Over Dumbbell Row
(3, 8, 2, 20, 45, 2, 1), -- Incline Dumbbell Bench Press
(3, 9, 2, 20, 30, 3, 1), -- Dumbbell Reverse Fly
(3, 10, 2, 20, 30, 4, 1), -- Cable Curl
(3, 11, 2, 20, 30, 5, 1), -- Straight Bar Tricep Extension
(3, 12, 2, 30, 30, 6, 1); -- Plank

-- Link exercises to Lower Body B (Phase 1)
INSERT INTO public.workout_exercises (workout_id, exercise_id, sets, reps, rest_seconds, sort_order, phase) VALUES
(4, 19, 2, 20, 45, 1, 1), -- Squat Jumps
(4, 20, 2, 20, 45, 2, 1), -- Standing Glute Kickback (Each Leg)
(4, 21, 2, 20, 30, 3, 1), -- Leg Curl
(4, 22, 2, 20, 30, 4, 1), -- Leg Extension
(4, 23, 2, 20, 30, 5, 1), -- Seated Calf Raise
(4, 24, 2, 20, 30, 6, 1); -- Sit-Up

-- RLS Policies (read-only for authenticated users)
CREATE POLICY "Workouts viewable by authenticated users" ON public.workouts
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Exercises viewable by authenticated users" ON public.exercises
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Workout exercises viewable by authenticated users" ON public.workout_exercises
FOR SELECT USING (auth.role() = 'authenticated');

-- Add workout_logs table for tracking completed sets
CREATE TABLE IF NOT EXISTS public.workout_set_logs (
id SERIAL PRIMARY KEY,
workout_id INTEGER REFERENCES public.workouts(id),
exercise_id INTEGER REFERENCES public.exercises(id),
user_id UUID, -- TODO: Add auth integration later
set_number INTEGER NOT NULL,
weight_lbs INTEGER,
reps_completed INTEGER NOT NULL,
completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
notes TEXT
);

CREATE POLICY "Authenticated users can manage set logs" ON public.workout_set_logs
FOR ALL USING (auth.role() = 'authenticated');

-- Verify setup
SELECT 'Workouts created: ' || COUNT(_) as workout_count FROM public.workouts;
SELECT 'Exercises created: ' || COUNT(_) as exercise_count FROM public.exercises;
SELECT 'Exercise links created: ' || COUNT(\*) as link_count FROM public.workout_exercises;
