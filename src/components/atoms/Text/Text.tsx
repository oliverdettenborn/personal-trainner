import { useThemeColor } from "@hooks/useThemeColor";
import { Text as RNText, TextProps as RNTextProps } from "react-native";

export type TextProps = RNTextProps & {
  lightColor?: string;
  darkColor?: string;
};

export function Text({ style, lightColor, darkColor, ...rest }: TextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  return <RNText style={[{ color }, style]} {...rest} />;
}

export function MonoText(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: "SpaceMono" }]} />;
}
