import { Assessment } from '@/src/types/assessment';

export type IAssessmentRepository = {
  findAll(): Promise<Assessment[]>;
  insert(assessment: Assessment): Promise<void>;
  upsert(assessment: Assessment): Promise<void>;
  delete(id: string): Promise<void>;
};
