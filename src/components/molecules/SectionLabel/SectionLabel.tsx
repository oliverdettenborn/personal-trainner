import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useThemeColor } from '../../../hooks/useThemeColor';
import { Text } from '../../atoms';

type SectionLabelProps = {
  children: string;
};

export function SectionLabel({ children }: SectionLabelProps) {
  const bg3 = useThemeColor({}, 'backgroundTertiary');
  const borderGold = useThemeColor({}, 'borderGold');
  const gold = useThemeColor({}, 'gold');

  return (
    <View style={[styles.container, { backgroundColor: bg3, borderColor: borderGold }]}>
      <View style={[styles.labelBox, { borderColor: borderGold }]}>
        <Text style={[styles.labelText, { color: gold }]}>{children}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelBox: {
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
  },
  labelText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});
