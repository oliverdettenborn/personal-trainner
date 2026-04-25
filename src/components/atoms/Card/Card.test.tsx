import React from 'react';
import { render } from '@testing-library/react-native';
import { Card } from './Card';
import { Text } from '../Text';

describe('Card', () => {
  it('renders children correctly', () => {
    const { getByText } = render(
      <Card>
        <Text>Card Content</Text>
      </Card>
    );
    expect(getByText('Card Content')).toBeTruthy();
  });
});
