import Colors from "@theme/colors";

import { useColorScheme } from "./useColorScheme";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark,
) {
  const theme = useColorScheme() ?? "light";
  return props[theme] ?? Colors[theme][colorName];
}
