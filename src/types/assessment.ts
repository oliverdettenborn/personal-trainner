export interface Student {
  id: string;
  name: string;
  createdAt: number;
}

export interface Assessment {
  id: string;
  studentId: string;
  createdAt: number;

  front_before_date?: string;
  front_before_weight?: string;
  front_after_date?: string;
  front_after_weight?: string;

  back_before_date?: string;
  back_before_weight?: string;
  back_after_date?: string;
  back_after_weight?: string;

  positive_items?: string[];
  adjustment_items?: string[];

  notes?: string;
  next_goal?: string;

  photo_front_before?: string;
  photo_front_after?: string;
  photo_back_before?: string;
  photo_back_after?: string;
}

export interface AssessmentDB {
  students: Record<string, Student>;
  assessments: Record<string, Assessment>;
}
