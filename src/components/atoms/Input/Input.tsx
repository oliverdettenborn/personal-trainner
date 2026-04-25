import { useState } from 'react';
import { TextInput, TextInputProps, View } from 'react-native';
import { Text } from '@atoms/Text';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  fullWidth?: boolean;
}

export function Input({ label, error, hint, fullWidth = true, className = '', ...rest }: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View className={fullWidth ? 'w-full' : ''}>
      {label && (
        <Text size="sm" weight="medium" className="mb-1">
          {label}
        </Text>
      )}
      <TextInput
        className={[
          'rounded-xl border px-4 py-3 bg-neutral-50 text-neutral-900',
          error ? 'border-semantic-error' : focused ? 'border-brand-500' : 'border-neutral-100',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholderTextColor="#94a3b8"
        {...rest}
      />
      {error && (
        <Text size="xs" color="error" className="mt-1">
          {error}
        </Text>
      )}
      {hint && !error && (
        <Text size="xs" color="muted" className="mt-1">
          {hint}
        </Text>
      )}
    </View>
  );
}
