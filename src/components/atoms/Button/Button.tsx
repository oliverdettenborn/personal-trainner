import { Pressable, PressableProps } from 'react-native';
import { Text } from '@atoms/Text';

type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<PressableProps, 'style'> {
  label: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-brand-500 active:bg-brand-600',
  secondary: 'bg-neutral-100 active:bg-neutral-200',
  ghost: 'bg-transparent active:bg-neutral-100',
  destructive: 'bg-semantic-error active:opacity-80',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5',
  md: 'px-4 py-2.5',
  lg: 'px-6 py-3.5',
};

const textVariantClasses: Record<Variant, string> = {
  primary: 'text-white font-bold',
  secondary: 'text-neutral-700 font-semibold',
  ghost: 'text-brand-500 font-semibold',
  destructive: 'text-white font-bold',
};

const textSizeMap: Record<Size, 'sm' | 'base'> = {
  sm: 'sm',
  md: 'base',
  lg: 'base',
};

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      className={[
        'rounded-xl items-center justify-center flex-row gap-2',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : 'self-start',
        isDisabled ? 'opacity-50' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      {...rest}>
      <Text className={textVariantClasses[variant]} size={textSizeMap[size]}>
        {loading ? 'Loading...' : label}
      </Text>
    </Pressable>
  );
}
