import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';

import { useThemeColor } from '../../../hooks/useThemeColor';
import { Text } from '../Text';

export type InputVariant = 'boxed' | 'minimal';

export type InputProps = TextInputProps & {
  label?: string;
  variant?: InputVariant;
  containerStyle?: StyleProp<ViewStyle>;
  error?: string;
  testID?: string;
};

export function Input({
  label,
  variant = 'boxed',
  containerStyle,
  style,
  error,
  testID,
  ...rest
}: InputProps) {
  const textBeige = useThemeColor({}, 'text');
  const borderGold = useThemeColor({}, 'borderGold');
  const bgTertiary = useThemeColor({}, 'backgroundTertiary');

  const isMinimal = variant === 'minimal';

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          isMinimal ? styles.inputMinimal : styles.inputBoxed,
          {
            color: textBeige,
            borderColor: isMinimal ? 'transparent' : borderGold,
            borderBottomColor: borderGold,
            backgroundColor: isMinimal ? 'transparent' : bgTertiary,
          },
          error
            ? { borderColor: '#d32f2f', borderBottomColor: '#d32f2f' }
            : undefined,
          style,
        ]}
        placeholderTextColor="#6a5a40"
        testID={testID}
        {...rest}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 12,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
    opacity: 0.8,
    textTransform: 'uppercase',
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
  errorText: {
    color: '#d32f2f',
    fontSize: 11,
    marginTop: 2,
  },
});
