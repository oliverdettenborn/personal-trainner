import { Link, Stack } from 'expo-router';
import { View } from 'react-native';
import { Text } from '@atoms/Text';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not Found' }} />
      <View className="flex-1 items-center justify-center bg-neutral-50">
        <Text size="2xl" weight="bold">
          404
        </Text>
        <Text color="muted" className="mt-2 mb-6">
          This screen doesn't exist.
        </Text>
        <Link href="/">
          <Text color="brand">Go to home</Text>
        </Link>
      </View>
    </>
  );
}
