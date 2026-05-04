import { Student } from "@/src/types/assessment";

export interface IStudentRepository {
  findAll(): Promise<Student[]>;
  insert(student: Student): Promise<void>;
  delete(id: string): Promise<void>;
}
