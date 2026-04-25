import React from 'react';
import { render } from '@testing-library/react-native';
import { FeedbackPanel } from './FeedbackPanel';

// Mocking @expo/vector-icons
jest.mock('@expo/vector-icons', () => {
  const { Text: MockText } = require('react-native');
  return {
    Ionicons: ({ name }: any) => <MockText>{name}</MockText>,
  };
});

describe('FeedbackPanel', () => {
  const mockItems = [
    { value: 'Test Item 1', onChangeText: jest.fn() },
    { value: 'Test Item 2', onChangeText: jest.fn() },
  ];

  it('renders title and items correctly', () => {
    const { getByText, getByDisplayValue } = render(
      <FeedbackPanel 
        title="Test" 
        highlightedTitle="Panel" 
        icon="checkmark" 
        dotColor="green"
        items={mockItems} 
      />
    );

    // Use regex to be flexible with nested Text components
    expect(getByText(/Test/)).toBeTruthy();
    expect(getByText(/Panel/)).toBeTruthy();
    
    // Inputs use getByDisplayValue or similar
    expect(getByDisplayValue('Test Item 1')).toBeTruthy();
    expect(getByDisplayValue('Test Item 2')).toBeTruthy();
  });
});
