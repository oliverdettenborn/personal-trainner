import Ionicons from '@expo/vector-icons/Ionicons';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

export interface IconProps {
  name: IoniconsName;
  size?: number;
  color?: string;
}

export function Icon({ name, size = 24, color = '#0f172a' }: IconProps) {
  return <Ionicons name={name} size={size} color={color} />;
}
