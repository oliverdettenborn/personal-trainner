import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { MeasurementRow } from './MeasurementRow';

jest.mock('react-native-svg', () => {
  const { View: MockView } = require('react-native');
  return {
    Svg: (props: any) => <MockView {...props} />,
    Path: (props: any) => <MockView {...props} />,
  };
});

const SVG_SHOULDERS = "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z";

describe('MeasurementRow', () => {
  it('renders label and placeholder correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <MeasurementRow 
        label="Ombros" 
        placeholder="__ cm" 
        svgPath={SVG_SHOULDERS}
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
        svgPath={SVG_SHOULDERS}
        value=""
        onChangeText={onChangeTextMock}
      />
    );
    
    fireEvent.changeText(getByPlaceholderText('__ cm'), '80');
    expect(onChangeTextMock).toHaveBeenCalledWith('80 cm');
  });
});
