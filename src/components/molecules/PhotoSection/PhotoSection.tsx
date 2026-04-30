import React from "react";
import { StyleSheet, View } from "react-native";

import { useThemeColor } from "../../../hooks/useThemeColor";
import { maskCm, maskDate, maskWeight } from "../../../utils/masks";
import {
  IconCintura,
  IconCoxa,
  IconTorso,
  Input,
  PhotoSlot,
  Text,
} from "../../atoms";
import { BodyPartIndicator } from "../BodyPartIndicator";
import { SectionLabel } from "../SectionLabel";

export type PhotoSectionProps = {
  onPhotoSelected: (key: string, uri: string) => void;
  onRemovePhoto: (key: string) => void;
  onFieldChange: (key: string, value: string) => void;
  assessmentData: any;
};

type SideInfoProps = {
  prefix: string;
  side: "left" | "right";
  assessmentData: any;
  onFieldChange: (key: string, value: string) => void;
  indicators: { label: string; icon: React.ReactNode }[];
};

function SideInfo({
  prefix,
  side,
  assessmentData,
  onFieldChange,
  indicators,
}: SideInfoProps) {
  const border = useThemeColor({}, "border");
  const isRight = side === "right";

  return (
    <View style={styles.sideInfo}>
      {/* Date - boxed field */}
      <View style={styles.fieldGroup}>
        <Text style={[styles.fieldLabel, isRight && styles.fieldLabelRight]}>
          Data
        </Text>
        <Input
          variant="boxed"
          placeholder="__/__/____"
          value={assessmentData[`${prefix}_date`] || ""}
          onChangeText={(v) => onFieldChange(`${prefix}_date`, maskDate(v))}
          keyboardType="numeric"
          style={[
            styles.fieldValue,
            { borderColor: border },
            isRight && { textAlign: "right" },
          ]}
          containerStyle={styles.fieldContainer}
        />
      </View>

      {/* Weight - boxed field */}
      <View style={styles.fieldGroup}>
        <Text style={[styles.fieldLabel, isRight && styles.fieldLabelRight]}>
          Peso
        </Text>
        <Input
          variant="boxed"
          placeholder="0,0 kg"
          value={assessmentData[`${prefix}_weight`] || ""}
          onChangeText={(v) => onFieldChange(`${prefix}_weight`, maskWeight(v))}
          keyboardType="numeric"
          style={[
            styles.fieldValue,
            { borderColor: border },
            isRight && { textAlign: "right" },
          ]}
          containerStyle={styles.fieldContainer}
        />
      </View>

      {/* Waist (Cintura) - boxed field */}
      <View style={styles.fieldGroup}>
        <Text style={[styles.fieldLabel, isRight && styles.fieldLabelRight]}>
          Cintura
        </Text>
        <Input
          variant="boxed"
          placeholder="0,0 cm"
          value={assessmentData[`${prefix}_cintura`] || ""}
          onChangeText={(v) => onFieldChange(`${prefix}_cintura`, maskCm(v))}
          keyboardType="numeric"
          style={[
            styles.fieldValue,
            { borderColor: border },
            isRight && { textAlign: "right" },
          ]}
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
  assessmentData,
}: PhotoSectionProps) {
  const text2 = useThemeColor({}, "text2");

  const frontIndicators = [
    { label: "Ombros", icon: <IconTorso size={48} /> },
    { label: "Coxa", icon: <IconCoxa size={48} /> },
  ];
  const backIndicators = [
    { label: "Ombros", icon: <IconTorso size={48} /> },
    { label: "Cintura", icon: <IconCintura size={48} /> },
  ];

  return (
    <View>
      <SectionLabel>Frente</SectionLabel>

      <View style={styles.photoRow}>
        <SideInfo
          prefix="front_before"
          side="left"
          assessmentData={assessmentData}
          onFieldChange={onFieldChange}
          indicators={frontIndicators}
        />

        <View style={styles.photoCol}>
          <Text style={[styles.photoLabel, { color: text2 }]}>Antes</Text>
          <PhotoSlot
            testID="photo-slot-front-before"
            uri={assessmentData.photo_front_before}
            onPhotoSelected={(uri) =>
              onPhotoSelected("photo_front_before", uri)
            }
            onRemove={() => onRemovePhoto("photo_front_before")}
          />
        </View>

        <View style={styles.photoCol}>
          <Text style={[styles.photoLabel, { color: text2 }]}>Depois</Text>
          <PhotoSlot
            testID="photo-slot-front-after"
            uri={assessmentData.photo_front_after}
            onPhotoSelected={(uri) => onPhotoSelected("photo_front_after", uri)}
            onRemove={() => onRemovePhoto("photo_front_after")}
          />
        </View>

        <SideInfo
          prefix="front_after"
          side="right"
          assessmentData={assessmentData}
          onFieldChange={onFieldChange}
          indicators={frontIndicators}
        />
      </View>

      <View style={styles.divider} />

      <SectionLabel>Costas</SectionLabel>

      <View style={styles.photoRow}>
        <SideInfo
          prefix="back_before"
          side="left"
          assessmentData={assessmentData}
          onFieldChange={onFieldChange}
          indicators={backIndicators}
        />

        <View style={styles.photoCol}>
          <Text style={[styles.photoLabel, { color: text2 }]}>Antes</Text>
          <PhotoSlot
            uri={assessmentData.photo_back_before}
            onPhotoSelected={(uri) => onPhotoSelected("photo_back_before", uri)}
            onRemove={() => onRemovePhoto("photo_back_before")}
          />
        </View>

        <View style={styles.photoCol}>
          <Text style={[styles.photoLabel, { color: text2 }]}>Depois</Text>
          <PhotoSlot
            uri={assessmentData.photo_back_after}
            onPhotoSelected={(uri) => onPhotoSelected("photo_back_after", uri)}
            onRemove={() => onRemovePhoto("photo_back_after")}
          />
        </View>

        <SideInfo
          prefix="back_after"
          side="right"
          assessmentData={assessmentData}
          onFieldChange={onFieldChange}
          indicators={backIndicators}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  photoRow: {
    flexDirection: "row",
    gap: 0,
    padding: 16,
    backgroundColor: "#181818",
  },
  sideInfo: {
    flexDirection: "column",
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
    flexDirection: "column",
    gap: 4,
    width: "100%",
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#6a5a40",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  fieldLabelRight: {
    textAlign: "right",
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
    flexDirection: "column",
    gap: 8,
    alignItems: "center",
    flex: 1,
    minWidth: 0,
  },
  photoLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  divider: {
    height: 1,
    backgroundColor: "#5a4010",
  },
});
