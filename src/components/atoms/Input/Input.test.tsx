import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Input } from './Input';

describe('Input', () => {
  it('renders correctly', () => {
    const { getByPlaceholderText } = render(<Input placeholder="Type here" />);
    expect(getByPlaceholderText('Type here')).toBeTruthy();
  });

  it('updates value when text changes', () => {
    const onChangeTextMock = jest.fn();
    const { getByPlaceholderText } = render(
      <Input placeholder="Search" onChangeText={onChangeTextMock} />
    );
    
    fireEvent.changeText(getByPlaceholderText('Search'), 'Hello');
    expect(onChangeTextMock).toHaveBeenCalledWith('Hello');
  });

  it('renders with label if provided', () => {
    const { getByText } = render(<Input label="Name" />);
    expect(getByText('Name')).toBeTruthy();
  });
});
