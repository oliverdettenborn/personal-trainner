import { View } from 'react-native';
import { Text } from '@atoms/Text';

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-neutral-50">
      <Text size="2xl" weight="bold">
        Personal Trainer
      </Text>
      <Text color="muted" className="mt-2">
        Your fitness journey starts here
      </Text>
    </View>
  );
}
