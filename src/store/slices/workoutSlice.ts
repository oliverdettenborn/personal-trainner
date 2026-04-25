import { StateCreator } from 'zustand';
import type { Workout } from '@/types/workout';

export interface WorkoutSlice {
  workouts: Workout[];
  isLoading: boolean;
  setWorkouts: (workouts: Workout[]) => void;
  setLoading: (loading: boolean) => void;
}

export const createWorkoutSlice: StateCreator<WorkoutSlice> = (set) => ({
  workouts: [],
  isLoading: false,
  setWorkouts: (workouts) => set({ workouts }),
  setLoading: (isLoading) => set({ isLoading }),
});
