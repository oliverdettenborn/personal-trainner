import React from 'react';
import { 
  TextInput, 
  TextInputProps, 
  StyleSheet, 
  View, 
  TextStyle 
} from 'react-native';
import { Text } from '../Text';
import { useThemeColor } from '../../../hooks/useThemeColor';

export type InputVariant = 'boxed' | 'minimal';

export type InputProps = TextInputProps & {
  label?: string;
  variant?: InputVariant;
  containerStyle?: any;
};

export function Input({ 
  label, 
  variant = 'boxed', 
  containerStyle, 
  style, 
  ...rest 
}: InputProps) {
  const textBeige = useThemeColor({}, 'text');
  const borderGold = useThemeColor({}, 'borderGold');
  const bgTertiary = useThemeColor({}, 'backgroundTertiary');
  const gold = useThemeColor({}, 'gold');

  const isMinimal = variant === 'minimal';

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          { color: textBeige },
          isMinimal ? styles.inputMinimal : styles.inputBoxed,
          !isMinimal && { backgroundColor: bgTertiary, borderColor: borderGold },
          isMinimal && { borderBottomColor: borderGold },
          style,
        ]}
        placeholderTextColor="#6a5a40"
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 12,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6a5a40',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  input: {
    fontSize: 14,
    paddingHorizontal: 10,
  },
  inputBoxed: {
    height: 36,
    borderWidth: 1,
    borderRadius: 6,
  },
  inputMinimal: {
    height: 28,
    borderBottomWidth: 1,
    paddingHorizontal: 0,
  },
});
