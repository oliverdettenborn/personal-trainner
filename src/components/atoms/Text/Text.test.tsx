import { render } from '@testing-library/react-native';
import { Text } from './Text';

describe('Text', () => {
  it('renders children', () => {
    const { getByText } = render(<Text>Hello</Text>);
    expect(getByText('Hello')).toBeTruthy();
  });

  it('applies size class', () => {
    const { getByText } = render(<Text size="xl">Big</Text>);
    expect(getByText('Big')).toBeTruthy();
  });

  it('accepts additional className', () => {
    const { getByText } = render(<Text className="mt-4">Spaced</Text>);
    expect(getByText('Spaced')).toBeTruthy();
  });
});
