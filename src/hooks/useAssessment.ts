import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAssessmentRepository } from '@repositories/index';
import {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';

import { Assessment, AssessmentDB } from '../types/assessment';

const STORAGE_KEY = '@caio_oliver_db';
const MIGRATION_FLAG = '@migration_v2_assessments_done';
const DEBOUNCE_MS = 2000;

export function useAssessment(userId: string | null) {
  const [assessments, setAssessments] = useState<Record<string, Assessment>>(
    {},
  );
  const [loading, setLoading] = useState(true);
  const [currentAssessmentId, setCurrentAssessmentId] = useState<string | null>(
    null,
  );
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const repo = useMemo(
    () => (userId ? createAssessmentRepository(userId) : null),
    [userId],
  );

  useEffect(() => {
    if (!repo) return;
    const init = async () => {
      const migrated = await AsyncStorage.getItem(MIGRATION_FLAG);
      if (!migrated) {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const db = JSON.parse(raw) as AssessmentDB;
          const existing = Object.values(db.assessments ?? {});
          await Promise.all(
            existing.map((a) => repo.insert(a).catch(() => {})),
          );
        }
        await AsyncStorage.setItem(MIGRATION_FLAG, '1');
      }
      const data = await repo.findAll();
      const map: Record<string, Assessment> = {};
      data.forEach((a) => {
        map[a.id] = a;
      });
      setAssessments(map);
    };
    init().finally(() => setLoading(false));
  }, [repo]);

  const addAssessment = useCallback(
    (studentId: string): string => {
      const now = Date.now();
      const id = `a_${now}_${Math.floor(Math.random() * 1000)}`;
      const assessment: Assessment = { id, studentId, createdAt: now };
      repo?.insert(assessment).catch(console.error);
      setAssessments((prev) => ({ ...prev, [id]: assessment }));
      setCurrentAssessmentId(id);
      return id;
    },
    [repo],
  );

  const updateAssessment = useCallback(
    (id: string, data: Partial<Assessment>) => {
      setAssessments((prev) => {
        if (!prev[id]) return prev;
        const updated = { ...prev[id], ...data };
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
          repo?.upsert(updated).catch(console.error);
        }, DEBOUNCE_MS);
        return { ...prev, [id]: updated };
      });
    },
    [repo],
  );

  const removeAssessment = useCallback(
    (id: string) => {
      const studentId = assessments[id]?.studentId;
      const ofStudent = Object.values(assessments)
        .filter((a) => a.studentId === studentId)
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      let nextId: string | null = null;
      if (ofStudent.length > 1) {
        const idx = ofStudent.findIndex((a) => a.id === id);
        nextId = idx < ofStudent.length - 1
          ? ofStudent[idx + 1].id
          : ofStudent[idx - 1].id;
      }
      repo?.delete(id).catch(console.error);
      setAssessments((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      setCurrentAssessmentId((prev) => (prev === id ? nextId : prev));
    },
    [repo, assessments],
  );

  const cleanupStudentData = useCallback(
    (studentId: string) => {
      // DB cascade already removed the rows; only local state needs cleanup.
      setAssessments((prev) => {
        const next = { ...prev };
        Object.values(next)
          .filter((a) => a.studentId === studentId)
          .forEach((a) => delete next[a.id]);
        return next;
      });
      setCurrentAssessmentId((prev) => (prev && assessments[prev]?.studentId === studentId ? null : prev));
    },
    [assessments],
  );

  const importFromJSON = useCallback(
    (jsonData: Partial<Assessment>, studentId: string) => {
      const id = `a_${Date.now()}`;
      const assessment: Assessment = {
        ...jsonData,
        id,
        studentId,
        createdAt: Date.now(),
      } as Assessment;
      repo?.insert(assessment).catch(console.error);
      setAssessments((prev) => ({ ...prev, [id]: assessment }));
      setCurrentAssessmentId(id);
    },
    [repo],
  );

  const saveManual = useCallback(() => {
    if (!currentAssessmentId) return;
    const assessment = assessments[currentAssessmentId];
    if (assessment) repo?.upsert(assessment).catch(console.error);
  }, [repo, currentAssessmentId, assessments]);

  const studentAssessments = useMemo(
    () => (studentId: string) => Object.values(assessments)
      .filter((a) => a.studentId === studentId)
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)),
    [assessments],
  );

  return {
    loading,
    currentAssessmentId,
    setCurrentAssessmentId,
    currentAssessment: currentAssessmentId
      ? assessments[currentAssessmentId]
      : null,
    studentAssessments,
    addAssessment,
    updateAssessment,
    removeAssessment,
    cleanupStudentData,
    importFromJSON,
    saveManual,
  };
}
