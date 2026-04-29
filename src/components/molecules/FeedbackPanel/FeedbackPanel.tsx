import React from "react";
import { StyleSheet, View } from "react-native";
import { Path, Svg } from "react-native-svg";

import { useThemeColor } from "../../../hooks/useThemeColor";
import { Input, Text } from "../../atoms";

export type FeedbackItem = {
  value: string;
  placeholder?: string;
  onChangeText: (text: string) => void;
};

export type FeedbackPanelProps = {
  title: string;
  highlightedTitle?: string;
  svgPath: string;
  dotColor: "green" | "amber" | "red";
  items: FeedbackItem[];
};

export function FeedbackPanel({
  title,
  highlightedTitle,
  svgPath,
  dotColor,
  items,
}: FeedbackPanelProps) {
  const border = useThemeColor({}, "border");
  const gold = useThemeColor({}, "gold");

  const getColors = () => {
    switch (dotColor) {
      case "green":
        return { dot: "#3a8a3a", bg: "#1a3020", border: "#2a6040" };
      case "amber":
        return { dot: "#c08030", bg: "#302010", border: "#604020" };
      case "red":
        return { dot: "#a03030", bg: "#301010", border: "#602020" };
    }
  };

  const colors = getColors();

  return (
    <View style={[styles.container, { borderColor: border }]}>
      <View style={styles.header}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: colors.bg, borderColor: colors.border },
          ]}
        >
          <Svg width={12} height={12} viewBox="0 0 24 24" fill={colors.dot}>
            <Path d={svgPath} />
          </Svg>
        </View>
        <Text style={styles.title}>
          {title}{" "}
          {highlightedTitle && (
            <Text style={{ color: gold }}>{highlightedTitle}</Text>
          )}
        </Text>
      </View>

      <View style={styles.rows}>
        {items.map((item, index) => (
          <View key={index} style={styles.row}>
            <View style={[styles.dot, { backgroundColor: colors.dot }]} />
            <Input
              variant="minimal"
              placeholder={item.placeholder}
              value={item.value}
              onChangeText={item.onChangeText}
              style={[styles.input, { borderBottomColor: "#3a3020" }]}
              containerStyle={styles.inputContainer}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRightWidth: 1,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  iconContainer: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  rows: {
    gap: 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  input: {
    fontSize: 12,
  },
  inputContainer: {
    marginBottom: 0,
    flex: 1,
  },
});
