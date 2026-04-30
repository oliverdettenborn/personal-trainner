import { useAssessment } from "@hooks/useAssessment";
import { useAuth } from "@hooks/useAuth";
import { ConfirmModal } from "@molecules/ConfirmModal";
import { ActionBar } from "@organisms/ActionBar";
import { AppHeader } from "@organisms/AppHeader";
import { AssessmentForm } from "@organisms/AssessmentForm";
import { Sidebar } from "@organisms/Sidebar";
import { signOut } from "@services/authService";
import { AssessmentTemplate } from "@templates/AssessmentTemplate";
import * as Sharing from "expo-sharing";
import React, { useEffect, useRef, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { Path, Svg } from "react-native-svg";
import { captureRef } from "react-native-view-shot";

import { Text } from "../src/components/atoms/Text";

// html2canvas is web-only — conditional require prevents Android crash on module init
const html2canvas = Platform.OS === "web" ? require("html2canvas") : null;

const SVG_INFO_EMPTY =
  "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z";

export default function AssessmentScreen() {
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
  const [confirmModalConfig, setConfirmModalConfig] = useState({
    visible: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const captureAreaRef = useRef<View>(null);

  const text3 = "#6a5a40";

  const handleUpdateAssessment = (key: string, value: string | string[]) => {
    if (currentAssessmentId) {
      updateAssessment(currentAssessmentId, { [key]: value } as Partial<
        import("../src/types/assessment").Assessment
      >);
      setIsDirty(true);
    }
  };

  const handleDownloadImage = async () => {
    if (!captureAreaRef.current) return;

    try {
      if (Platform.OS === "web") {
        // @ts-ignore - nativeID and DOM interaction
        const element = document.getElementById("template-capture-area");
        if (element) {
          const canvas = await html2canvas(element, {
            background: "#0e0e0e",
            logging: false,
            useCORS: true,
          });
          const link = document.createElement("a");
          const studentName =
            db.students[currentStudentId!]?.name || "Avaliacao";
          const date = new Date(currentAssessment?.createdAt || Date.now())
            .toLocaleDateString()
            .replace(/\//g, "-");
          link.download = `Avaliacao_${studentName}_${date}.png`;
          link.href = canvas.toDataURL("image/png");
          link.click();
        }
      } else {
        const uri = await captureRef(captureAreaRef, {
          format: "png",
          quality: 1,
        });
        await Sharing.shareAsync(uri);
      }
    } catch (error) {
      console.error("Erro ao gerar imagem:", error);
      alert("Ocorreu um erro ao gerar a imagem.");
    }
  };

  const handleCopyImage = async (): Promise<boolean> => {
    if (Platform.OS !== "web") return false;

    try {
      // @ts-ignore - DOM interaction
      const element = document.getElementById("template-capture-area");
      if (element) {
        const canvas = await html2canvas(element, {
          background: "#0e0e0e",
          logging: false,
          useCORS: true,
        });

        return new Promise((resolve) => {
          canvas.toBlob(async (blob: Blob | null) => {
            if (blob) {
              try {
                const item = new ClipboardItem({ "image/png": blob });
                await navigator.clipboard.write([item]);
                resolve(true);
              } catch (err) {
                console.error("Clipboard error:", err);
                resolve(false);
              }
            } else {
              resolve(false);
            }
          }, "image/png");
        });
      }
      return false;
    } catch (error) {
      console.error("Erro ao copiar imagem:", error);
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
          setConfirmModalConfig({
            visible: true,
            title: "Remover Aluno",
            message: `Deseja remover o aluno "${db.students[id]?.name}" e todas as suas avaliações? Essa ação é irreversível.`,
            onConfirm: () => removeStudent(id),
          });
        }}
        sidebarVisible={sidebarVisible}
        onToggleSidebar={() => setSidebarVisible((v) => !v)}
        onLogout={signOut}
      />

      <View style={styles.appBody}>
        {sidebarVisible && (
          <Sidebar
            nativeID="sidebar"
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
                  if (currentAssessmentId) {
                    setConfirmModalConfig({
                      visible: true,
                      title: "Excluir Avaliação",
                      message:
                        "Tem certeza que deseja excluir esta avaliação? A ação é irreversível.",
                      onConfirm: () => removeAssessment(currentAssessmentId),
                    });
                  }
                }}
                isSaving={isSaving}
                status={isDirty ? "unsaved" : "saved"}
              />

              {isMobile ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  nestedScrollEnabled
                  keyboardShouldPersistTaps="handled"
                >
                  <View
                    ref={captureAreaRef}
                    nativeID="template-capture-area"
                    style={{ backgroundColor: "#0e0e0e", width: 900 }}
                  >
                    <AssessmentTemplate>
                      <AssessmentForm
                        assessment={currentAssessment}
                        onUpdate={handleUpdateAssessment}
                      />
                    </AssessmentTemplate>
                  </View>
                </ScrollView>
              ) : (
                <View
                  ref={captureAreaRef}
                  nativeID="template-capture-area"
                  style={{
                    backgroundColor: "#0e0e0e",
                    maxWidth: 900,
                    alignSelf: "center",
                    width: "100%",
                  }}
                >
                  <AssessmentTemplate>
                    <AssessmentForm
                      assessment={currentAssessment}
                      onUpdate={handleUpdateAssessment}
                    />
                  </AssessmentTemplate>
                </View>
              )}
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

      <ConfirmModal
        visible={confirmModalConfig.visible}
        title={confirmModalConfig.title}
        message={confirmModalConfig.message}
        onConfirm={confirmModalConfig.onConfirm}
        onCancel={() =>
          setConfirmModalConfig((prev) => ({ ...prev, visible: false }))
        }
      />
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
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 13,
    color: "#6a5a40",
    textAlign: "center",
  },
});
