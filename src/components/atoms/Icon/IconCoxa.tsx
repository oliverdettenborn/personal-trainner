import React from 'react';
import {
  Circle, G, Path, Svg, SvgProps,
} from 'react-native-svg';

type IconProps = {
  color?: string;
  size?: number;
} & SvgProps;

export function IconCoxa({
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
        <Path d="M 40,16 C 20,35 25,75 34,106" />
        <Path d="M 80,16 C 100,35 95,75 86,106" />
        <Path d="M 60,52 L 60,55" />
        <Path d="M 60,55 C 53,70 54,90 54,106" />
        <Path d="M 60,55 C 67,70 66,90 66,106" />
        <Path d="M 36,26 Q 60,32 84,26" />
        <Path d="M 27,42 Q 45,52 60,52 Q 75,52 93,42" />
        <Path d="M 19,65 L 28,65" />
        <Path d="M 24,61 L 28,65 L 24,69" />
        <Path d="M 101,65 L 92,65" />
        <Path d="M 96,61 L 92,65 L 96,69" />
      </G>
    </Svg>
  );
}
