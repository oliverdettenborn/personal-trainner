export type WorkoutCategory = 'strength' | 'cardio' | 'flexibility' | 'hiit';

export interface Exercise {
  id: string;
  name: string;
  sets?: number;
  reps?: number;
  durationSeconds?: number;
  restSeconds?: number;
}

export interface Workout {
  id: string;
  name: string;
  category: WorkoutCategory;
  exercises: Exercise[];
  durationMinutes: number;
  createdAt: string;
}
