import { View } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

const customTabBarIcon = (name: keyof typeof Ionicons.glyphMap, middleBtn?: boolean) => ({ color }: { color: string }) => {
  return (
    <View style={{
      backgroundColor: middleBtn ? Colors.pr_blue_1 : 'transparent',
      paddingHorizontal: middleBtn ? 16 : 0,
      paddingVertical: middleBtn ? 12 : 0,
      borderRadius: middleBtn ? 8 : 0,
      height: middleBtn ? 50 : 'auto',
    }}>
      <Ionicons name={name} size={24} color={ middleBtn ? Colors.pr_white_1 :  color}/>
    </View>
  );
};

const TabsLayout = () => {
  return (
    <Tabs screenOptions={{
      tabBarStyle: {
        backgroundColor: Colors.pr_gray_2,
        borderTopWidth: 0,
        padding: 0,
      },
      tabBarActiveTintColor: Colors.pr_gray_7,
      tabBarInactiveTintColor: Colors.pr_gray_5,
      tabBarShowLabel: false,
    }}>
      <Tabs.Screen name="index" options={{ title: "Inicio", tabBarIcon: customTabBarIcon("home") }} />
      <Tabs.Screen name="ranking/index" options={{ title: "Ranking", tabBarIcon: customTabBarIcon("star") }} />
      <Tabs.Screen name="take-report/index" options={{ title: "Reportar", tabBarIcon: customTabBarIcon("camera", true) }} />
      <Tabs.Screen name="notifications/index" options={{ title: "Novedades", tabBarIcon: customTabBarIcon("notifications") }} />
      <Tabs.Screen name="profile/index" options={{ title: "Cuenta", tabBarIcon: customTabBarIcon("person") }} />
    </Tabs>
  );
}

export default TabsLayout;
