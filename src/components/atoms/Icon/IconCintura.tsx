import React from 'react';
import {
  Circle, G, Path, Svg, SvgProps,
} from 'react-native-svg';

type IconProps = {
  color?: string;
  size?: number;
} & SvgProps;

export function IconCintura({
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
        <Path d="M 42,20 C 50,45 46,65 32,106" />
        <Path d="M 78,20 C 70,45 74,65 88,106" />
        <Path d="M 37,70 Q 60,78 83,70" />
        <Path d="M 34,80 Q 50,88 56,100" />
        <Path d="M 86,80 Q 70,88 64,100" />
        <Path d="M 56,100 L 64,100" />
        <Path d="M 56,100 L 56,106" />
        <Path d="M 64,100 L 64,106" />
        <Path d="M 20,55 L 34,55" />
        <Path d="M 26,49 L 34,55 L 26,61" />
        <Path d="M 100,55 L 86,55" />
        <Path d="M 94,49 L 86,55 L 94,61" />
      </G>
    </Svg>
  );
}
