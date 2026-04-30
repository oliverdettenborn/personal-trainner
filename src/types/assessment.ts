export interface Student {
  id: string;
  name: string;
  createdAt: number;
}

export type SnapshotSide = "front" | "back" | "side" | "other";
export type SnapshotMoment = "before" | "after" | "during";

export interface AssessmentSnapshot {
  id: string;
  assessmentId: string;
  side: SnapshotSide;
  moment: SnapshotMoment;
  photoUrl?: string;
  date?: string; // YYYY-MM-DD from Postgres DATE
  weight?: number; // float from Postgres FLOAT
}

export interface AssessmentMetric {
  id: string;
  assessmentId: string;
  name: string;
  value: number; // float from Postgres FLOAT
  unit?: string;
  position: number;
}

export interface AssessmentFeedback {
  id: string;
  assessmentId: string;
  category: string;
  content: string;
  position: number;
}

export interface Assessment {
  id: string;
  studentId: string;
  createdAt: number;
  notes?: string;
  next_goal?: string;

  // For the extensible model
  snapshots?: AssessmentSnapshot[];
  metrics?: AssessmentMetric[];
  feedback?: AssessmentFeedback[];

  // Legacy fields (kept for backward compatibility during migration)
  front_before_date?: string;
  front_before_weight?: string;
  front_before_cintura?: string;
  front_after_date?: string;
  front_after_weight?: string;
  front_after_cintura?: string;
  back_before_date?: string;
  back_before_weight?: string;
  back_before_cintura?: string;
  back_after_date?: string;
  back_after_weight?: string;
  back_after_cintura?: string;
  positive_items?: string[];
  adjustment_items?: string[];
  photo_front_before?: string;
  photo_front_after?: string;
  photo_back_before?: string;
  photo_back_after?: string;
}

export interface AssessmentDB {
  students: Record<string, Student>;
  assessments: Record<string, Assessment>;
}
