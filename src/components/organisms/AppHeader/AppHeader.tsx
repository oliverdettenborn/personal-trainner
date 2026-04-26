import React from 'react';
import { Modal, Platform, StyleSheet, View } from 'react-native';
import { Path, Svg } from 'react-native-svg';
import { useThemeColor } from '../../../hooks/useThemeColor';
import { Student } from '../../../types/assessment';
import { Button, Input, Text } from '../../atoms';

export type AppHeaderProps = {
  currentStudentId: string | null;
  students: Student[];
  onSelectStudent: (studentId: string) => void;
  onAddStudent: (name: string) => void;
  onRemoveStudent: (id: string) => void;
  nativeID?: string;
};

export function AppHeader({
  currentStudentId,
  students = [],
  onSelectStudent,
  onAddStudent,
  onRemoveStudent,
  nativeID,
}: AppHeaderProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [studentName, setStudentName] = React.useState('');

  const bg2 = useThemeColor({}, 'backgroundSecondary');
  const borderGold = useThemeColor({}, 'borderGold');
  const gold = useThemeColor({}, 'gold');
  const text = useThemeColor({}, 'text');

  const handleConfirmNewStudent = () => {
    const trimmed = studentName.trim();
    if (trimmed) {
      onAddStudent(trimmed);
      setStudentName('');
      setIsModalOpen(false);
    }
  };

  const handleStudentSelectChange = (event: any) => {
    const value = event.target.value;
    onSelectStudent(value || '');
  };

  return (
    <View style={[styles.container, { backgroundColor: bg2, borderBottomColor: borderGold }]} nativeID={nativeID}>
      <Text style={[styles.title, { color: gold }]}>
        ACOMPANHAMENTO <Text style={{ color: text }}>FÍSICO</Text>
      </Text>
      
      <View style={styles.studentBar}>
        {/* Native <select> dropdown — matches HTML exactly */}
        {Platform.OS === 'web' ? (
          <select
            value={currentStudentId || ''}
            onChange={handleStudentSelectChange}
            style={{
              background: '#222222',
              border: '1px solid #5a4010',
              color: '#e8e0d0',
              padding: '6px 10px',
              borderRadius: 6,
              fontSize: 13,
              cursor: 'pointer',
              minWidth: 180,
              fontFamily: 'inherit',
            }}
          >
            <option value="">— Selecione um aluno —</option>
            {[...students].sort((a, b) => a.name.localeCompare(b.name)).map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        ) : (
          <Button
            title={students.find(s => s.id === currentStudentId)?.name || '— Selecione um aluno —'}
            variant="outline"
            size="sm"
            onPress={() => {}}
            style={styles.studentSelect}
          />
        )}

        <Button
          title="+ Aluno"
          variant="gold"
          size="sm"
          onPress={() => {
            setStudentName('');
            setIsModalOpen(true);
          }}
        />
        
        {currentStudentId && (
          <Button
            title="Remover aluno"
            variant="outline"
            size="sm"
            onPress={() => onRemoveStudent(currentStudentId)}
          />
        )}
      </View>

      {/* Modal: Novo Aluno */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modal, { backgroundColor: bg2, borderColor: borderGold }]}>
            <Text style={styles.modalTitle}>Novo Aluno</Text>
            <Input
              label="Nome completo"
              placeholder="Ex: João Silva"
              value={studentName}
              onChangeText={setStudentName}
              onSubmitEditing={handleConfirmNewStudent}
              containerStyle={{ marginBottom: 14 }}
            />
            <View style={styles.modalActions}>
              <Button title="Cancelar" variant="outline" onPress={() => setIsModalOpen(false)} />
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
    borderBottomWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
  studentBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    flexWrap: 'wrap',
  },
  studentSelect: {
    minWidth: 180,
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
