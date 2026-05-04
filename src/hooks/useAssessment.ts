import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";

import { Assessment, AssessmentDB } from "../types/assessment";

const STORAGE_KEY = "@caio_oliver_db";

export function useAssessment() {
  const [db, setDb] = useState<AssessmentDB>({ students: {}, assessments: {} });
  const [loading, setLoading] = useState(true);
  const [currentAssessmentId, setCurrentAssessmentId] = useState<string | null>(
    null,
  );

  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentAssessment = currentAssessmentId
    ? db.assessments[currentAssessmentId]
    : null;

  const studentAssessments = useMemo(
    () => (studentId: string) =>
      Object.values(db.assessments)
        .filter((a) => a.studentId === studentId)
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)),
    [db.assessments],
  );

  useEffect(() => {
    const load = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        if (jsonValue != null) {
          setDb(JSON.parse(jsonValue));
        }
      } catch (e) {
        console.error("Erro ao carregar banco de dados", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const saveToStorage = useCallback(async (newDb: AssessmentDB) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newDb));
    } catch (e) {
      console.error("Erro ao salvar no AsyncStorage", e);
    }
  }, []);

  const triggerAutoSave = useCallback(
    (newDb: AssessmentDB) => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
      autoSaveTimer.current = setTimeout(() => saveToStorage(newDb), 3000);
    },
    [saveToStorage],
  );

  const addAssessment = useCallback(
    (studentId: string) => {
      const now = Date.now();
      const id = "a_" + now + "_" + Math.floor(Math.random() * 1000);
      const newAssessment: Assessment = { id, studentId, createdAt: now };

      setDb((prev) => {
        const updated = {
          ...prev,
          assessments: { ...prev.assessments, [id]: newAssessment },
        };
        saveToStorage(updated);
        return updated;
      });

      setCurrentAssessmentId(id);
      return id;
    },
    [saveToStorage],
  );

  const updateAssessment = useCallback(
    (id: string, data: Partial<Assessment>) => {
      setDb((prev) => {
        if (!prev.assessments[id]) return prev;
        const updated = {
          ...prev,
          assessments: {
            ...prev.assessments,
            [id]: { ...prev.assessments[id], ...data },
          },
        };
        triggerAutoSave(updated);
        return updated;
      });
    },
    [triggerAutoSave],
  );

  const removeAssessment = useCallback(
    (id: string) => {
      const studentId = db.assessments[id]?.studentId;
      const assessmentsOfStudent = Object.values(db.assessments)
        .filter((a) => a.studentId === studentId)
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

      let nextId: string | null = null;
      const idx = assessmentsOfStudent.findIndex((a) => a.id === id);
      if (assessmentsOfStudent.length > 1) {
        nextId =
          idx < assessmentsOfStudent.length - 1
            ? assessmentsOfStudent[idx + 1].id
            : assessmentsOfStudent[idx - 1].id;
      }

      setDb((prev) => {
        const newAssessments = { ...prev.assessments };
        delete newAssessments[id];
        const updated = { ...prev, assessments: newAssessments };
        saveToStorage(updated);
        return updated;
      });

      setCurrentAssessmentId((prev) => (prev === id ? nextId : prev));
    },
    [db, saveToStorage],
  );

  const cleanupStudentData = useCallback(
    (studentId: string) => {
      setDb((prev) => {
        const assessments = { ...prev.assessments };
        Object.values(assessments)
          .filter((a) => a.studentId === studentId)
          .forEach((a) => delete assessments[a.id]);
        const updated = { ...prev, assessments };
        saveToStorage(updated);
        return updated;
      });
    },
    [saveToStorage],
  );

  const importFromJSON = useCallback(
    (jsonData: any, studentId: string) => {
      try {
        const assessmentId = "a_" + Date.now();
        const newAssessment: Assessment = {
          ...jsonData,
          id: assessmentId,
          studentId,
          createdAt: Date.now(),
        };

        setDb((prev) => {
          const updated = {
            ...prev,
            assessments: { ...prev.assessments, [assessmentId]: newAssessment },
          };
          saveToStorage(updated);
          return updated;
        });

        setCurrentAssessmentId(assessmentId);
      } catch (e) {
        console.error("Erro na importação do JSON", e);
      }
    },
    [saveToStorage],
  );

  return {
    db,
    loading,
    currentAssessmentId,
    setCurrentAssessmentId,
    currentAssessment,
    studentAssessments,
    addAssessment,
    updateAssessment,
    removeAssessment,
    cleanupStudentData,
    importFromJSON,
    saveManual: () => saveToStorage(db),
  };
}
