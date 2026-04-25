import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from './Button';

describe('Button', () => {
  it('renders correctly with title', () => {
    const { getByText } = render(<Button title="Test Button" />);
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when clicked', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(<Button title="Click Me" onPress={onPressMock} />);
    
    fireEvent.press(getByText('Click Me'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('renders with different variants', () => {
    const { getByTestId, rerender } = render(<Button title="Gold" variant="gold" testID="btn" />);
    expect(getByTestId('btn')).toBeTruthy();

    rerender(<Button title="Outline" variant="outline" testID="btn" />);
    expect(getByTestId('btn')).toBeTruthy();

    rerender(<Button title="Danger" variant="danger" testID="btn" />);
    expect(getByTestId('btn')).toBeTruthy();
  });
});
