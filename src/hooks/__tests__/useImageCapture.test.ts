import { renderHook } from '@testing-library/react-native';
import { Platform } from 'react-native';

import { useImageCapture } from '../useImageCapture';

jest.mock('expo-sharing', () => ({
  shareAsync: jest.fn(),
}));

jest.mock('react-native-view-shot', () => ({
  captureRef: jest.fn().mockResolvedValue('file://screenshot.png'),
}));

describe('useImageCapture', () => {
  const mockRef = { current: null };

  it('returns download and copy functions', () => {
    const { result } = renderHook(() => useImageCapture({
      captureRef: mockRef,
      elementId: 'capture-area',
      fileName: 'test-file',
    }));

    expect(typeof result.current.download).toBe('function');
    expect(typeof result.current.copy).toBe('function');
  });

  it('download does nothing when ref.current is null', async () => {
    const { result } = renderHook(() => useImageCapture({
      captureRef: { current: null },
      elementId: 'capture-area',
      fileName: 'test-file',
    }));

    // Should not throw
    await result.current.download();
  });

  it('copy returns false on non-web platform', async () => {
    Platform.OS = 'android';

    const { result } = renderHook(() => useImageCapture({
      captureRef: mockRef,
      elementId: 'capture-area',
      fileName: 'test-file',
    }));

    const copied = await result.current.copy();
    expect(copied).toBe(false);

    Platform.OS = 'web'; // restore
  });
});
