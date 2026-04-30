import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";

import { useThemeColor } from "../../../hooks/useThemeColor";
import { Text } from "../Text";

export type PhotoSlotProps = {
  uri?: string;
  label?: string;
  onPhotoSelected: (uri: string) => void;
  onRemove?: () => void;
  nativeID?: string;
};

export function PhotoSlot({
  uri,
  label,
  onPhotoSelected,
  onRemove,
  nativeID,
}: PhotoSlotProps) {
  const bgTertiary = useThemeColor({}, "backgroundTertiary");
  const borderGold = useThemeColor({}, "borderGold");
  const text3 = "#6a5a40"; // text3 from HTML

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      if (asset.base64) {
        onPhotoSelected(`data:image/jpeg;base64,${asset.base64}`);
      } else {
        onPhotoSelected(asset.uri);
      }
    }
  };

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Pressable
        onPress={pickImage}
        nativeID={nativeID}
        style={[
          styles.slot,
          { backgroundColor: bgTertiary, borderColor: borderGold },
        ]}
      >
        {uri ? (
          <>
            <Image source={{ uri }} style={styles.image} testID="photo-image" />
            <TouchableOpacity
              style={styles.removeBtn}
              testID="remove-photo-btn"
              onPress={(e) => {
                e?.stopPropagation();
                onRemove?.();
              }}
            >
              <Text style={styles.removeText}>✕ remover</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="image-outline" size={24} color={text3} />
            <Text style={[styles.placeholderText, { color: text3 }]}>
              Clique para adicionar foto
            </Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    alignItems: "center",
    gap: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    color: "#a89878", // text2
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  slot: {
    width: "100%",
    aspectRatio: 3 / 4,
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 6,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  placeholder: {
    alignItems: "center",
    gap: 6,
  },
  placeholderText: {
    fontSize: 10,
    textAlign: "center",
  },
  removeBtn: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#555",
  },
  removeText: {
    color: "#ccc",
    fontSize: 10,
  },
});
