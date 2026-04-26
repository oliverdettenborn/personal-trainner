import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Student } from '../../../types/assessment';
import { AppHeader } from './AppHeader';

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
});
