import { Tabs } from "expo-router";
import { Colors } from "@/constants";
import { BackButton, CustomTabBarIcon, ProfileButton } from "@/components";

const TabsLayout = () => {
  return (
    <Tabs screenOptions={{
      tabBarStyle: {
        backgroundColor: 'transparent',
        borderTopWidth: 0,
        padding: 0,
        marginBottom: 10,
      },
      tabBarActiveTintColor: Colors.white_60,
      tabBarInactiveTintColor: Colors.white_40,
      tabBarShowLabel: false,
      headerTransparent: true,
      headerTitle: "",
      headerLeft: () => (<BackButton />),
      headerRight: () => (<ProfileButton />),
    }}>
      <Tabs.Screen name="index" options={{ title: "Inicio", tabBarIcon: CustomTabBarIcon("home") }} />
      <Tabs.Screen name="ranking/index" options={{ title: "Ranking", tabBarIcon: CustomTabBarIcon("star") }} />
      <Tabs.Screen name="take-report/index" options={{ title: "Reportar", tabBarIcon: CustomTabBarIcon("camera", true) }} />
      <Tabs.Screen name="notifications/index" options={{ title: "Novedades", tabBarIcon: CustomTabBarIcon("notifications") }} />
      <Tabs.Screen name="profile/index" options={{ title: "Cuenta", tabBarIcon: CustomTabBarIcon("person") }} />
    </Tabs>
  );
}

export default TabsLayout;
