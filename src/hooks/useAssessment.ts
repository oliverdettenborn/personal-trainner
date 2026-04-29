import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";

import { Student, Assessment, AssessmentDB } from "../types/assessment";

const STORAGE_KEY = "@caio_oliver_db";

export function useAssessment(_userId: string | null) {
  const [db, setDb] = useState<AssessmentDB>({ students: {}, assessments: {} });
  const [loading, setLoading] = useState(true);
  const [currentStudentId, setCurrentStudentId] = useState<string | null>(null);
  const [currentAssessmentId, setCurrentAssessmentId] = useState<string | null>(
    null,
  );

  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- COMPUTED ---
  const currentStudent = currentStudentId
    ? db.students[currentStudentId]
    : null;
  const currentAssessment = currentAssessmentId
    ? db.assessments[currentAssessmentId]
    : null;

  const studentAssessments = useMemo(() => {
    if (!currentStudentId) return [];
    return Object.values(db.assessments)
      .filter((a) => a.studentId === currentStudentId)
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  }, [db.assessments, currentStudentId]);

  // Carregar dados iniciais
  useEffect(() => {
    const loadDB = async () => {
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
    loadDB();
  }, []);

  // Salvar no AsyncStorage
  const saveToStorage = useCallback(async (newDb: AssessmentDB) => {
    try {
      const jsonValue = JSON.stringify(newDb);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (e) {
      console.error("Erro ao salvar no AsyncStorage", e);
    }
  }, []);

  // Trigger de Autosave (Debounce)
  const triggerAutoSave = useCallback(
    (newDb: AssessmentDB) => {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }
      autoSaveTimer.current = setTimeout(() => {
        saveToStorage(newDb);
      }, 3000);
    },
    [saveToStorage],
  );

  // --- STUDENT ACTIONS ---
  const addStudent = useCallback(
    (name: string) => {
      const now = Date.now();
      const sId = "s_" + now + "_" + Math.floor(Math.random() * 1000);
      const newStudent: Student = { id: sId, name, createdAt: now };

      // Auto-criar primeira avaliação
      const aId = "a_" + now + "_" + Math.floor(Math.random() * 1000);
      const firstAssessment: Assessment = {
        id: aId,
        studentId: sId,
        createdAt: now,
      };

      setDb((prev) => {
        const updated = {
          ...prev,
          students: { ...prev.students, [sId]: newStudent },
          assessments: { ...prev.assessments, [aId]: firstAssessment },
        };
        saveToStorage(updated);
        return updated;
      });

      setCurrentStudentId(sId);
      setCurrentAssessmentId(aId);
      return sId;
    },
    [saveToStorage],
  );

  const removeStudent = useCallback(
    (id: string) => {
      setDb((prev) => {
        const newStudents = { ...prev.students };
        delete newStudents[id];

        const newAssessments = { ...prev.assessments };
        Object.keys(newAssessments).forEach((aid) => {
          if (newAssessments[aid].studentId === id) {
            delete newAssessments[aid];
          }
        });

        const updated = { students: newStudents, assessments: newAssessments };
        saveToStorage(updated);
        return updated;
      });

      setCurrentStudentId((prev) => (prev === id ? null : prev));
      setCurrentAssessmentId((prev) => null);
    },
    [saveToStorage],
  );

  // --- ASSESSMENT ACTIONS ---
  const addAssessment = useCallback(
    (studentId: string) => {
      const now = Date.now();
      const id = "a_" + now + "_" + Math.floor(Math.random() * 1000);
      const newAssessment: Assessment = {
        id,
        studentId,
        createdAt: now,
      };

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

        const updatedAssessment = { ...prev.assessments[id], ...data };
        const updated = {
          ...prev,
          assessments: { ...prev.assessments, [id]: updatedAssessment },
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
      const currentIndex = assessmentsOfStudent.findIndex((a) => a.id === id);
      if (assessmentsOfStudent.length > 1) {
        if (currentIndex < assessmentsOfStudent.length - 1) {
          nextId = assessmentsOfStudent[currentIndex + 1].id;
        } else {
          nextId = assessmentsOfStudent[currentIndex - 1].id;
        }
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

  // --- IMPORT/EXPORT ---
  const importFromJSON = useCallback(
    (jsonData: any) => {
      try {
        const name = (jsonData.studentName || "").trim();
        if (!name) throw new Error("Nome do aluno não encontrado no JSON");

        let newStudentId = "";
        let newAssessmentId = "";

        setDb((prev) => {
          // Encontrar ou criar aluno
          let studentId = Object.entries(prev.students).find(
            ([, s]) => s.name.toLowerCase() === name.toLowerCase(),
          )?.[0];

          const newStudents = { ...prev.students };
          if (!studentId) {
            studentId = "s_" + Date.now();
            newStudents[studentId] = {
              id: studentId,
              name,
              createdAt: Date.now(),
            };
          }
          newStudentId = studentId;

          const assessmentId = "a_" + Date.now();
          newAssessmentId = assessmentId;
          const newAssessment: Assessment = {
            ...jsonData,
            id: assessmentId,
            studentId,
            createdAt: Date.now(),
          };

          const updated = {
            students: newStudents,
            assessments: { ...prev.assessments, [assessmentId]: newAssessment },
          };
          saveToStorage(updated);
          return updated;
        });

        setCurrentStudentId(newStudentId);
        setCurrentAssessmentId(newAssessmentId);
      } catch (e) {
        console.error("Erro na importação do JSON", e);
      }
    },
    [saveToStorage],
  );

  return {
    db,
    loading,
    currentStudentId,
    setCurrentStudentId,
    currentAssessmentId,
    setCurrentAssessmentId,
    currentStudent,
    currentAssessment,
    studentAssessments,
    addStudent,
    removeStudent,
    addAssessment,
    updateAssessment,
    removeAssessment,
    importFromJSON,
    saveManual: () => saveToStorage(db),
  };
}
