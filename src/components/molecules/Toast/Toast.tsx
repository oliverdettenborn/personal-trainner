import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

import { ToastState } from "../../../hooks/useToast";
import { Text } from "../../atoms";

export type ToastProps = {
  toast: ToastState;
  onHide?: () => void;
  testID?: string;
};

export function Toast({ toast, onHide, testID }: ToastProps) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (toast.visible) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [toast.visible, opacity]);

  if (!toast.visible && !toast.message) return null;

  const bgColor = toast.type === "success" ? "#1a3020" : "#301010";
  const borderColor = toast.type === "success" ? "#2a6040" : "#602020";
  const dotColor = toast.type === "success" ? "#3a8a3a" : "#d32f2f";

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity, backgroundColor: bgColor, borderColor },
      ]}
      testID={testID}
    >
      <View style={[styles.dot, { backgroundColor: dotColor }]} />
      <Text style={styles.message}>{toast.message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 40,
    left: "50%",
    transform: [{ translateX: -150 }],
    width: 300,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    zIndex: 9999,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  message: {
    fontSize: 13,
    flex: 1,
  },
});
