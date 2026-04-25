import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { MeasurementRow } from './MeasurementRow';

describe('MeasurementRow', () => {
  it('renders label and placeholder correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <MeasurementRow 
        label="Ombros" 
        placeholder="__ cm" 
        icon="resize"
        value=""
        onChangeText={() => {}}
      />
    );
    expect(getByText('Ombros')).toBeTruthy();
    expect(getByPlaceholderText('__ cm')).toBeTruthy();
  });

  it('calls onChangeText when input changes', () => {
    const onChangeTextMock = jest.fn();
    const { getByPlaceholderText } = render(
      <MeasurementRow 
        label="Cintura" 
        placeholder="__ cm" 
        icon="fitness"
        value=""
        onChangeText={onChangeTextMock}
      />
    );
    
    fireEvent.changeText(getByPlaceholderText('__ cm'), '80');
    expect(onChangeTextMock).toHaveBeenCalledWith('80');
  });
});
