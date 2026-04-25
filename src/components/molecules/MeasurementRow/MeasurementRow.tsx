import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Path, Svg } from 'react-native-svg';
import { useThemeColor } from '../../../hooks/useThemeColor';
import { Input, Text } from '../../atoms';

export type MeasurementRowProps = {
  label: string;
  placeholder: string;
  svgPath: string;
  value: string;
  onChangeText: (text: string) => void;
  textAlign?: 'left' | 'right';
};

export function MeasurementRow({ 
  label, 
  placeholder, 
  svgPath, 
  value, 
  onChangeText,
  textAlign = 'left' 
}: MeasurementRowProps) {
  const borderGold = useThemeColor({}, 'borderGold');
  const gold = useThemeColor({}, 'gold');

  const isRight = textAlign === 'right';

  const icon = (
    <View style={[styles.iconContainer, { borderColor: borderGold }]}>
      <Svg width={14} height={14} viewBox="0 0 24 24" fill={gold}>
        <Path d={svgPath} />
      </Svg>
    </View>
  );

  return (
    <View style={[styles.container, isRight && styles.containerRight]}>
      {!isRight && icon}
      
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

      {isRight && icon}
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
