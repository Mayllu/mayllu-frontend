import * as SplashScreen from "expo-splash-screen";
import { View } from "react-native";
import { Slot } from "expo-router";
import { useCallback } from "react";
import { useFonts } from "expo-font";
import {
  Inter_300Light,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from "@expo-google-fonts/inter";
import { SessionProvider } from "@/context";
import "@/globals/css/global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_light: Inter_300Light,
    Inter_Regular: Inter_400Regular,
    Inter_SemiBold: Inter_600SemiBold,
    Inter_Bold: Inter_700Bold,
    Inter_ExtraBold: Inter_800ExtraBold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) await SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <SessionProvider>
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <Slot />
      </View>
    </SessionProvider>
  );
}
