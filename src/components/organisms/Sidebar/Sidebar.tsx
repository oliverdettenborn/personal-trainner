import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Platform, ScrollView, StyleSheet, View, Pressable } from 'react-native';
import { useThemeColor } from '../../../hooks/useThemeColor';
import { Button, Input, Text } from '../../atoms';
import { Student, Assessment } from '../../../types/assessment';

export type SidebarProps = {
  students: Student[];
  currentStudentId: string | null;
  assessments: Assessment[];
  currentAssessmentId: string | null;
  onSelectStudent: (id: string) => void;
  onAddStudent: (name: string) => void;
  onRemoveStudent: (id: string) => void;
  onSelectAssessment: (id: string) => void;
  onAddAssessment: (studentId: string) => void;
  onImportJSON: (data: any) => void;
};

export function Sidebar({
  students = [],
  currentStudentId,
  assessments = [],
  currentAssessmentId,
  onSelectStudent,
  onAddStudent,
  onRemoveStudent,
  onSelectAssessment,
  onAddAssessment,
  onImportJSON,
}: SidebarProps) {
  const [studentName, setStudentName] = React.useState('');
  const [isStudentModalOpen, setIsStudentModalOpen] = React.useState(false);

  const bg2 = useThemeColor({}, 'backgroundSecondary');
  const gold = useThemeColor({}, 'gold');
  const borderGold = useThemeColor({}, 'borderGold');
  const activeAssessmentBg = useThemeColor({}, 'activeAssessmentBg');

  const handleFileChange = (event: any) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      try {
        const data = JSON.parse(e.target.result as string);
        onImportJSON(data);
      } catch (error) {
        console.error("Failed to parse JSON", error);
        alert("Erro ao importar JSON. Verifique o formato do arquivo.");
      }
    };
    reader.readAsText(file);
  };
  
  const handleConfirmNewStudent = () => {
    if (studentName.trim()) {
      onAddStudent(studentName.trim());
      setStudentName('');
      setIsStudentModalOpen(false);
    }
  };

  const currentStudent = students.find(s => s.id === currentStudentId);

  return (
    <View style={[styles.container, { backgroundColor: bg2 }]}>
      <View style={styles.header}>
        <Text style={styles.sidebarTitle}>Alunos</Text>
        <Button 
          title="+ Novo Aluno" 
          variant="gold" 
          size="sm" 
          onPress={() => setIsStudentModalOpen(true)} 
        />
      </View>
      
      <View style={styles.studentSelectContainer}>
        <Button 
          title={currentStudent?.name || '— Selecione um aluno —'}
          variant="outline"
          size="sm"
          onPress={() => {
            setIsStudentModalOpen(true);
          }}
          style={styles.selectButton}
          iconRight="chevron-down"
        />
        {currentStudentId && (
          <Button 
            title="Remover Aluno" 
            variant="danger" 
            size="sm" 
            onPress={() => onRemoveStudent(currentStudentId)} 
            style={styles.removeButton}
          />
        )}
      </View>

      <View style={styles.header}>
        <Text style={styles.sidebarTitle}>Avaliações</Text>
        {currentStudentId && (
          <Button 
            title="+ Nova Avaliação" 
            variant="gold" 
            size="sm" 
            onPress={() => onAddAssessment(currentStudentId)} 
          />
        )}
      </View>

      <ScrollView style={styles.assessmentList}>
        {!currentStudentId ? (
          <Text style={styles.noAssessments}>Selecione um aluno para ver suas avaliações.</Text>
        ) : assessments.length > 0 ? (
          assessments.map(assessment => (
            <Pressable 
              key={assessment.id} 
              onPress={() => onSelectAssessment(assessment.id)}
              style={({ hovered }) => [
                styles.assessmentItem, 
                assessment.id === currentAssessmentId && [styles.assessmentItemActive, { backgroundColor: activeAssessmentBg }],
                hovered && { borderColor: borderGold }
              ]}
            >
              <Text style={styles.assessmentDate}>
                {assessment.frente_antes_data 
                  ? new Date(assessment.frente_antes_data).toLocaleDateString('pt-BR') 
                  : new Date(assessment.createdAt).toLocaleDateString('pt-BR')}
              </Text>
              <Text style={styles.assessmentStudent}>{currentStudent?.name}</Text>
              {assessment.frente_antes_peso && <Text style={styles.assessmentWeight}>{assessment.frente_antes_peso} kg</Text>}
            </Pressable>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.noAssessments}>Nenhuma avaliação ainda...</Text>
            <Button 
              title="Criar primeira" 
              variant="gold" 
              size="sm" 
              onPress={() => onAddAssessment(currentStudentId)} 
            />
          </View>
        )}
      </ScrollView>
      
      {/* Import JSON button - Web specific */}
      {Platform.OS === 'web' && (
        <View style={styles.importButtonContainer}>
           <label style={{cursor:'pointer', display:'inline-flex', alignItems:'center', gap:'5px', padding: '6px 14px', borderRadius: 6, fontSize: 13, fontWeight: '600', border: '1px solid #5a4010', color: gold}}>
              <Ionicons name="cloud-download-outline" size={13} color={gold} />
              Importar JSON
              <input type="file" accept=".json" onChange={handleFileChange} style={{ display: 'none' }} />
           </label>
        </View>
      )}

      {/* MODAL: Novo Aluno */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isStudentModalOpen}
        onRequestClose={() => setIsStudentModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modal, { backgroundColor: bg2, borderColor: borderGold }]}>
            <Text style={styles.modalTitle}>Novo Aluno</Text>
            <Input 
              label="Nome completo" 
              placeholder="Ex: João Silva" 
              value={studentName}
              onChangeText={setStudentName}
              containerStyle={{marginBottom: 14}}
            />
            <View style={styles.modalActions}>
              <Button title="Cancelar" variant="outline" onPress={() => setIsStudentModalOpen(false)} />
              <Button title="Criar" variant="gold" onPress={handleConfirmNewStudent} disabled={!studentName.trim()} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 230,
    padding: 16,
    gap: 12,
    flexShrink: 0,
    borderRightWidth: 1,
    borderRightColor: '#3a3020',
  },
  sidebarTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6a5a40',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  studentSelectContainer: {
    flexDirection: 'column',
    gap: 8,
    marginBottom: 16,
  },
  selectButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  removeButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  assessmentList: {
    flex: 1,
  },
  assessmentItem: {
    backgroundColor: '#222222',
    borderWidth: 1,
    borderColor: '#3a3020',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 8,
    cursor: 'pointer',
  },
  assessmentItemActive: {
    borderColor: '#C9963A',
  },
  assessmentDate: {
    fontSize: 12,
    color: '#C9963A',
    fontWeight: '600',
  },
  assessmentStudent: {
    fontSize: 11,
    color: '#a89878',
    marginTop: 2,
  },
  assessmentWeight: {
    fontSize: 11,
    color: '#6a5a40',
  },
  noAssessments: {
    color: '#6a5a40',
    fontSize: 12,
    textAlign: 'center',
    padding: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    gap: 8,
  },
  importButtonContainer: {
    marginTop: 'auto', 
    alignItems: 'center',
    paddingTop: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    width: '100%',
    maxWidth: 340,
    padding: 24,
    borderRadius: 10,
    borderWidth: 1,
  },
  modalTitle: {
    color: '#C9963A',
    fontSize: 15,
    marginBottom: 16,
    fontWeight: '700',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
    marginTop: 4,
  },
});


