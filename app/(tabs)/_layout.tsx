import { Tabs, useNavigation, Redirect } from "expo-router";
import { Colors } from "@/constants";
import { BackButton, CustomTabBarIcon, ProfileButton } from "@/components";
import { useSession } from "@/context";

const TabsLayout = () => {
  const navigation = useNavigation();
  const { session, isLoading } = useSession();

  // check if user is authenticated in each tab
  if (isLoading) return null;
  if (!session) return <Redirect href="/auth/login" />;

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: "transparent",
          elevation: 0,
          borderTopWidth: 1,
          borderTopColor: Colors.white_40,
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
          <BackButton
            title={
              route.name === "complaint/[id]"
                ? "Detalles"
                : route.name.split("/")[0]
            }
            canGoBack={navigation.canGoBack()}
          />
        ),
        headerRight: () => <ProfileButton />,
      })}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Inicio", tabBarIcon: CustomTabBarIcon("home") }}
      />
      <Tabs.Screen
        name="ranking/index"
        options={{ title: "Ranking", tabBarIcon: CustomTabBarIcon("trophy") }}
      />
      <Tabs.Screen
        name="take-report/index"
        options={{
          title: "Reportar",
          tabBarIcon: CustomTabBarIcon("camera", true),
        }}
      />
      <Tabs.Screen
        name="notifications/index"
        options={{
          title: "Novedades",
          tabBarIcon: CustomTabBarIcon("notifications"),
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{ title: "Cuenta", tabBarIcon: CustomTabBarIcon("person") }}
      />
      <Tabs.Screen
        name="complaint/[id]"
        options={{
          href: null,
          headerShown: true,
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
