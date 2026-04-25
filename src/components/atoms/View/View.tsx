import { View as RNView, ViewProps as RNViewProps } from 'react-native';
import { useThemeColor } from '@hooks/useThemeColor';

export type ViewProps = RNViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function View({ style, lightColor, darkColor, ...rest }: ViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  return <RNView style={[{ backgroundColor }, style]} {...rest} />;
}
