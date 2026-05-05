import { render } from '@testing-library/react-native';
import React from 'react';

import { Toast } from './Toast';

describe('Toast', () => {
  it('renders nothing when not visible and no message', () => {
    const { toJSON } = render(
      <Toast toast={{ visible: false, message: '', type: 'success' }} />,
    );
    expect(toJSON()).toBeNull();
  });

  it('renders message when visible', () => {
    const { getByText } = render(
      <Toast toast={{ visible: true, message: 'Saved!', type: 'success' }} />,
    );
    expect(getByText('Saved!')).toBeTruthy();
  });

  it('renders error message', () => {
    const { getByText } = render(
      <Toast
        toast={{ visible: true, message: 'Error occurred', type: 'error' }}
      />,
    );
    expect(getByText('Error occurred')).toBeTruthy();
  });

  it('uses testID prop', () => {
    const { getByTestId } = render(
      <Toast
        toast={{ visible: true, message: 'Test', type: 'success' }}
        testID="my-toast"
      />,
    );
    expect(getByTestId('my-toast')).toBeTruthy();
  });
});
