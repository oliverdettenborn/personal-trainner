import { render } from '@testing-library/react-native';
import React from 'react';
import { BodyPartIndicator } from './BodyPartIndicator';

// Mocking useThemeColor
jest.mock('../../../hooks/useThemeColor', () => ({
  useThemeColor: () => '#5a4010',
}));

describe('BodyPartIndicator', () => {
  const dummyIcon = 1; // Mocked image require

  it('renders the label correctly', () => {
    const { getByText } = render(
      <BodyPartIndicator label="OMBROS" imageSource={dummyIcon} side="left" />
    );
    expect(getByText('OMBROS')).toBeTruthy();
  });

  it('renders correctly for left side', () => {
    const { toJSON } = render(
      <BodyPartIndicator label="OMBROS" imageSource={dummyIcon} side="left" />
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders correctly for right side', () => {
    const { toJSON } = render(
      <BodyPartIndicator label="CINTURA" imageSource={dummyIcon} side="right" />
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
