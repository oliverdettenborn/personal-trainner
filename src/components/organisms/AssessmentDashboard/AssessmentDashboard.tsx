import React, { useEffect, useRef, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";

import { useAssessment } from "../../../hooks/useAssessment";
import { useAuth } from "../../../hooks/useAuth";
import { useConfirmModal } from "../../../hooks/useConfirmModal";
import { useImageCapture } from "../../../hooks/useImageCapture";
import { useToast } from "../../../hooks/useToast";
import { signOut } from "../../../services/authService";
import { Assessment } from "../../../types/assessment";
import { ConfirmModal } from "../../molecules/ConfirmModal";
import { EmptyState } from "../../molecules/EmptyState";
import { Toast } from "../../molecules/Toast";
import { ActionBar } from "../ActionBar";
import { AppHeader } from "../AppHeader";
import { AssessmentContent } from "../AssessmentContent";
import { Sidebar } from "../Sidebar";

export function AssessmentDashboard() {
  const { userId } = useAuth();
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
    saveManual,
  } = useAssessment(userId);

  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(Platform.OS === "web");
  const [weightError, setWeightError] = useState("");

  const captureAreaRef = useRef<View>(null);
  const dirtyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const confirm = useConfirmModal();
  const { toast, show: showToast } = useToast();

  // Sync isDirty with the autosave debounce (3s in useAssessment)
  useEffect(() => {
    if (isDirty) {
      if (dirtyTimerRef.current) clearTimeout(dirtyTimerRef.current);
      dirtyTimerRef.current = setTimeout(() => {
        setIsDirty(false);
      }, 3500);
    }
    return () => {
      if (dirtyTimerRef.current) clearTimeout(dirtyTimerRef.current);
    };
  }, [isDirty]);

  const studentName = currentStudentId
    ? db.students[currentStudentId]?.name || "Avaliacao"
    : "Avaliacao";
  const assessmentDate = new Date(currentAssessment?.createdAt || Date.now())
    .toLocaleDateString()
    .replace(/\//g, "-");

  const { download, copy } = useImageCapture({
    captureRef: captureAreaRef,
    elementId: "template-capture-area",
    fileName: `Avaliacao_${studentName}_${assessmentDate}`,
    onError: (msg) => showToast(msg, "error"),
  });

  const handleUpdate = (key: string, value: string | string[]) => {
    if (currentAssessmentId) {
      updateAssessment(currentAssessmentId, {
        [key]: value,
      } as Partial<Assessment>);
      setIsDirty(true);
    }
  };

  const handleSave = () => {
    if (!currentAssessment?.front_before_weight) {
      setWeightError("O peso é obrigatório");
      return;
    }
    setWeightError("");
    setIsSaving(true);
    saveManual();
    setTimeout(() => {
      setIsSaving(false);
      setIsDirty(false);
      showToast("Avaliação salva com sucesso", "success");
    }, 500);
  };

  const handleDelete = () => {
    if (currentAssessmentId) {
      confirm.show(
        "Excluir Avaliação",
        "Tem certeza que deseja excluir esta avaliação? A ação é irreversível.",
        () => removeAssessment(currentAssessmentId),
      );
    }
  };

  if (loading) return null;

  return (
    <View style={styles.wrapper}>
      <AppHeader
        testID="app-header"
        currentStudentId={currentStudentId}
        students={Object.values(db.students)}
        onSelectStudent={setCurrentStudentId}
        onAddStudent={addStudent}
        onRemoveStudent={(id) =>
          confirm.show(
            "Remover Aluno",
            `Deseja remover o aluno "${db.students[id]?.name}" e todas as suas avaliações? Essa ação é irreversível.`,
            () => removeStudent(id),
          )
        }
        sidebarVisible={sidebarVisible}
        onToggleSidebar={() => setSidebarVisible((v) => !v)}
        onLogout={signOut}
      />

      <View style={styles.appBody}>
        {sidebarVisible && (
          <Sidebar
            testID="sidebar"
            students={Object.values(db.students)}
            currentStudentId={currentStudentId}
            assessments={studentAssessments}
            currentAssessmentId={currentAssessmentId}
            onSelectAssessment={(id) => {
              setCurrentAssessmentId(id);
              if (isMobile) setSidebarVisible(false);
            }}
            onAddAssessment={(studentId) => {
              addAssessment(studentId);
              if (isMobile) setSidebarVisible(false);
            }}
          />
        )}

        <ScrollView
          style={styles.mainContent}
          nativeID="main-content"
          nestedScrollEnabled
        >
          {currentAssessment ? (
            <>
              <ActionBar
                testID="action-bar"
                onSave={handleSave}
                onDownloadImage={download}
                onCopyImage={copy}
                onDelete={handleDelete}
                isSaving={isSaving}
                status={isDirty ? "unsaved" : "saved"}
              />
              <AssessmentContent
                assessment={currentAssessment}
                onUpdate={handleUpdate}
                captureRef={captureAreaRef}
                isMobile={isMobile}
                weightError={weightError}
              />
            </>
          ) : (
            <EmptyState message="Selecione um aluno e crie uma avaliação para começar." />
          )}
        </ScrollView>
      </View>

      <ConfirmModal
        visible={confirm.config.visible}
        title={confirm.config.title}
        message={confirm.config.message}
        onConfirm={confirm.config.onConfirm}
        onCancel={confirm.hide}
      />

      <Toast toast={toast} testID="toast" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#0e0e0e",
  },
  appBody: {
    flex: 1,
    flexDirection: "row" as const,
  },
  mainContent: {
    flex: 1,
    padding: 20,
  },
});
