import React from 'react';
import { render } from '@testing-library/react-native';
import { AssessmentForm } from './AssessmentForm';
import { Assessment } from '../../../types/assessment';

// Mocking child components
jest.mock('../../molecules/PhotoSection/PhotoSection', () => {
  const { View: MockView, Text: MockText } = require('react-native');
  return {
    PhotoSection: ({ assessmentData }: any) => (
      <MockView testID="mock-photo-section">
        <MockText>{assessmentData?.frente_antes_data || 'No Date'}</MockText>
      </MockView>
    ),
  };
});

jest.mock('../../molecules/FeedbackPanel/FeedbackPanel', () => {
  const { View: MockView, Text: MockText } = require('react-native');
  return {
    FeedbackPanel: ({ title }: any) => (
      <MockView testID={`mock-feedback-panel-${title}`}>
        <MockText>{title}</MockText>
      </MockView>
    ),
  };
});

const mockAssessment: Assessment = {
  id: 'a1',
  studentId: 's1',
  createdAt: Date.now(),
  positivo_1: 'Good work',
};

describe('AssessmentForm', () => {
  it('renders PhotoSection and FeedbackPanels correctly', () => {
    const { getByTestId } = render(
      <AssessmentForm 
        assessment={mockAssessment}
        onUpdate={jest.fn()} 
      />
    );

    expect(getByTestId('mock-photo-section')).toBeTruthy();
    expect(getByTestId('mock-feedback-panel-Pontos')).toBeTruthy(); 
  });
});
