import { Text as RNText, TextProps as RNTextProps } from 'react-native';

type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold';
type TextColor = 'default' | 'muted' | 'brand' | 'error' | 'inverse';

export interface TextProps extends RNTextProps {
  size?: TextSize;
  weight?: TextWeight;
  color?: TextColor;
}

const sizeClasses: Record<TextSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
};

const weightClasses: Record<TextWeight, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

const colorClasses: Record<TextColor, string> = {
  default: 'text-neutral-900',
  muted: 'text-neutral-400',
  brand: 'text-brand-500',
  error: 'text-semantic-error',
  inverse: 'text-neutral-0',
};

export function Text({ size = 'base', weight = 'normal', color = 'default', className = '', ...rest }: TextProps) {
  return (
    <RNText
      className={[sizeClasses[size], weightClasses[weight], colorClasses[color], className]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    />
  );
}
