import React from 'react';
import { 
  Pressable,
  PressableProps,
  StyleSheet, 
  ActivityIndicator 
} from 'react-native';
import { Text } from '../Text';
import { useThemeColor } from '../../../hooks/useThemeColor';

export type ButtonVariant = 'gold' | 'outline' | 'danger';

export type ButtonProps = PressableProps & {
  title: string;
  variant?: ButtonVariant;
  loading?: boolean;
  size?: 'sm' | 'md';
};

export function Button({ 
  title, 
  variant = 'gold', 
  loading = false, 
  size = 'md',
  style, 
  disabled,
  ...rest 
}: ButtonProps) {
  const gold = useThemeColor({}, 'gold');
  const borderGold = useThemeColor({}, 'borderGold');
  const textBeige = useThemeColor({}, 'text');

  const getVariantStyles = (hovered: boolean) => {
    switch (variant) {
      case 'outline':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: hovered ? gold : borderGold,
          },
          text: {
            color: gold,
          },
        };
      case 'danger':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: hovered ? '#a03030' : '#6a2020',
          },
          text: {
            color: hovered ? '#e08080' : '#c08080',
          },
        };
      case 'gold':
      default:
        return {
          container: {
            backgroundColor: hovered ? '#E4B96A' : gold,
          },
          text: {
            color: '#0e0e0e',
          },
        };
    }
  };

  const paddingVertical = size === 'sm' ? 4 : 8;
  const paddingHorizontal = size === 'sm' ? 10 : 16;
  const fontSize = size === 'sm' ? 12 : 14;

  return (
    <Pressable
      style={({ hovered, pressed }) => [
        styles.container,
        { paddingVertical, paddingHorizontal },
        getVariantStyles(hovered).container,
        pressed && { opacity: 0.7 },
        disabled && styles.disabled,
        // @ts-ignore
        style,
      ]}
      disabled={disabled || loading}
      {...rest}
    >
      {({ hovered }) => (
        loading ? (
          <ActivityIndicator color={getVariantStyles(hovered).text.color} />
        ) : (
          <Text style={[styles.text, { fontSize }, getVariantStyles(hovered).text]}>
            {title}
          </Text>
        )
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  disabled: {
    opacity: 0.5,
  },
});
