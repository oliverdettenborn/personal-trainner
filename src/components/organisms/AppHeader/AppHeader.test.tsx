import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { useWindowDimensions } from 'react-native';
import { Student } from '../../../types/assessment';
import { AppHeader } from './AppHeader';

jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  default: jest.fn(),
}));

const mockUseWindowDimensions = useWindowDimensions as jest.Mock;

const mockStudents: Student[] = [
  { id: 's1', name: 'Alice', createdAt: Date.now() },
];

const commonProps = {
  currentStudentId: null as string | null,
  students: mockStudents,
  onSelectStudent: jest.fn(),
  onAddStudent: jest.fn(),
  onRemoveStudent: jest.fn(),
};

beforeEach(() => {
  mockUseWindowDimensions.mockReturnValue({ width: 1280, height: 900 });
});

describe('AppHeader', () => {
  it('renders the app title', () => {
    const { getByText } = render(<AppHeader {...commonProps} />);

    expect(getByText(/ACOMPANHAMENTO/)).toBeTruthy();
    expect(getByText('FÍSICO')).toBeTruthy();
  });

  describe('sidebar toggle button', () => {
    it('does not render toggle button when onToggleSidebar is not provided', () => {
      const { queryByText } = render(<AppHeader {...commonProps} />);

      expect(queryByText('☰')).toBeNull();
    });

    it('renders toggle button when onToggleSidebar is provided', () => {
      const { getByText } = render(
        <AppHeader {...commonProps} onToggleSidebar={jest.fn()} sidebarVisible={false} />
      );

      expect(getByText('☰')).toBeTruthy();
    });

    it('calls onToggleSidebar when toggle button is pressed', () => {
      const onToggleSidebar = jest.fn();
      const { getByText } = render(
        <AppHeader {...commonProps} onToggleSidebar={onToggleSidebar} sidebarVisible={false} />
      );

      fireEvent.press(getByText('☰'));

      expect(onToggleSidebar).toHaveBeenCalledTimes(1);
    });

    it('renders both toggle and title when onToggleSidebar is provided', () => {
      const { getByText } = render(
        <AppHeader {...commonProps} onToggleSidebar={jest.fn()} sidebarVisible={true} />
      );

      expect(getByText('☰')).toBeTruthy();
      expect(getByText(/ACOMPANHAMENTO/)).toBeTruthy();
    });
  });

  describe('student action buttons — desktop', () => {
    it('renders text buttons on desktop', () => {
      const { getByText } = render(<AppHeader {...commonProps} />);

      expect(getByText('+ Aluno')).toBeTruthy();
    });

    it('renders Remover aluno text button when student is selected on desktop', () => {
      const { getByText } = render(
        <AppHeader {...commonProps} currentStudentId="s1" />
      );

      expect(getByText('Remover aluno')).toBeTruthy();
    });
  });

  describe('student action buttons — mobile', () => {
    beforeEach(() => {
      mockUseWindowDimensions.mockReturnValue({ width: 375, height: 812 });
    });

    it('does not render "+ Aluno" text on mobile', () => {
      const { queryByText } = render(<AppHeader {...commonProps} />);

      expect(queryByText('+ Aluno')).toBeNull();
    });

    it('does not render "Remover aluno" text on mobile', () => {
      const { queryByText } = render(
        <AppHeader {...commonProps} currentStudentId="s1" />
      );

      expect(queryByText('Remover aluno')).toBeNull();
    });
  });
});
