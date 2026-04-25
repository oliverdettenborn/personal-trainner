import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Assessment, AssessmentDB, Student } from '../types/assessment';

const STORAGE_KEY = '@caio_oliver_db';

interface DBContextValue {
  db: AssessmentDB;
  loading: boolean;
  addStudent: (name: string) => string;
  removeStudent: (id: string) => void;
  addAssessment: (studentId: string) => string;
  updateAssessment: (id: string, data: Partial<Assessment>) => void;
  removeAssessment: (id: string) => void;
  importFromJSON: (data: any) => { studentId: string; assessmentId: string } | null;
  saveManual: () => void;
}

const DBContext = createContext<DBContextValue | null>(null);

export function DBProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<AssessmentDB>({ students: {}, assessments: {} });
  const [loading, setLoading] = useState(true);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dbRef = useRef(db);
  dbRef.current = db;

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then(json => { if (json) setDb(JSON.parse(json)); })
      .finally(() => setLoading(false));
  }, []);

  const saveToStorage = useCallback((newDb: AssessmentDB) => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newDb));
  }, []);

  const triggerAutoSave = useCallback((newDb: AssessmentDB) => {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => saveToStorage(newDb), 3000);
  }, [saveToStorage]);

  const addStudent = useCallback((name: string): string => {
    const id = 's_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    const student: Student = { id, name, createdAt: Date.now() };
    setDb(prev => {
      const updated = { ...prev, students: { ...prev.students, [id]: student } };
      saveToStorage(updated);
      return updated;
    });
    return id;
  }, [saveToStorage]);

  const removeStudent = useCallback((id: string) => {
    setDb(prev => {
      const students = { ...prev.students };
      delete students[id];
      const assessments = { ...prev.assessments };
      Object.keys(assessments).forEach(aid => {
        if (assessments[aid].studentId === id) delete assessments[aid];
      });
      const updated = { students, assessments };
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  const addAssessment = useCallback((studentId: string): string => {
    const id = 'a_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    const assessment: Assessment = { id, studentId, createdAt: Date.now() };
    setDb(prev => {
      const updated = { ...prev, assessments: { ...prev.assessments, [id]: assessment } };
      saveToStorage(updated);
      return updated;
    });
    return id;
  }, [saveToStorage]);

  const updateAssessment = useCallback((id: string, data: Partial<Assessment>) => {
    setDb(prev => {
      if (!prev.assessments[id]) return prev;
      const updated = {
        ...prev,
        assessments: { ...prev.assessments, [id]: { ...prev.assessments[id], ...data } },
      };
      triggerAutoSave(updated);
      return updated;
    });
  }, [triggerAutoSave]);

  const removeAssessment = useCallback((id: string) => {
    setDb(prev => {
      const assessments = { ...prev.assessments };
      delete assessments[id];
      const updated = { ...prev, assessments };
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  const importFromJSON = useCallback((jsonData: any): { studentId: string; assessmentId: string } | null => {
    const name = (jsonData.studentName || '').trim();
    if (!name) return null;

    const current = dbRef.current;
    const existingEntry = Object.entries(current.students).find(
      ([, s]) => s.name.toLowerCase() === name.toLowerCase()
    );

    let studentId = existingEntry?.[0] || '';
    let newStudent: Student | null = null;
    if (!studentId) {
      studentId = 's_' + Date.now();
      newStudent = { id: studentId, name, createdAt: Date.now() };
    }

    const assessmentId = 'a_' + Date.now();

    setDb(prev => {
      const students = { ...prev.students };
      if (newStudent) students[studentId] = newStudent;
      const assessment: Assessment = { ...jsonData, id: assessmentId, studentId, createdAt: Date.now() };
      const updated = { students, assessments: { ...prev.assessments, [assessmentId]: assessment } };
      saveToStorage(updated);
      return updated;
    });

    return { studentId, assessmentId };
  }, [saveToStorage]);

  const saveManual = useCallback(() => {
    saveToStorage(dbRef.current);
  }, [saveToStorage]);

  return (
    <DBContext.Provider value={{
      db, loading,
      addStudent, removeStudent,
      addAssessment, updateAssessment, removeAssessment,
      importFromJSON, saveManual,
    }}>
      {children}
    </DBContext.Provider>
  );
}

export function useDB() {
  const ctx = useContext(DBContext);
  if (!ctx) throw new Error('useDB must be used within DBProvider');
  return ctx;
}
