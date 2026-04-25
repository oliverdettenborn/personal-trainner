import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Assessment, Student } from '../../../types/assessment';
import { Sidebar } from './Sidebar';

const mockStudents: Student[] = [
  { id: 's1', name: 'Alice', createdAt: Date.now() },
  { id: 's2', name: 'Bob', createdAt: Date.now() },
];

const mockAssessments: Assessment[] = [
  { id: 'a1', studentId: 's1', createdAt: 1704067200000, frente_antes_data: '2024-01-01' },
  { id: 'a2', studentId: 's1', createdAt: 1706745600000, frente_antes_data: '2024-02-01' },
];

const commonProps = {
  students: mockStudents,
  currentStudentId: 's1' as string | null,
  assessments: mockAssessments,
  currentAssessmentId: 'a1',
  onSelectAssessment: jest.fn(),
  onAddAssessment: jest.fn(),
};

describe('Sidebar', () => {
  it('renders title and assessment list', () => {
    const { getByText, getAllByText } = render(<Sidebar {...commonProps} />);

    expect(getByText('Avaliações')).toBeTruthy();
    expect(getByText('+ Nova avaliação')).toBeTruthy();
    // Alice appears once per assessment item
    expect(getAllByText('Alice').length).toBe(2);
  });

  it('formats dates as DD/MM/YYYY from frente_antes_data', () => {
    const { getByText } = render(<Sidebar {...commonProps} />);

    expect(getByText('01/01/2024')).toBeTruthy();
    expect(getByText('01/02/2024')).toBeTruthy();
  });

  it('calls onAddAssessment when "+ Nova avaliação" is pressed', () => {
    const { getByText } = render(<Sidebar {...commonProps} />);

    fireEvent.press(getByText('+ Nova avaliação'));

    expect(commonProps.onAddAssessment).toHaveBeenCalledWith('s1');
  });

  it('calls onSelectAssessment when an assessment item is pressed', () => {
    const { getByText } = render(<Sidebar {...commonProps} />);

    fireEvent.press(getByText('01/02/2024'));

    expect(commonProps.onSelectAssessment).toHaveBeenCalledWith('a2');
  });

  it('shows empty message when no student selected', () => {
    const { getByText } = render(
      <Sidebar {...commonProps} currentStudentId={null} />
    );

    expect(getByText('Selecione um aluno para ver as avaliações')).toBeTruthy();
  });

  it('shows empty message when no assessments exist', () => {
    const { getByText } = render(
      <Sidebar {...commonProps} assessments={[]} />
    );

    expect(getByText(/Nenhuma avaliação ainda/)).toBeTruthy();
  });
});
