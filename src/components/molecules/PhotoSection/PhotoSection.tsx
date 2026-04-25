import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Path, Svg } from 'react-native-svg';
import { useThemeColor } from '../../../hooks/useThemeColor';
import { maskDate, maskWeight } from '../../../utils/masks';
import { Input, PhotoSlot, Text } from '../../atoms';
import { MeasurementRow } from '../MeasurementRow';
import { SectionLabel } from '../SectionLabel';

export type PhotoSectionProps = {
  onPhotoSelected: (key: string, uri: string) => void;
  onRemovePhoto: (key: string) => void;
  onFieldChange: (key: string, value: string) => void;
  assessmentData: any; 
};

// SVG icon paths from HTML
const ICON_LOCATION = "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z";
const ICON_CALENDAR = "M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z";

function SvgIcon({ d, size = 14, color = '#C9963A' }: { d: string; size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d={d} />
    </Svg>
  );
}

type SideInfoProps = {
  prefix: string;
  side: 'left' | 'right';
  assessmentData: any;
  onFieldChange: (key: string, value: string) => void;
  measures: { label: string; field: string; iconPath: string }[];
};

function SideInfo({ prefix, side, assessmentData, onFieldChange, measures }: SideInfoProps) {
  const bg3 = useThemeColor({}, 'backgroundTertiary');
  const border = useThemeColor({}, 'border');
  const borderGold = useThemeColor({}, 'borderGold');
  const text = useThemeColor({}, 'text');
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

      {/* Measurement rows with SVG icons */}
      {measures.map(m => (
        <MeasurementRow
          key={m.field}
          label={m.label}
          placeholder="__ cm"
          svgPath={m.iconPath}
          value={assessmentData[`${prefix}_${m.field}`] || ''}
          onChangeText={(v) => onFieldChange(`${prefix}_${m.field}`, v)}
          textAlign={side}
        />
      ))}
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

  const frenteMeasures = [
    { label: 'Ombros', field: 'ombros', iconPath: ICON_LOCATION },
    { label: 'Cintura', field: 'cintura', iconPath: ICON_CALENDAR },
  ];
  const costasMeasures = [
    { label: 'Ombros', field: 'ombros', iconPath: ICON_LOCATION },
    { label: 'Coxas', field: 'coxas', iconPath: ICON_LOCATION },
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
          measures={frenteMeasures}
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
          measures={frenteMeasures}
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
          measures={costasMeasures}
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
          measures={costasMeasures}
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
    paddingHorizontal: 10,
    width: 160,
    flexShrink: 0,
    flexGrow: 0,
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
