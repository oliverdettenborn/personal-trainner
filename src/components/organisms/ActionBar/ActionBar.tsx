import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Animated, Platform, StyleSheet, View } from 'react-native';
import { useThemeColor } from '../../../hooks/useThemeColor';
import { Button, Text } from '../../atoms';

export type ActionBarProps = {
  onSave?: () => void;
  onDownloadImage?: () => void;
  onCopyImage?: () => Promise<boolean> | void;
  onDelete?: () => void;
  isSaving?: boolean;
  status?: 'saved' | 'unsaved';
  nativeID?: string;
};

export function ActionBar({
  onSave,
  onDownloadImage,
  onCopyImage,
  onDelete,
  isSaving = false,
  status = 'saved',
  nativeID,
}: ActionBarProps) {
  const text3 = '#6a5a40';
  const success = useThemeColor({}, 'success');
  const gold = useThemeColor({}, 'gold');

  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const [isCopied, setIsCopied] = React.useState(false);

  React.useEffect(() => {
    if (status === 'unsaved') {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.4,
            duration: 750,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 750,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [status, pulseAnim]);

  const handleCopyClick = async () => {
    if (!onCopyImage) return;
    const result = await onCopyImage();
    if (result !== false) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <View style={styles.container} nativeID={nativeID}>
      <View style={styles.leftSection}>
        <Button
          title={isSaving ? "Salvando..." : "Salvar"}
          variant="gold"
          onPress={onSave}
          disabled={isSaving}
        />
        
        <Button
          title=""
          variant="outline"
          onPress={onDownloadImage}
          iconRight="download-outline"
        />

        {Platform.OS === 'web' && (
          <Button
            title=""
            variant="outline"
            onPress={handleCopyClick}
            iconRight={isCopied ? "checkmark-outline" : "copy-outline"}
          />
        )}
      </View>
      
      <View style={styles.rightSection}>
        <View style={styles.statusContainer}>
          <Animated.View 
            style={[
              styles.dot, 
              { 
                backgroundColor: status === 'saved' ? success : gold,
                opacity: status === 'unsaved' ? pulseAnim : 1,
              }
            ]} 
          />
          <Text style={[styles.statusText, { color: text3 }]}>
            {status === 'saved' ? 'Salvo' : 'Não salvo'}
          </Text>
        </View>
        
        <Button
          title="Excluir avaliação"
          variant="danger"
          size="sm"
          onPress={onDelete}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    alignItems: 'center',
    flexWrap: 'wrap',
    maxWidth: 900,
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingHorizontal: 20,
    width: '100%',
  },
  leftSection: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
    flexWrap: 'wrap',
  },
  rightSection: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
