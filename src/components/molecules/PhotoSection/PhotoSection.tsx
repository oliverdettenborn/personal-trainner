import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useThemeColor } from '../../../hooks/useThemeColor';
import { Card, PhotoSlot, Text } from '../../atoms';
import { MeasurementRow } from '../MeasurementRow';
import { SectionLabel } from '../SectionLabel';

export type PhotoSectionProps = {
  labelFrenteAntes: string;
  labelFrenteDepois: string;
  labelCostasAntes: string;
  labelCostasDepois: string;
  onPhotoSelected: (key: string, uri: string) => void;
  onRemovePhoto: (key: string) => void;
  assessmentData: any; 
};

export function PhotoSection({ 
  labelFrenteAntes, 
  labelFrenteDepois,
  labelCostasAntes,
  labelCostasDepois,
  onPhotoSelected,
  onRemovePhoto,
  assessmentData 
}: PhotoSectionProps) {
  const text2 = useThemeColor({}, 'text2');
  const text3 = '#6a5a40'; // text3 from HTML
  const gold = useThemeColor({}, 'gold');
  const bgSecondary = useThemeColor({}, 'backgroundSecondary');
  const borderGold = useThemeColor({}, 'borderGold');

  const handlePhotoSelect = (key: string, uri: string) => {
    onPhotoSelected(key, uri);
  };

  const handlePhotoRemove = (key: string) => {
    onRemovePhoto(key);
  };

  return (
    <Card style={styles.container}> 
      <SectionLabel>Frente</SectionLabel>

      <View style={styles.photoRow}>
        <View style={styles.sideInfo}>
          <MeasurementRow 
            label="Data" 
            placeholder="__/__/____" 
            icon="calendar-outline" 
            value={assessmentData.frente_antes_data || ''} 
            onChangeText={(text) => handlePhotoSelect('frente_antes_data', text)} 
            textAlign="left"
          />
          <MeasurementRow 
            label="Peso" 
            placeholder="0,0 kg" 
            icon="barbell" 
            value={assessmentData.frente_antes_peso || ''} 
            onChangeText={(text) => handlePhotoSelect('frente_antes_peso', text)} 
            textAlign="left"
          />
          <MeasurementRow 
            label="Ombros" 
            placeholder="__ cm" 
            icon="body-outline"
            value={assessmentData.frente_antes_ombros || ''} 
            onChangeText={(text) => handlePhotoSelect('frente_antes_ombros', text)} 
            textAlign="left"
          />
          <MeasurementRow 
            label="Cintura" 
            placeholder="__ cm" 
            icon="move-outline"
            value={assessmentData.frente_antes_cintura || ''} 
            onChangeText={(text) => handlePhotoSelect('frente_antes_cintura', text)} 
            textAlign="left"
          />
        </View>

        <View style={styles.photoCol}>
          <Text style={[styles.photoLabel, { color: text2 }]}>Antes</Text>
          <PhotoSlot 
            uri={assessmentData.photo_frente_antes}
            onPhotoSelected={(uri) => handlePhotoSelect('photo_frente_antes', uri)}
            onRemove={() => handlePhotoRemove('photo_frente_antes')}
          />
        </View>

        <View style={styles.photoCol}>
          <Text style={[styles.photoLabel, { color: text2 }]}>Depois</Text>
          <PhotoSlot 
            uri={assessmentData.photo_frente_depois}
            onPhotoSelected={(uri) => handlePhotoSelect('photo_frente_depois', uri)}
            onRemove={() => handlePhotoRemove('photo_frente_depois')}
          />
        </View>

        <View style={[styles.sideInfo, styles.sideInfoRight]}>
          <MeasurementRow 
            label="Data" 
            placeholder="__/__/____" 
            icon="calendar-outline" 
            value={assessmentData.frente_depois_data || ''} 
            onChangeText={(text) => handlePhotoSelect('frente_depois_data', text)} 
            textAlign="right"
          />
          <MeasurementRow 
            label="Peso" 
            placeholder="0,0 kg" 
            icon="barbell" 
            value={assessmentData.frente_depois_peso || ''} 
            onChangeText={(text) => handlePhotoSelect('frente_depois_peso', text)} 
            textAlign="right"
          />
          <MeasurementRow 
            label="Ombros" 
            placeholder="__ cm" 
            icon="body-outline"
            value={assessmentData.frente_depois_ombros || ''} 
            onChangeText={(text) => handlePhotoSelect('frente_depois_ombros', text)} 
            textAlign="right"
          />
          <MeasurementRow 
            label="Cintura" 
            placeholder="__ cm" 
            icon="move-outline"
            value={assessmentData.frente_depois_cintura || ''} 
            onChangeText={(text) => handlePhotoSelect('frente_depois_cintura', text)} 
            textAlign="right"
          />
        </View>
      </View>

      <View style={styles.divider} />

      <SectionLabel>Costas</SectionLabel>

      <View style={styles.photoRow}>
        {/* Costas Antes */}
        <View style={styles.sideInfo}>
          <MeasurementRow 
            label="Data" 
            placeholder="__/__/____" 
            icon="calendar-outline" 
            value={assessmentData.costas_antes_data || ''} 
            onChangeText={(text) => handlePhotoSelect('costas_antes_data', text)} 
            textAlign="left"
          />
          <MeasurementRow 
            label="Peso" 
            placeholder="0,0 kg" 
            icon="barbell" 
            value={assessmentData.costas_antes_peso || ''} 
            onChangeText={(text) => handlePhotoSelect('costas_antes_peso', text)} 
            textAlign="left"
          />
          <MeasurementRow 
            label="Ombros" 
            placeholder="__ cm" 
            icon="body-outline"
            value={assessmentData.costas_antes_ombros || ''} 
            onChangeText={(text) => handlePhotoSelect('costas_antes_ombros', text)} 
            textAlign="left"
          />
          <MeasurementRow 
            label="Coxas" 
            placeholder="__ cm" 
            icon="move-outline"
            value={assessmentData.costas_antes_coxas || ''} 
            onChangeText={(text) => handlePhotoSelect('costas_antes_coxas', text)} 
            textAlign="left"
          />
        </View>

        <View style={styles.photoCol}>
          <Text style={[styles.photoLabel, { color: text2 }]}>Antes</Text>
          <PhotoSlot 
            uri={assessmentData.photo_costas_antes}
            onPhotoSelected={(uri) => handlePhotoSelect('photo_costas_antes', uri)}
            onRemove={() => handlePhotoRemove('photo_costas_antes')}
          />
        </View>

        <View style={styles.photoCol}>
          <Text style={[styles.photoLabel, { color: text2 }]}>Depois</Text>
          <PhotoSlot 
            uri={assessmentData.photo_costas_depois}
            onPhotoSelected={(uri) => handlePhotoSelect('photo_costas_depois', uri)}
            onRemove={() => handlePhotoRemove('photo_costas_depois')}
          />
        </View>

        <View style={[styles.sideInfo, styles.sideInfoRight]}>
          <MeasurementRow 
            label="Data" 
            placeholder="__/__/____" 
            icon="calendar-outline" 
            value={assessmentData.costas_depois_data || ''} 
            onChangeText={(text) => handlePhotoSelect('costas_depois_data', text)} 
            textAlign="right"
          />
          <MeasurementRow 
            label="Peso" 
            placeholder="0,0 kg" 
            icon="barbell" 
            value={assessmentData.costas_depois_peso || ''} 
            onChangeText={(text) => handlePhotoSelect('costas_depois_peso', text)} 
            textAlign="right"
          />
          <MeasurementRow 
            label="Ombros" 
            placeholder="__ cm" 
            icon="body-outline"
            value={assessmentData.costas_depois_ombros || ''} 
            onChangeText={(text) => handlePhotoSelect('costas_depois_ombros', text)} 
            textAlign="right"
          />
          <MeasurementRow 
            label="Coxas" 
            placeholder="__ cm" 
            icon="move-outline"
            value={assessmentData.costas_depois_coxas || ''} 
            onChangeText={(text) => handlePhotoSelect('costas_depois_coxas', text)} 
            textAlign="right"
          />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 0,
    borderRadius: 0,
    borderWidth: 0,
  },
  header: {
    textAlign: 'center', 
    paddingVertical: 12, 
    paddingHorizontal: 16, 
    borderBottomWidth: 1, 
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  headerText: {
    fontSize: 11, 
    fontWeight: '700', 
    letterSpacing: 1, 
    textTransform: 'uppercase',
  },
  headerTitle: {
    fontSize: 18, 
    fontWeight: '900', 
    letterSpacing: 3, 
    textTransform: 'uppercase',
  },
  photoRow: {
    flexDirection: 'row', 
    gap: 0, 
    padding: 16, 
    backgroundColor: '#181818', // bg2
  },
  sideInfo: {
    display: 'flex', 
    flexDirection: 'column', 
    gap: 10, 
    paddingHorizontal: 10, 
    width: 160, 
  },
  sideInfoRight: {
    alignItems: 'flex-end',
  },
  photoCol: {
    display: 'flex', 
    flexDirection: 'column', 
    gap: 8, 
    alignItems: 'center', 
    flex: 1, 
  },
  photoLabel: {
    fontSize: 11, 
    fontWeight: '700', 
    letterSpacing: 2, 
    textTransform: 'uppercase',
  },
  divider: { 
    height: 1, 
    backgroundColor: '#5a4010', // border-gold
    marginHorizontal: 0, 
  },
});
