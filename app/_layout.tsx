import * as SplashScreen from "expo-splash-screen";
import { View } from "react-native";
import { Stack } from "expo-router";
import { PlusJakartaSans_300Light, PlusJakartaSans_400Regular, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold, PlusJakartaSans_800ExtraBold } from "@expo-google-fonts/plus-jakarta-sans";
import { useFonts } from "expo-font";
import { useCallback } from "react";
import "@/globals/css/global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "PlusJS_Light": PlusJakartaSans_300Light,
    "PlusJS_Regular": PlusJakartaSans_400Regular,
    "PlusJS_SemiBold": PlusJakartaSans_600SemiBold,
    "PlusJS_Bold": PlusJakartaSans_700Bold,
    "PlusJS_ExtraBold": PlusJakartaSans_800ExtraBold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) await SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
};
