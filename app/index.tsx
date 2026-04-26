import { useAssessment } from '@hooks/useAssessment';
import { ActionBar } from '@organisms/ActionBar';
import { AppHeader } from '@organisms/AppHeader';
import { AssessmentForm } from '@organisms/AssessmentForm';
import { Sidebar } from '@organisms/Sidebar';
import { AssessmentTemplate } from '@templates/AssessmentTemplate';
import * as Sharing from 'expo-sharing';
import html2canvas from 'html2canvas';
import React, { useEffect, useRef, useState } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Path, Svg } from 'react-native-svg';
import { captureRef } from 'react-native-view-shot';
import { Text } from '../src/components/atoms/Text';

const SVG_INFO_EMPTY = "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z";

export default function AssessmentScreen() {
  const { 
    db,
    loading,
    currentStudentId,
    setCurrentStudentId,
    currentAssessmentId,
    setCurrentAssessmentId,
    currentAssessment,
    studentAssessments,
    addStudent,
    removeStudent,
    addAssessment,
    updateAssessment,
    removeAssessment,
    saveManual 
  } = useAssessment();

  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const captureAreaRef = useRef<View>(null);

  const text3 = '#6a5a40';

  const handleUpdateAssessment = (key: string, value: string) => {
    if (currentAssessmentId) {
      updateAssessment(currentAssessmentId, { [key]: value });
      setIsDirty(true);
    }
  };

  const handleDownloadImage = async () => {
    if (!captureAreaRef.current) return;

    try {
      if (Platform.OS === 'web') {
        // @ts-ignore - nativeID and DOM interaction
        const element = document.getElementById('template-capture-area');
        if (element) {
          const canvas = await html2canvas(element, {
            background: '#0e0e0e',
            logging: false,
            useCORS: true,
          });
          const link = document.createElement('a');
          const studentName = db.students[currentStudentId!]?.name || 'Avaliacao';
          const date = new Date(currentAssessment?.createdAt || Date.now()).toLocaleDateString().replace(/\//g, '-');
          link.download = `Avaliacao_${studentName}_${date}.png`;
          link.href = canvas.toDataURL('image/png');
          link.click();
        }
      } else {
        const uri = await captureRef(captureAreaRef, {
          format: 'png',
          quality: 1,
        });
        await Sharing.shareAsync(uri);
      }
    } catch (error) {
      console.error('Erro ao gerar imagem:', error);
      alert('Ocorreu um erro ao gerar a imagem.');
    }
  };

  const handleCopyImage = async (): Promise<boolean> => {
    if (Platform.OS !== 'web') return false;

    try {
      // @ts-ignore - DOM interaction
      const element = document.getElementById('template-capture-area');
      if (element) {
        const canvas = await html2canvas(element, {
          background: '#0e0e0e',
          logging: false,
          useCORS: true,
        });
        
        return new Promise((resolve) => {
          canvas.toBlob(async (blob) => {
            if (blob) {
              try {
                const item = new ClipboardItem({ 'image/png': blob });
                await navigator.clipboard.write([item]);
                resolve(true);
              } catch (err) {
                console.error('Clipboard error:', err);
                resolve(false);
              }
            } else {
              resolve(false);
            }
          }, 'image/png');
        });
      }
      return false;
    } catch (error) {
      console.error('Erro ao copiar imagem:', error);
      return false;
    }
  };

  useEffect(() => {
    if (isDirty) {
      const timer = setTimeout(() => {
        setIsDirty(false);
      }, 3500);
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
        onAddStudent={addStudent}
        onRemoveStudent={(id) => {
          if (confirm(`Remover o aluno "${db.students[id]?.name}" e todas as suas avaliações? Essa ação é irreversível.`)) {
            removeStudent(id);
          }
        }}
      />
      
      <View style={styles.appBody}>
        <Sidebar 
          nativeID="sidebar"
          students={Object.values(db.students)}
          currentStudentId={currentStudentId}
          assessments={studentAssessments}
          currentAssessmentId={currentAssessmentId}
          onSelectAssessment={setCurrentAssessmentId}
          onAddAssessment={addAssessment}
        />
        
        <ScrollView style={styles.mainContent} nativeID="main-content">
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
                onDownloadImage={handleDownloadImage}
                onCopyImage={handleCopyImage}
                onDelete={() => {
                  if (currentAssessmentId && confirm('Excluir esta avaliação? A ação é irreversível.')) {
                    removeAssessment(currentAssessmentId);
                  }
                }}
                isSaving={isSaving}
                status={isDirty ? 'unsaved' : 'saved'}
              />
              
              <View 
                ref={captureAreaRef} 
                nativeID="template-capture-area"
                style={{ backgroundColor: '#0e0e0e' }}
              >
                <AssessmentTemplate>
                  <AssessmentForm 
                    assessment={currentAssessment}
                    onUpdate={handleUpdateAssessment}
                  />
                </AssessmentTemplate>
              </View>
            </>
          ) : (
            <View style={styles.emptyState}>
              <View style={{ opacity: 0.4 }}>
                <Svg width={48} height={48} viewBox="0 0 24 24" fill={text3}>
                  <Path d={SVG_INFO_EMPTY} />
                </Svg>
              </View>
              <Text style={styles.emptyText}>
                Selecione um aluno e crie uma avaliação para começar.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#0e0e0e',
  },
  appBody: {
    flex: 1,
    flexDirection: 'row' as const,
  },
  mainContent: {
    flex: 1,
    padding: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 13,
    color: '#6a5a40',
    textAlign: 'center',
  },
});
