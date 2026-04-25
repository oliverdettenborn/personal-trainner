import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PhotoSlot } from './PhotoSlot';

describe('PhotoSlot', () => {
  it('renders placeholder when no uri is provided', () => {
    const { getByText } = render(<PhotoSlot onPhotoSelected={() => {}} />);
    expect(getByText('Clique para adicionar foto')).toBeTruthy();
  });

  it('renders image when uri is provided', () => {
    const { getByTestId } = render(
      <PhotoSlot uri="https://example.com/photo.jpg" onPhotoSelected={() => {}} />
    );
    expect(getByTestId('photo-image')).toBeTruthy();
  });

  it('calls onRemove when remove button is pressed', () => {
    const onRemoveMock = jest.fn();
    const { getByText } = render(
      <PhotoSlot uri="https://example.com/photo.jpg" onPhotoSelected={() => {}} onRemove={onRemoveMock} />
    );
    
    fireEvent.press(getByText('✕ remover'));
    expect(onRemoveMock).toHaveBeenCalledTimes(1);
  });
});
