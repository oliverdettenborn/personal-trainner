import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useThemeColor } from '../../../hooks/useThemeColor';

export type AssessmentTemplateProps = {
  children?: React.ReactNode;
};

export function AssessmentTemplate({ children }: AssessmentTemplateProps) {
  const bg = useThemeColor({}, 'background');
  const borderGold = useThemeColor({}, 'borderGold');

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <ScrollView style={styles.contentContainer} contentContainerStyle={styles.contentScroll}>
        <View style={[styles.card, { borderColor: borderGold }]} testID="template-card" nativeID="template-card">
          {children}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  contentScroll: {
    padding: 20,
  },
  card: {
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
    maxWidth: 900,
    alignSelf: 'center',
    width: '100%',
  },
});
