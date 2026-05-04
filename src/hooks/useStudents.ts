import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect, useCallback, useMemo } from "react";

import { Student } from "../types/assessment";
import { createStudentRepository } from "@repositories/index";

const STORAGE_KEY = "@caio_oliver_db";
const MIGRATION_FLAG = "@migration_v1_students_done";

export function useStudents(userId: string | null) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStudentId, setCurrentStudentId] = useState<string | null>(null);

  const repo = useMemo(
    () => (userId ? createStudentRepository(userId) : null),
    [userId],
  );

  useEffect(() => {
    if (!repo) return;

    const init = async () => {
      const migrated = await AsyncStorage.getItem(MIGRATION_FLAG);
      if (!migrated) {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const db = JSON.parse(raw);
          const existing = Object.values(db.students ?? {}) as Student[];
          await Promise.all(existing.map((s) => repo.insert(s).catch(() => {})));
        }
        await AsyncStorage.setItem(MIGRATION_FLAG, "1");
      }

      const data = await repo.findAll();
      setStudents(data);
      if (data.length > 0) setCurrentStudentId(data[0].id);
    };

    init().finally(() => setLoading(false));
  }, [repo]);

  const addStudent = useCallback(
    async (name: string): Promise<string> => {
      if (!repo) throw new Error("Not authenticated");
      const student: Student = {
        id: `s_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        name,
        createdAt: Date.now(),
      };
      await repo.insert(student);
      setStudents((prev) => [...prev, student]);
      setCurrentStudentId(student.id);
      return student.id;
    },
    [repo],
  );

  const removeStudent = useCallback(
    async (id: string) => {
      if (!repo) return;
      await repo.delete(id);
      setStudents((prev) => prev.filter((s) => s.id !== id));
      setCurrentStudentId((prev) => (prev === id ? null : prev));
    },
    [repo],
  );

  return {
    students,
    loading,
    currentStudentId,
    setCurrentStudentId,
    addStudent,
    removeStudent,
  };
}
