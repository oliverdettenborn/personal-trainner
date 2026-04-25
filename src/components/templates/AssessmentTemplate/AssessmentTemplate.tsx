import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useThemeColor } from '../../../hooks/useThemeColor';

export type AssessmentTemplateProps = {
  children?: React.ReactNode;
};

export function AssessmentTemplate({ children }: AssessmentTemplateProps) {
  const borderGold = useThemeColor({}, 'borderGold');

  return (
    <View style={[styles.card, { borderColor: borderGold }]} testID="template-card" nativeID="template-card">
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
    maxWidth: 900,
    alignSelf: 'center',
    width: '100%',
  },
});
