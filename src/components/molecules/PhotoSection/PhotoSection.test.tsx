import { render } from '@testing-library/react-native';
import React from 'react';
import { PhotoSection } from './PhotoSection';

// Mocking sub-components
jest.mock('../../atoms/PhotoSlot/PhotoSlot', () => ({
  PhotoSlot: () => null,
}));

jest.mock('react-native-svg', () => {
  const { View: MockView } = require('react-native');
  return {
    Svg: (props: any) => <MockView {...props} />,
    Path: (props: any) => <MockView {...props} />,
  };
});

jest.mock('../MeasurementRow/MeasurementRow', () => {
  const { View: MockView, Text: MockText } = require('react-native');
  return {
    MeasurementRow: ({ label }: any) => (
      <MockView><MockText>{label}</MockText></MockView>
    ),
  };
});

const commonProps = {
  onPhotoSelected: jest.fn(),
  onRemovePhoto: jest.fn(),
  onFieldChange: jest.fn(),
  assessmentData: {},
};

describe('PhotoSection', () => {
  it('renders all sections and inputs correctly', () => {
    const { getByText, getAllByPlaceholderText } = render(<PhotoSection {...commonProps} />);

    // Test section labels
    expect(getByText('Frente')).toBeTruthy();
    expect(getByText('Costas')).toBeTruthy();
    
    // Test Data/Peso input placeholders
    expect(getAllByPlaceholderText('0,0 kg').length).toBeGreaterThan(0);
    expect(getAllByPlaceholderText('__/__/____').length).toBeGreaterThan(0);
  });
});
