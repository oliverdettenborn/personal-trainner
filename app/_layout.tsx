import { useAuth } from "@hooks/useAuth";
import { Slot, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { session, loading, needsPasswordSet } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (!loading) SplashScreen.hideAsync();
  }, [loading]);

  useEffect(() => {
    if (loading) return;
    const onLogin = segments[0] === "login";
    const onSetPassword = segments[0] === "set-password";

    if (session && needsPasswordSet && !onSetPassword) {
      router.replace("/set-password");
      return;
    }
    if (session && !needsPasswordSet && onSetPassword) {
      router.replace("/");
      return;
    }
    if (!session && !onLogin && !needsPasswordSet) router.replace("/login");
    if (session && onLogin) router.replace("/");
  }, [session, loading, needsPasswordSet, segments]);

  return <Slot />;
}
