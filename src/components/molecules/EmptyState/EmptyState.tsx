import React from "react";
import { StyleSheet, View } from "react-native";
import { Path, Svg } from "react-native-svg";

import { Text } from "../../atoms/Text";

const SVG_INFO =
  "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z";

type Props = {
  message: string;
  testID?: string;
};

export function EmptyState({ message, testID }: Props) {
  return (
    <View style={styles.container} testID={testID}>
      <View style={{ opacity: 0.4 }}>
        <Svg width={48} height={48} viewBox="0 0 24 24" fill="#6a5a40">
          <Path d={SVG_INFO} />
        </Svg>
      </View>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 13,
    color: "#6a5a40",
    textAlign: "center",
  },
});
