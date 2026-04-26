import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { useThemeColor } from '../../../hooks/useThemeColor';
import { Button, Text } from '../../atoms';

export type ConfirmModalProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({
  visible,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const bg2 = useThemeColor({}, 'backgroundSecondary');
  const borderGold = useThemeColor({}, 'borderGold');

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modal, { backgroundColor: bg2, borderColor: borderGold }]}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalMessage}>{message}</Text>
          
          <View style={styles.modalActions}>
            <Button 
              title={cancelText} 
              variant="outline" 
              onPress={onCancel} 
            />
            <Button 
              title={confirmText} 
              variant="gold" 
              onPress={() => {
                onConfirm();
                onCancel();
              }} 
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    width: '100%',
    maxWidth: 380,
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
  },
  modalTitle: {
    color: '#C9963A',
    fontSize: 16,
    marginBottom: 12,
    fontWeight: '700',
  },
  modalMessage: {
    color: '#e8e0d0',
    fontSize: 14,
    marginBottom: 24,
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'flex-end',
  },
});
