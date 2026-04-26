import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Animated, Platform, StyleSheet, View } from 'react-native';
import { useThemeColor } from '../../../hooks/useThemeColor';
import { Button, Text } from '../../atoms';

export type ActionBarProps = {
  onSave?: () => void;
  onDownloadImage?: () => void;
  onCopyImage?: () => void;
  onImport?: (file: File | any) => void;
  onDelete?: () => void;
  isSaving?: boolean;
  status?: 'saved' | 'unsaved';
  nativeID?: string;
};

export function ActionBar({
  onSave,
  onDownloadImage,
  onCopyImage,
  onImport,
  onDelete,
  isSaving = false,
  status = 'saved',
  nativeID,
}: ActionBarProps) {
  const text3 = '#6a5a40';
  const success = useThemeColor({}, 'success');
  const gold = useThemeColor({}, 'gold');

  const pulseAnim = React.useRef(new Animated.Value(1)).current;

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

  const handleFileChange = (event: any) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      try {
        const data = JSON.parse(e.target.result as string);
        onImport?.(data);
      } catch (error) {
        console.error("Failed to parse JSON", error);
        alert("Erro ao importar JSON. Verifique o formato do arquivo.");
      }
    };
    reader.readAsText(file);
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
          title="Baixar Imagem"
          variant="outline"
          onPress={onDownloadImage}
        />

        {Platform.OS === 'web' && (
          <Button
            title="Copiar Imagem"
            variant="outline"
            onPress={onCopyImage}
          />
        )}
        
        {Platform.OS === 'web' && (
          <label style={{ 
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 14px',
            fontSize: 13,
            fontWeight: '600',
            backgroundColor: 'transparent',
            border: '1px solid #5a4010',
            color: '#C9963A',
            borderRadius: 6,
          }}>
            <Ionicons name="cloud-download-outline" size={13} color="#C9963A" />
            Importar JSON
            <input
              type="file"
              accept=".json"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </label>
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
