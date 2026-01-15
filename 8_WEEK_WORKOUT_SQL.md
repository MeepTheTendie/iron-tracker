-- Iron Tracker - 8 Week Beginner Fat Loss Workout Plan
-- Run this in Supabase SQL Editor
-- Based on muscleandstrength.com beginner fat loss program

-- Create exercises table
CREATE TABLE IF NOT EXISTS public.exercises (
id SERIAL PRIMARY KEY,
name TEXT NOT NULL,
muscle_group TEXT,
notes TEXT,
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workouts table  
CREATE TABLE IF NOT EXISTS public.workouts (
id SERIAL PRIMARY KEY,
name TEXT NOT NULL,
day_of_week TEXT NOT NULL, -- 'Monday', 'Wednesday', 'Friday', 'Sunday'
workout_type TEXT NOT NULL, -- 'upper_a', 'lower_a', 'upper_b', 'lower_b'
description TEXT,
phase INTEGER DEFAULT 1,
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workout_exercises junction table
CREATE TABLE IF NOT EXISTS public.workout_exercises (
id SERIAL PRIMARY KEY,
workout_id INTEGER REFERENCES public.workouts(id) ON DELETE CASCADE,
exercise_id INTEGER REFERENCES public.exercises(id) ON DELETE CASCADE,
sets INTEGER NOT NULL DEFAULT 3,
reps INTEGER NOT NULL DEFAULT 10,
rest_seconds INTEGER DEFAULT 45,
sort_order INTEGER DEFAULT 0,
phase INTEGER DEFAULT 1,
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on new tables
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_exercises ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Exercises viewable by authenticated users" ON public.exercises FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Workouts viewable by authenticated users" ON public.workouts FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Workout exercises viewable by authenticated users" ON public.workout_exercises FOR SELECT USING (auth.role() = 'authenticated');

-- Insert exercises
INSERT INTO public.exercises (name, muscle_group, notes) VALUES
('Dumbbell Pullover', 'Chest/Lats', 'Keep arms slightly bent'),
('Dumbbell Bench Press', 'Chest', 'Feet flat on floor'),
('Arnold Press', 'Shoulders', 'Rotate palms as you press'),
('Dumbbell Curl', 'Biceps', 'Keep elbows stationary'),
('Overhead Tricep Extension', 'Triceps', 'Keep upper arms vertical'),
('Lying Leg Raise', 'Abs', 'Lower back pressed to floor'),
('Bent Over Dumbbell Row', 'Back', 'Flat back, pull to hip'),
('Incline Dumbbell Bench Press', 'Chest', 'Set bench to 30-45 degrees'),
('Dumbbell Reverse Fly', 'Rear Delts', 'Squeeze shoulder blades'),
('Cable Curl', 'Biceps', 'Control the negative'),
('Straight Bar Tricep Extension', 'Triceps', 'Elbows pinned to sides'),
('Plank', 'Core', 'Keep body in straight line'),
('Goblet Squat', 'Quads/Glutes', 'Elbows inside knees'),
('Hip Thrust', 'Glutes', 'Squeeze at top'),
('Walking Lunge', 'Quads/Glutes', 'Step forward, back knee down'),
('Stiff Leg Deadlift', 'Hamstrings', 'Feel the stretch'),
('Standing Calf Raise', 'Calves', 'Full range of motion'),
('Oblique Crunch', 'Obliques', 'Rotate at waist'),
('Squat Jumps', 'Quads/Glutes', 'Land soft, explode up'),
('Standing Glute Kickback', 'Glutes', 'Squeeze at top'),
('Leg Curl', 'Hamstrings', 'Control movement'),
('Leg Extension', 'Quads', 'Pause and squeeze'),
('Seated Calf Raise', 'Calves', 'Full stretch'),
('Sit-Up', 'Abs', 'Full range of motion');

-- Insert workouts (Mon/Wed/Fri schedule - no Sunday for church)
INSERT INTO public.workouts (name, day_of_week, workout_type, description) VALUES
('Upper Body A', 'Monday', 'upper_a', 'Dumbbell-focused upper body'),
('Lower Body A', 'Wednesday', 'lower_a', 'Squat and hinge focused'),
('Upper Body B', 'Friday', 'upper_b', 'Row and fly focused');

-- Link exercises to Upper Body A
INSERT INTO public.workout_exercises (workout_id, exercise_id, sets, reps, rest_seconds, sort_order) VALUES
(1, 1, 2, 10, 45, 1),
(1, 2, 2, 10, 45, 2),
(1, 3, 2, 10, 45, 3),
(1, 4, 2, 10, 30, 4),
(1, 5, 2, 10, 30, 5),
(1, 6, 2, 10, 30, 6);

-- Link exercises to Lower Body A
INSERT INTO public.workout_exercises (workout_id, exercise_id, sets, reps, rest_seconds, sort_order) VALUES
(2, 13, 2, 10, 45, 1),
(2, 14, 2, 10, 45, 2),
(2, 15, 2, 10, 45, 3),
(2, 16, 2, 10, 30, 4),
(2, 17, 2, 10, 30, 5),
(2, 18, 2, 10, 30, 6);

-- Link exercises to Upper Body B
INSERT INTO public.workout_exercises (workout_id, exercise_id, sets, reps, rest_seconds, sort_order) VALUES
(3, 7, 2, 20, 45, 1),
(3, 8, 2, 20, 45, 2),
(3, 9, 2, 20, 30, 3),
(3, 10, 2, 20, 30, 4),
(3, 11, 2, 20, 30, 5),
(3, 12, 2, 30, 30, 6);

-- Link exercises to Lower Body B
INSERT INTO public.workout_exercises (workout_id, exercise_id, sets, reps, rest_seconds, sort_order) VALUES
(4, 19, 2, 20, 45, 1),
(4, 20, 2, 20, 45, 2),
(4, 21, 2, 20, 30, 3),
(4, 22, 2, 20, 30, 4),
(4, 23, 2, 20, 30, 5),
(4, 24, 2, 20, 30, 6);

-- Verify
SELECT 'Workouts: ' || COUNT(_) FROM public.workouts;
SELECT 'Exercises: ' || COUNT(_) FROM public.exercises;
SELECT 'Links: ' || COUNT(\*) FROM public.workout_exercises;
