import { useAssessment } from '@hooks/useAssessment';
import { ActionBar } from '@organisms/ActionBar';
import { AppHeader } from '@organisms/AppHeader';
import { AssessmentForm } from '@organisms/AssessmentForm';
import { Sidebar } from '@organisms/Sidebar';
import { AssessmentTemplate } from '@templates/AssessmentTemplate';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Platform } from 'react-native';
import { Text } from '../src/components/atoms/Text';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@hooks/useThemeColor';

export default function AssessmentScreen() {
  const { 
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
    saveManual 
  } = useAssessment();

  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const gold = useThemeColor({}, 'gold');
  const text3 = '#6a5a40';

  const handleUpdateAssessment = (key: string, value: string) => {
    if (currentAssessmentId) {
      updateAssessment(currentAssessmentId, { [key]: value });
      setIsDirty(true);
    }
  };

  useEffect(() => {
    if (isDirty) {
      const timer = setTimeout(() => {
        setIsDirty(false);
      }, 3500); // Slightly more than hook's 3000ms autosave
      return () => clearTimeout(timer);
    }
  }, [isDirty]);

  if (loading) return null;

  return (
    <View style={styles.wrapper}>
      <AppHeader
        nativeID="app-header"
        currentStudentId={currentStudentId}
        students={Object.values(db.students)}
        onSelectStudent={setCurrentStudentId}
        onAddStudent={() => {
          // Shared modal state would be better, but for now Sidebar handles its own.
          // This button in header will be a secondary way or just same trigger.
        }}
        onRemoveStudent={(id) => {
          if (confirm('Excluir aluno e todas as suas avaliações?')) {
            removeStudent(id);
          }
        }}
        onImportJSON={importFromJSON}
      />
      
      <View style={styles.container}>
        <Sidebar 
          nativeID="sidebar"
          students={Object.values(db.students)}
          currentStudentId={currentStudentId}
          assessments={studentAssessments}
          currentAssessmentId={currentAssessmentId}
          onSelectStudent={setCurrentStudentId}
          onAddStudent={addStudent}
          onRemoveStudent={(id) => {
            if (confirm('Excluir aluno e todas as suas avaliações?')) {
              removeStudent(id);
            }
          }}
          onSelectAssessment={setCurrentAssessmentId}
          onAddAssessment={addAssessment}
          onImportJSON={importFromJSON}
        />
        
        <View style={styles.contentContainer} nativeID="main-content">
          {currentAssessment ? (
            <>
              <ActionBar
                nativeID="action-bar"
                onSave={() => {
                  setIsSaving(true);
                  saveManual();
                  setTimeout(() => {
                    setIsSaving(false);
                    setIsDirty(false);
                  }, 500);
                }}
                onPrint={() => {
                  if (typeof window !== 'undefined') {
                    window.print();
                  }
                }}
                onImport={importFromJSON}
                onDelete={() => {
                  if (currentAssessmentId && confirm('Excluir avaliação?')) {
                    removeAssessment(currentAssessmentId);
                  }
                }}
                isSaving={isSaving}
                status={isDirty ? 'unsaved' : 'saved'}
              />
              
              <ScrollView contentContainerStyle={styles.scrollContent}>
                <AssessmentTemplate>
                  <AssessmentForm 
                    assessment={currentAssessment}
                    onUpdate={handleUpdateAssessment}
                  />
                </AssessmentTemplate>
              </ScrollView>
            </>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="fitness-outline" size={48} color={gold} />
              <Text style={[styles.emptyText, { color: text3 }]}>
                Selecione um aluno e crie uma avaliação para começar.
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#0e0e0e',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  contentContainer: {
    flex: 1,
    overflow: 'hidden',
    paddingTop: 20,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    maxWidth: 300,
  },
});
