import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { ConfirmModal } from './ConfirmModal';

const commonProps = {
  visible: true,
  title: 'Test Title',
  message: 'Test Message',
  onConfirm: jest.fn(),
  onCancel: jest.fn(),
};

describe('ConfirmModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders title and message when visible', () => {
    const { getByText } = render(<ConfirmModal {...commonProps} />);

    expect(getByText('Test Title')).toBeTruthy();
    expect(getByText('Test Message')).toBeTruthy();
  });

  it('calls onCancel when cancel button is pressed', () => {
    const { getByText } = render(<ConfirmModal {...commonProps} />);

    fireEvent.press(getByText('Cancelar'));
    expect(commonProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm and then onCancel when confirm button is pressed', () => {
    const { getByText } = render(<ConfirmModal {...commonProps} />);

    fireEvent.press(getByText('Confirmar'));
    expect(commonProps.onConfirm).toHaveBeenCalledTimes(1);
    expect(commonProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it('uses custom button labels', () => {
    const { getByText } = render(
      <ConfirmModal {...commonProps} confirmText="Yes" cancelText="No" />,
    );

    expect(getByText('Yes')).toBeTruthy();
    expect(getByText('No')).toBeTruthy();
  });
});
