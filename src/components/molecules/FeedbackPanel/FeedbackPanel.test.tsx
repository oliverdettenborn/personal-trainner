import { render } from '@testing-library/react-native';
import React from 'react';
import { FeedbackPanel } from './FeedbackPanel';

jest.mock('react-native-svg', () => {
  const { View: MockView } = require('react-native');
  return {
    Svg: (props: any) => <MockView {...props} />,
    Path: (props: any) => <MockView {...props} />,
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
        svgPath="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" 
        dotColor="green"
        items={mockItems} 
      />
    );

    expect(getByText(/Test/)).toBeTruthy();
    expect(getByText(/Panel/)).toBeTruthy();
    expect(getByDisplayValue('Test Item 1')).toBeTruthy();
    expect(getByDisplayValue('Test Item 2')).toBeTruthy();
  });
});
