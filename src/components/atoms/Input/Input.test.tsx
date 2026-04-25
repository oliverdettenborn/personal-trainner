import { render, fireEvent } from '@testing-library/react-native';
import { Input } from './Input';

describe('Input', () => {
  it('renders label', () => {
    const { getByText } = render(<Input label="Email" />);
    expect(getByText('Email')).toBeTruthy();
  });

  it('renders error message', () => {
    const { getByText } = render(<Input error="Required field" />);
    expect(getByText('Required field')).toBeTruthy();
  });

  it('renders hint when no error', () => {
    const { getByText } = render(<Input hint="e.g. user@example.com" />);
    expect(getByText('e.g. user@example.com')).toBeTruthy();
  });

  it('hides hint when error is present', () => {
    const { queryByText } = render(<Input hint="e.g. user@example.com" error="Required" />);
    expect(queryByText('e.g. user@example.com')).toBeNull();
  });

  it('calls onChangeText', () => {
    const onChange = jest.fn();
    const { getByTestId } = render(<Input testID="input" onChangeText={onChange} />);
    fireEvent.changeText(getByTestId('input'), 'hello');
    expect(onChange).toHaveBeenCalledWith('hello');
  });
});
