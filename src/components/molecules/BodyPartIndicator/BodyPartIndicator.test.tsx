import { render } from '@testing-library/react-native';
import React from 'react';
import { View } from 'react-native';
import { BodyPartIndicator } from './BodyPartIndicator';

// Mocking useThemeColor
jest.mock('../../../hooks/useThemeColor', () => ({
  useThemeColor: () => '#5a4010',
}));

describe('BodyPartIndicator', () => {
  const dummyIcon = <View testID="dummy-icon" />;

  it('renders the label correctly', () => {
    const { getByText } = render(
      <BodyPartIndicator label="OMBROS" icon={dummyIcon} side="left" />
    );
    expect(getByText('OMBROS')).toBeTruthy();
  });

  it('renders correctly for left side', () => {
    const { toJSON } = render(
      <BodyPartIndicator label="OMBROS" icon={dummyIcon} side="left" />
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders correctly for right side', () => {
    const { toJSON } = render(
      <BodyPartIndicator label="CINTURA" icon={dummyIcon} side="right" />
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
