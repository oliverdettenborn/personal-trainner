import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useThemeColor } from '../../../hooks/useThemeColor';
import { maskDate, maskWeight } from '../../../utils/masks';
import { IconCintura, IconCoxa, IconTorso, Input, PhotoSlot, Text } from '../../atoms';
import { BodyPartIndicator } from '../BodyPartIndicator';
import { SectionLabel } from '../SectionLabel';

export type PhotoSectionProps = {
  onPhotoSelected: (key: string, uri: string) => void;
  onRemovePhoto: (key: string) => void;
  onFieldChange: (key: string, value: string) => void;
  assessmentData: any; 
};

type SideInfoProps = {
  prefix: string;
  side: 'left' | 'right';
  assessmentData: any;
  onFieldChange: (key: string, value: string) => void;
  indicators: { label: string; icon: React.ReactNode }[];
};

function SideInfo({ prefix, side, assessmentData, onFieldChange, indicators }: SideInfoProps) {
  const border = useThemeColor({}, 'border');
  const isRight = side === 'right';

  return (
    <View style={styles.sideInfo}>
      {/* Data - boxed field */}
      <View style={styles.fieldGroup}>
        <Text style={[styles.fieldLabel, isRight && styles.fieldLabelRight]}>Data</Text>
        <Input
          variant="boxed"
          placeholder="__/__/____"
          value={assessmentData[`${prefix}_data`] || ''}
          onChangeText={(v) => onFieldChange(`${prefix}_data`, maskDate(v))}
          keyboardType="numeric"
          style={[styles.fieldValue, { borderColor: border }, isRight && { textAlign: 'right' }]}
          containerStyle={styles.fieldContainer}
        />
      </View>

      {/* Peso - boxed field */}
      <View style={styles.fieldGroup}>
        <Text style={[styles.fieldLabel, isRight && styles.fieldLabelRight]}>Peso</Text>
        <Input
          variant="boxed"
          placeholder="0,0 kg"
          value={assessmentData[`${prefix}_peso`] || ''}
          onChangeText={(v) => onFieldChange(`${prefix}_peso`, maskWeight(v))}
          keyboardType="numeric"
          style={[styles.fieldValue, { borderColor: border }, isRight && { textAlign: 'right' }]}
          containerStyle={styles.fieldContainer}
        />
      </View>

      {/* Body Part Indicators */}
      <View style={styles.indicatorsContainer}>
        {indicators.map((ind, index) => (
          <BodyPartIndicator
            key={index}
            label={ind.label}
            icon={ind.icon}
            side={side}
          />
        ))}
      </View>
    </View>
  );
}

export function PhotoSection({ 
  onPhotoSelected,
  onRemovePhoto,
  onFieldChange,
  assessmentData 
}: PhotoSectionProps) {
  const text2 = useThemeColor({}, 'text2');

  const frenteIndicators = [
    { label: 'Ombros', icon: <IconTorso size={48} /> },
    { label: 'Coxa', icon: <IconCoxa size={48} /> },
  ];
  const costasIndicators = [
    { label: 'Ombros', icon: <IconTorso size={48} /> },
    { label: 'Cintura', icon: <IconCintura size={48} /> },
  ];

  return (
    <View>
      <SectionLabel>Frente</SectionLabel>

      <View style={styles.photoRow}>
        <SideInfo
          prefix="frente_antes"
          side="left"
          assessmentData={assessmentData}
          onFieldChange={onFieldChange}
          indicators={frenteIndicators}
        />

        <View style={styles.photoCol}>
          <Text style={[styles.photoLabel, { color: text2 }]}>Antes</Text>
          <PhotoSlot 
            uri={assessmentData.photo_frente_antes}
            onPhotoSelected={(uri) => onPhotoSelected('photo_frente_antes', uri)}
            onRemove={() => onRemovePhoto('photo_frente_antes')}
          />
        </View>

        <View style={styles.photoCol}>
          <Text style={[styles.photoLabel, { color: text2 }]}>Depois</Text>
          <PhotoSlot 
            uri={assessmentData.photo_frente_depois}
            onPhotoSelected={(uri) => onPhotoSelected('photo_frente_depois', uri)}
            onRemove={() => onRemovePhoto('photo_frente_depois')}
          />
        </View>

        <SideInfo
          prefix="frente_depois"
          side="right"
          assessmentData={assessmentData}
          onFieldChange={onFieldChange}
          indicators={frenteIndicators}
        />
      </View>

      <View style={styles.divider} />

      <SectionLabel>Costas</SectionLabel>

      <View style={styles.photoRow}>
        <SideInfo
          prefix="costas_antes"
          side="left"
          assessmentData={assessmentData}
          onFieldChange={onFieldChange}
          indicators={costasIndicators}
        />

        <View style={styles.photoCol}>
          <Text style={[styles.photoLabel, { color: text2 }]}>Antes</Text>
          <PhotoSlot 
            uri={assessmentData.photo_costas_antes}
            onPhotoSelected={(uri) => onPhotoSelected('photo_costas_antes', uri)}
            onRemove={() => onRemovePhoto('photo_costas_antes')}
          />
        </View>

        <View style={styles.photoCol}>
          <Text style={[styles.photoLabel, { color: text2 }]}>Depois</Text>
          <PhotoSlot 
            uri={assessmentData.photo_costas_depois}
            onPhotoSelected={(uri) => onPhotoSelected('photo_costas_depois', uri)}
            onRemove={() => onRemovePhoto('photo_costas_depois')}
          />
        </View>

        <SideInfo
          prefix="costas_depois"
          side="right"
          assessmentData={assessmentData}
          onFieldChange={onFieldChange}
          indicators={costasIndicators}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  photoRow: {
    flexDirection: 'row',
    gap: 0,
    padding: 16,
    backgroundColor: '#181818',
  },
  sideInfo: {
    flexDirection: 'column',
    gap: 10,
    width: 160,
    flexShrink: 0,
    flexGrow: 0,
  },
  sideInfoLeft: {
    paddingLeft: 10,
    paddingRight: 0,
  },
  sideInfoRight: {
    paddingLeft: 0,
    paddingRight: 10,
  },
  fieldGroup: {
    flexDirection: 'column',
    gap: 4,
    width: '100%',
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6a5a40',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  fieldLabelRight: {
    textAlign: 'right',
  },
  fieldValue: {
    fontSize: 13,
  },
  fieldContainer: {
    marginBottom: 0,
  },
  indicatorsContainer: {
    marginTop: 10,
    gap: 4,
  },
  photoCol: {
    flexDirection: 'column',
    gap: 8,
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  photoLabel: {
    fontSize: 11, 
    fontWeight: '700', 
    letterSpacing: 2, 
    textTransform: 'uppercase',
  },
  divider: { 
    height: 1, 
    backgroundColor: '#5a4010',
  },
});
