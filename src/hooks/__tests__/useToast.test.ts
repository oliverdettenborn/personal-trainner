import { act, renderHook } from '@testing-library/react-native';

import { useToast } from '../useToast';

describe('useToast', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('starts with hidden state', () => {
    const { result } = renderHook(() => useToast());

    expect(result.current.toast.visible).toBe(false);
    expect(result.current.toast.message).toBe('');
    expect(result.current.toast.type).toBe('success');
  });

  it('shows toast with message and type', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.show('Saved!', 'success');
    });

    expect(result.current.toast.visible).toBe(true);
    expect(result.current.toast.message).toBe('Saved!');
    expect(result.current.toast.type).toBe('success');
  });

  it('shows error toast', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.show('Something went wrong', 'error');
    });

    expect(result.current.toast.visible).toBe(true);
    expect(result.current.toast.type).toBe('error');
  });

  it('auto-hides after duration', () => {
    const { result } = renderHook(() => useToast(2000));

    act(() => {
      result.current.show('Temp message');
    });

    expect(result.current.toast.visible).toBe(true);

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(result.current.toast.visible).toBe(false);
  });

  it('hides manually', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.show('Message');
    });

    expect(result.current.toast.visible).toBe(true);

    act(() => {
      result.current.hide();
    });

    expect(result.current.toast.visible).toBe(false);
  });

  it('resets timer when showing a new toast', () => {
    const { result } = renderHook(() => useToast(3000));

    act(() => {
      result.current.show('First');
    });

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    act(() => {
      result.current.show('Second');
    });

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // Should still be visible (timer was reset)
    expect(result.current.toast.visible).toBe(true);
    expect(result.current.toast.message).toBe('Second');

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.toast.visible).toBe(false);
  });
});
