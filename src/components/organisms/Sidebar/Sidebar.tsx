import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useThemeColor } from '../../../hooks/useThemeColor';
import { Assessment, Student } from '../../../types/assessment';
import { Button, Text } from '../../atoms';

export type SidebarProps = {
  students: Student[];
  currentStudentId: string | null;
  assessments: Assessment[];
  currentAssessmentId: string | null;
  onSelectAssessment: (id: string) => void;
  onAddAssessment: (studentId: string) => void;
  nativeID?: string;
};

export function Sidebar({
  students = [],
  currentStudentId,
  assessments = [],
  currentAssessmentId,
  onSelectAssessment,
  onAddAssessment,
  nativeID,
}: SidebarProps) {
  const bg2 = useThemeColor({}, 'backgroundSecondary');
  const gold = useThemeColor({}, 'gold');
  const borderGold = useThemeColor({}, 'borderGold');
  const activeAssessmentBg = useThemeColor({}, 'activeAssessmentBg');
  const border = useThemeColor({}, 'border');

  const currentStudent = students.find(s => s.id === currentStudentId);

  const formatDate = (assessment: Assessment) => {
    if (assessment.frente_antes_data) {
      const [y, m, d] = assessment.frente_antes_data.split('-');
      return `${d}/${m}/${y}`;
    }
    const date = new Date(assessment.createdAt);
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
  };

  return (
    <View style={[styles.container, { backgroundColor: bg2, borderRightColor: border }]} nativeID={nativeID}>
      <Text style={styles.sidebarTitle}>Avaliações</Text>
      
      {currentStudentId && (
        <Button 
          title="+ Nova avaliação" 
          variant="gold" 
          size="sm" 
          onPress={() => onAddAssessment(currentStudentId)} 
        />
      )}

      <ScrollView style={styles.assessmentList}>
        {!currentStudentId ? (
          <Text style={styles.noAssessments}>Selecione um aluno para ver as avaliações</Text>
        ) : assessments.length > 0 ? (
          assessments.map(assessment => (
            <Pressable 
              key={assessment.id} 
              onPress={() => onSelectAssessment(assessment.id)}
              style={({ hovered }: any) => [
                styles.assessmentItem, 
                assessment.id === currentAssessmentId && [styles.assessmentItemActive, { backgroundColor: activeAssessmentBg }],
                hovered && styles.assessmentItemHover,
              ]}
            >
              <Text style={styles.assessmentDate}>{formatDate(assessment)}</Text>
              <Text style={styles.assessmentStudent}>{currentStudent?.name}</Text>
              {assessment.frente_antes_peso ? (
                <Text style={styles.assessmentWeight}>{assessment.frente_antes_peso}</Text>
              ) : null}
            </Pressable>
          ))
        ) : (
          <Text style={styles.noAssessments}>Nenhuma avaliação ainda. Clique em "+ Nova avaliação"</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 230,
    paddingVertical: 16,
    paddingHorizontal: 12,
    gap: 8,
    flexShrink: 0,
    borderRightWidth: 1,
    flexDirection: 'column',
  },
  sidebarTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6a5a40',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
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
    marginBottom: 4,
    cursor: 'pointer',
  } as any,
  assessmentItemHover: {
    borderColor: '#5a4010',
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
    paddingVertical: 20,
  },
});
