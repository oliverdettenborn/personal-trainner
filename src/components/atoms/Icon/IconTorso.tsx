import React from 'react';
import {
  Circle, G, Path, Svg, SvgProps,
} from 'react-native-svg';

type IconProps = {
  color?: string;
  size?: number;
} & SvgProps;

export function IconTorso({
  color = '#BE8B5E',
  size = 120,
  ...props
}: IconProps) {
  return (
    <Svg viewBox="0 0 120 120" width={size} height={size} {...props}>
      <Circle
        cx="60"
        cy="60"
        r="55"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
      />
      <G
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Path d="M 52,18 L 52,24 Q 52,28 46,28" />
        <Path d="M 68,18 L 68,24 Q 68,28 74,28" />
        <Path d="M 44,34 Q 52,32 58,36" />
        <Path d="M 76,34 Q 68,32 62,36" />
        <Path d="M 38,28 C 20,28 22,45 20,58 C 16,75 36,75 34,58 L 36,46" />
        <Path d="M 36,46 Q 42,75 38,106" />
        <Path d="M 82,28 C 100,28 98,45 100,58 C 104,75 84,75 86,58 L 84,46" />
        <Path d="M 84,46 Q 78,75 82,106" />
        <Path d="M 36,46 Q 45,62 58,54 L 58,42" />
        <Path d="M 84,46 Q 75,62 62,54 L 62,42" />
      </G>
    </Svg>
  );
}
