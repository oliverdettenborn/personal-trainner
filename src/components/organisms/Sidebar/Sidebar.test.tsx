import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Sidebar } from './Sidebar';
import { Student, Assessment } from '../../../types/assessment';

// Mocking @expo/vector-icons
jest.mock('@expo/vector-icons', () => {
  const { Text: MockText } = require('react-native');
  return {
    Ionicons: ({ name }: any) => <MockText>{name}</MockText>,
  };
});

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
  currentStudentId: 's1',
  assessments: mockAssessments,
  currentAssessmentId: 'a1',
  onSelectStudent: jest.fn(),
  onAddStudent: jest.fn(),
  onRemoveStudent: jest.fn(),
  onSelectAssessment: jest.fn(),
  onAddAssessment: jest.fn(),
  onImportJSON: jest.fn(),
};

describe('Sidebar', () => {
  it('renders correctly with students and assessments', () => {
    const { getAllByText, queryByText, getByText } = render(<Sidebar {...commonProps} />);

    expect(getAllByText('Alice').length).toBeGreaterThan(0); 
    expect(queryByText('— Selecione um aluno —')).toBeNull(); 
    expect(getByText('Remover Aluno')).toBeTruthy();

    // Just check that there are items in the list by looking for the student name Alice (which appears in each row)
    // We already have Alice from the student button, so we check for more occurrences.
    // In our mock, Alice appears 3 times total: 1 in button, 2 in assessment items.
    expect(getAllByText('Alice').length).toBe(3);
  });

  it('opens student modal when "Novo Aluno" button is pressed', () => {
    const { getByText } = render(<Sidebar {...commonProps} />);
    
    const addButton = getByText('+ Novo Aluno');
    fireEvent.press(addButton);
    
    expect(getByText('Novo Aluno')).toBeTruthy();
  });

  it('calls onAddStudent when confirmed in modal', () => {
    const { getByText, getByPlaceholderText } = render(<Sidebar {...commonProps} />);
    
    // Open modal
    fireEvent.press(getByText('+ Novo Aluno'));

    // Type student name
    fireEvent.changeText(getByPlaceholderText('Ex: João Silva'), 'New Student');

    // Confirm
    fireEvent.press(getByText('Criar'));

    expect(commonProps.onAddStudent).toHaveBeenCalledWith('New Student');
  });
});
