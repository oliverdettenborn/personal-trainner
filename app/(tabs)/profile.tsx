import { View } from 'react-native';
import { Text } from '@atoms/Text';

export default function ProfileScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-neutral-50">
      <Text size="2xl" weight="bold">
        Profile
      </Text>
      <Text color="muted" className="mt-2">
        Manage your account
      </Text>
    </View>
  );
}
