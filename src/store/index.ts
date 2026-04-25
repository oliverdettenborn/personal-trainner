import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { createWorkoutSlice, WorkoutSlice } from './slices/workoutSlice';

type AppStore = WorkoutSlice;

export const useAppStore = create<AppStore>()(
  devtools(
    (...args) => ({
      ...createWorkoutSlice(...args),
    }),
    { name: 'PersonalTrainerStore' },
  ),
);
