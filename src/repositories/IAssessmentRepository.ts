import { Assessment } from "@/src/types/assessment";

export interface IAssessmentRepository {
  findAll(): Promise<Assessment[]>;
  insert(assessment: Assessment): Promise<void>;
  upsert(assessment: Assessment): Promise<void>;
  delete(id: string): Promise<void>;
}
