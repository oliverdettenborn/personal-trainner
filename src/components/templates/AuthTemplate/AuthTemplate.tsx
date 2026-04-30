import React from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";

import { useThemeColor } from "../../../hooks/useThemeColor";

export type AuthTemplateProps = {
  children: React.ReactNode;
  testID?: string;
};

export function AuthTemplate({ children, testID }: AuthTemplateProps) {
  const bg = useThemeColor({}, "background");

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: bg }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      testID={testID}
    >
      <View style={styles.inner}>{children}</View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: {
    flex: 1,
    justifyContent: "center",
    padding: 28,
    maxWidth: 400,
    width: "100%",
    alignSelf: "center",
  },
});
