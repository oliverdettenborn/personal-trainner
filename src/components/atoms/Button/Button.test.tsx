import { render, fireEvent } from '@testing-library/react-native';
import { Button } from './Button';

describe('Button', () => {
  it('renders label', () => {
    const { getByText } = render(<Button label="Press me" />);
    expect(getByText('Press me')).toBeTruthy();
  });

  it('shows loading text when loading', () => {
    const { getByText } = render(<Button label="Press me" loading />);
    expect(getByText('Loading...')).toBeTruthy();
  });

  it('is disabled when loading', () => {
    const { getByRole } = render(<Button label="Press me" loading />);
    expect(getByRole('button')).toBeDisabled();
  });

  it('calls onPress handler', () => {
    const onPress = jest.fn();
    const { getByRole } = render(<Button label="Press me" onPress={onPress} />);
    fireEvent.press(getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    const { getByRole } = render(<Button label="Press me" disabled onPress={onPress} />);
    fireEvent.press(getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
  });
});
