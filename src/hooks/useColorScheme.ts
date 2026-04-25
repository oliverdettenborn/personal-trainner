import { Appearance } from 'react-native';

export const useColorScheme = () => {
  return Appearance.getColorScheme(); // Returns 'light', 'dark', or null
};
