import { useEffect, useState } from 'react';
import { ColorSchemeName } from 'react-native';

export function useColorScheme(): ColorSchemeName {
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>('light');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setColorScheme(mediaQuery.matches ? 'dark' : 'light');

    const handler = (e: MediaQueryListEvent) => {
      setColorScheme(e.matches ? 'dark' : 'light');
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return colorScheme;
}
