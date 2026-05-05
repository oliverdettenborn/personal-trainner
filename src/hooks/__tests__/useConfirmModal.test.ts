import { act, renderHook } from '@testing-library/react-native';

import { useConfirmModal } from '../useConfirmModal';

describe('useConfirmModal', () => {
  it('starts with hidden state', () => {
    const { result } = renderHook(() => useConfirmModal());

    expect(result.current.config.visible).toBe(false);
    expect(result.current.config.title).toBe('');
    expect(result.current.config.message).toBe('');
  });

  it('shows modal with title, message, and onConfirm', () => {
    const { result } = renderHook(() => useConfirmModal());
    const onConfirm = jest.fn();

    act(() => {
      result.current.show('Delete?', 'Are you sure?', onConfirm);
    });

    expect(result.current.config.visible).toBe(true);
    expect(result.current.config.title).toBe('Delete?');
    expect(result.current.config.message).toBe('Are you sure?');
    expect(result.current.config.onConfirm).toBe(onConfirm);
  });

  it('hides modal preserving other fields', () => {
    const { result } = renderHook(() => useConfirmModal());
    const onConfirm = jest.fn();

    act(() => {
      result.current.show('Title', 'Message', onConfirm);
    });

    act(() => {
      result.current.hide();
    });

    expect(result.current.config.visible).toBe(false);
    expect(result.current.config.title).toBe('Title');
  });
});
