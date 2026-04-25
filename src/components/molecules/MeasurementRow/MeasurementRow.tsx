import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useThemeColor } from '../../../hooks/useThemeColor';
import { Input, Text } from '../../atoms';

export type MeasurementRowProps = {
  label: string;
  placeholder: string;
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  onChangeText: (text: string) => void;
  textAlign?: 'left' | 'right';
};

export function MeasurementRow({ 
  label, 
  placeholder, 
  icon, 
  value, 
  onChangeText,
  textAlign = 'left' 
}: MeasurementRowProps) {
  const borderGold = useThemeColor({}, 'borderGold');
  const gold = useThemeColor({}, 'gold');

  const isRight = textAlign === 'right';

  return (
    <View style={[styles.container, isRight && styles.containerRight]}>
      {!isRight && (
        <View style={[styles.iconContainer, { borderColor: borderGold }]}>
          <Ionicons name={icon} size={14} color={gold} />
        </View>
      )}
      
      <View style={[styles.content, isRight && styles.contentRight]}>
        <Text style={[styles.label, isRight && styles.labelRight]}>{label}</Text>
        <Input
          variant="minimal"
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          style={[styles.input, isRight && styles.inputRight]}
          containerStyle={styles.inputContainer}
        />
      </View>

      {isRight && (
        <View style={[styles.iconContainer, { borderColor: borderGold }]}>
          <Ionicons name={icon} size={14} color={gold} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: 4,
  },
  containerRight: {
    justifyContent: 'flex-end',
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  contentRight: {
    alignItems: 'flex-end',
  },
  label: {
    fontSize: 9,
    color: '#6a5a40', // text3
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  labelRight: {
    textAlign: 'right',
  },
  input: {
    fontSize: 12,
  },
  inputRight: {
    textAlign: 'right',
  },
  inputContainer: {
    marginBottom: 0,
  },
});
