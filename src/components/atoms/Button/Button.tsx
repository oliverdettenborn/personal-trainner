import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    PressableProps,
    StyleSheet,
    TextStyle,
    View,
    ViewStyle
} from 'react-native';
import { useThemeColor } from '../../../hooks/useThemeColor';
import { Text } from '../Text';

export type ButtonVariant = 'gold' | 'outline' | 'danger';

export type ButtonProps = PressableProps & {
  title: string;
  variant?: ButtonVariant;
  loading?: boolean;
  size?: 'sm' | 'md';
  iconRight?: keyof typeof Ionicons.glyphMap;
};

export function Button({ 
  title, 
  variant = 'gold', 
  loading = false, 
  size = 'md',
  style, 
  disabled,
  iconRight,
  ...rest 
}: ButtonProps) {
  const [hovered, setHovered] = useState(false);
  const gold = useThemeColor({}, 'gold');
  const borderGold = useThemeColor({}, 'borderGold');

  const getVariantStyles = (hovered: boolean) => {
    switch (variant) {
      case 'outline':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: hovered ? gold : borderGold,
          } as ViewStyle,
          text: {
            color: gold,
          } as TextStyle,
        };
      case 'danger':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: hovered ? '#a03030' : '#6a2020',
          } as ViewStyle,
          text: {
            color: hovered ? '#e08080' : '#c08080',
          } as TextStyle,
        };
      case 'gold':
      default:
        return {
          container: {
            backgroundColor: hovered ? '#E4B96A' : gold,
          } as ViewStyle,
          text: {
            color: '#0e0e0e',
          } as TextStyle,
        };
    }
  };

  const paddingVertical = size === 'sm' ? 4 : 8;
  const paddingHorizontal = size === 'sm' ? 10 : 16;
  const fontSize = size === 'sm' ? 12 : 14;

  return (
    <View
      // @ts-ignore - web-only events
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Pressable
        style={(state) => [
          styles.container,
          { paddingVertical, paddingHorizontal },
          getVariantStyles(hovered).container,
          state.pressed && { opacity: 0.7 },
          disabled && styles.disabled,
          typeof style === 'function' ? style(state) : style,
        ]}
        disabled={disabled || loading}
        {...rest}
      >
        {(state) => (
          loading ? (
            <ActivityIndicator color={getVariantStyles(hovered).text.color} />
          ) : (
            <>
              <Text style={[styles.text, { fontSize }, getVariantStyles(hovered).text]}>
                {title}
              </Text>
              {iconRight && (
                <Ionicons 
                  name={iconRight} 
                  size={fontSize + 2} 
                  color={getVariantStyles(hovered).text.color} 
                  style={{ marginLeft: 6 }} 
                />
              )}
            </>
          )
        )}
      </Pressable>
    </View>
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
