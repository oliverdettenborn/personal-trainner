import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useThemeColor } from '../../../hooks/useThemeColor';
import { Button, Text } from '../../atoms';
import { Student } from '../../../types/assessment';

export type AppHeaderProps = {
  currentStudentId: string | null;
  students: Student[];
  onSelectStudent: (studentId: string) => void;
  onAddStudent: () => void;
  onRemoveStudent: (id: string) => void;
  onImportJSON: (data: any) => void;
};

export function AppHeader({
  currentStudentId,
  students = [],
  onSelectStudent,
  onAddStudent,
  onRemoveStudent,
  onImportJSON,
}: AppHeaderProps) {
  const bg2 = useThemeColor({}, 'backgroundSecondary');
  const borderGold = useThemeColor({}, 'borderGold');
  const gold = useThemeColor({}, 'gold');
  const text = useThemeColor({}, 'text');

  const currentStudent = students.find(s => s.id === currentStudentId);

  const handleFileChange = (event: any) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      try {
        const data = JSON.parse(e.target.result as string);
        onImportJSON?.(data);
      } catch (error) {
        console.error("Failed to parse JSON", error);
        alert("Erro ao importar JSON. Verifique o formato do arquivo.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <View style={[styles.container, { backgroundColor: bg2, borderBottomColor: borderGold }]}>
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: gold }]}>
          ACOMPANHAMENTO <Text style={[styles.titleSpan, { color: text }]}>FÍSICO</Text>
        </Text>
      </View>
      
      <View style={styles.studentBar}>
        <Button
          title={currentStudent?.name || '— Selecione um aluno —'}
          variant="outline"
          size="sm"
          onPress={() => {
            // Dropdown not implemented, but it could trigger student modal too
            onAddStudent();
          }}
          style={styles.studentSelect}
          iconRight="chevron-down"
        />
        
        <Button
          title="+ Aluno"
          variant="gold"
          size="sm"
          onPress={onAddStudent}
        />
        
        {currentStudentId && (
          <Button
            title="Remover aluno"
            variant="danger"
            size="sm"
            onPress={() => onRemoveStudent(currentStudentId)}
          />
        )}
        
        {/* Import JSON - Web only */}
        {Platform.OS === 'web' && (
          <label style={{ 
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            padding: '4px 10px',
            fontSize: 12,
            fontWeight: '600',
            backgroundColor: 'transparent',
            border: '1px solid #5a4010',
            color: '#C9963A',
            borderRadius: 6,
          }}>
            <Ionicons name="cloud-download-outline" size={12} color="#C9963A" />
            Importar JSON
            <input
              type="file"
              accept=".json"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </label>
        )}
      </View>
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
  titleContainer: {
    flexShrink: 0,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 3,
  },
  titleSpan: {
    // Inherits
  },
  studentBar: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    flexWrap: 'wrap',
  },
  studentSelect: {
    minWidth: 180,
  },
});


