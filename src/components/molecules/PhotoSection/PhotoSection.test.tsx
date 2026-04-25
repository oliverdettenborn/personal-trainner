import React from 'react';
import { render } from '@testing-library/react-native';
import { PhotoSection } from './PhotoSection';

// Mocking sub-components
jest.mock('../../atoms/PhotoSlot/PhotoSlot', () => ({
  PhotoSlot: () => null,
}));

const commonProps = {
  labelFrenteAntes: "Frente Antes",
  labelFrenteDepois: "Frente Depois",
  labelCostasAntes: "Costas Antes",
  labelCostasDepois: "Costas Depois",
  onPhotoSelected: jest.fn(),
  onRemovePhoto: jest.fn(),
  assessmentData: {},
};

describe('PhotoSection', () => {
  it('renders all sections and inputs correctly', () => {
    const { getByText, getAllByPlaceholderText } = render(<PhotoSection {...commonProps} />);

    // Test labels
    expect(getByText('Frente')).toBeTruthy();
    expect(getByText('Costas')).toBeTruthy();
    
    // Test placeholders
    expect(getAllByPlaceholderText('0,0 kg').length).toBeGreaterThan(0);
    expect(getAllByPlaceholderText('__/__/____').length).toBeGreaterThan(0);
  });
});
