import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { useThemeColor } from '../../../hooks/useThemeColor';

export type CardProps = ViewProps & {
  children: React.ReactNode;
};

export function Card({ children, style, ...rest }: CardProps) {
  const bgSecondary = useThemeColor({}, 'backgroundSecondary');
  const borderGold = useThemeColor({}, 'borderGold');

  return (
    <View 
      style={[
        styles.card, 
        { backgroundColor: bgSecondary, borderColor: borderGold }, 
        style
      ]} 
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
});
