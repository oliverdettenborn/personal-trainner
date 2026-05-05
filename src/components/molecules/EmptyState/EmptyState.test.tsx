import { render } from '@testing-library/react-native';
import React from 'react';
import { View as MockView } from 'react-native';
import { Svg } from 'react-native-svg';

import { EmptyState } from './EmptyState';

jest.mock('react-native-svg', () => ({
  Svg: (props: React.ComponentProps<typeof MockView>) => (
      <MockView {...props} />
  ),
  Path: (props: React.ComponentProps<typeof MockView>) => (
      <MockView {...props} />
  ),
}));

describe('EmptyState', () => {
  it('renders the message text', () => {
    const { getByText } = render(
      <EmptyState message="Selecione um aluno para começar." />,
    );

    expect(getByText('Selecione um aluno para começar.')).toBeTruthy();
  });

  it('applies testID when provided', () => {
    const { getByTestId } = render(
      <EmptyState message="Test" testID="empty-state" />,
    );

    expect(getByTestId('empty-state')).toBeTruthy();
  });

  it('renders SVG icon', () => {
    // eslint-disable-next-line camelcase
    const { UNSAFE_getByType } = render(<EmptyState message="Hello" />);

    // eslint-disable-next-line camelcase
    expect(UNSAFE_getByType(Svg)).toBeTruthy();
  });
});
