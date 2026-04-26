import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useThemeColor } from '../../../hooks/useThemeColor';
import { Text } from '../../atoms';

export type BodyPartIndicatorProps = {
  label: string;
  icon: React.ReactNode;
  side?: 'left' | 'right';
};

export function BodyPartIndicator({ 
  label, 
  icon,
  side = 'left' 
}: BodyPartIndicatorProps) {
  const borderGold = useThemeColor({}, 'borderGold');
  const isRight = side === 'right';

  const iconWithLabel = (
    <View style={styles.iconWrapper}>
      <View style={[styles.iconContainer, { borderColor: borderGold }]}>
        {icon}
      </View>
      <Text style={[styles.label, isRight && styles.labelRight]}>{label}</Text>
    </View>
  );

  const lineBefore = (
    <View style={styles.lineContainer}>
      <View style={[styles.line, { backgroundColor: borderGold }]} />
    </View>
  );

  const lineAfter = (
    <View style={styles.lineContainer}>
      <View style={[styles.line, { backgroundColor: borderGold }]} />
    </View>
  );

  return (
    <View style={[styles.container, isRight && styles.containerRight]}>
      {/* For left side, line is after icon (icon -> line -> photo) */}
      {!isRight && (
        <>
          <View style={{ flex: 1 }} /> {/* Spacer to help centering if needed, or keep it empty */}
          {iconWithLabel}
          {lineAfter}
        </>
      )}
      
      {/* For right side, line is before icon (photo -> line -> icon) */}
      {isRight && (
        <>
          {lineBefore}
          {iconWithLabel}
          <View style={{ flex: 1 }} /> {/* Spacer to help centering if needed */}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    width: '100%',
  },
  containerRight: {
    justifyContent: 'flex-end',
  },
  iconWrapper: {
    alignItems: 'center',
    gap: 6,
    zIndex: 2,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a',
  },
  label: {
    fontSize: 11,
    color: '#6a5a40',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontWeight: '800',
  },
  labelRight: {
    textAlign: 'center',
  },
  lineContainer: {
    flex: 1,
    height: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -16, 
  },
  line: {
    width: '100%',
    height: 2,
  },
});
