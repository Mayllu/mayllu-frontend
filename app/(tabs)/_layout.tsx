import { Tabs, useNavigation } from "expo-router";
import { Colors } from "@/constants";
import { BackButton, CustomTabBarIcon, ProfileButton } from "@/components";

const TabsLayout = () => {
  const navigation = useNavigation();
  return (
    <Tabs screenOptions={({route}) => ({
      tabBarStyle: {
        backgroundColor: 'transparent',
        elevation: 0,
        borderTopWidth: 0,
        padding: 0,
        paddingTop: 20,
        marginBottom: 20,
      },
      tabBarActiveTintColor: Colors.white_60,
      tabBarInactiveTintColor: Colors.white_40,
      tabBarShowLabel: false,
      headerTransparent: true,
      headerTitle: "",
      headerLeft: () => (
        <BackButton title={route.name.split('/')[0]} canGoBack={navigation.canGoBack()}/>
      ),
      headerRight: () => (<ProfileButton />),
    })}
    >
      <Tabs.Screen name="index" options={{ title: "Inicio", tabBarIcon: CustomTabBarIcon("home") }} />
      <Tabs.Screen name="ranking/index" options={{ title: "Ranking", tabBarIcon: CustomTabBarIcon("trophy") }} />
      <Tabs.Screen name="take-report/index" options={{ title: "Reportar", tabBarIcon: CustomTabBarIcon("camera", true) }} />
      <Tabs.Screen name="notifications/index" options={{ title: "Novedades", tabBarIcon: CustomTabBarIcon("notifications") }} />
      <Tabs.Screen name="profile/index" options={{ title: "Cuenta", tabBarIcon: CustomTabBarIcon("person") }} />
      <Tabs.Screen 
        name="complaint/[id]" 
        options={{ 
          href: null,
          tabBarStyle: { display: 'none' }
        }} 
      />
    </Tabs>
  );
}

export default TabsLayout;
