import { FC } from "react";
import { TouchableOpacity, StyleSheet, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants";
import { useRouter } from "expo-router";

interface BackButtonPropsInterface {
  title: string;
  canGoBack: boolean;
};

interface RoutesESInterface {
  [key: string]: string;
};

const routesES: RoutesESInterface = {
  "index": "Inicio",
  "ranking": "Ranking",
  "take-report": "Reportar",
  "notifications": "Notificaciones",
  "profile": "Cuenta",
};

export const BackButton: FC<BackButtonPropsInterface> = ({title, canGoBack}) => {
  const router = useRouter();
  const titleES = routesES[title] || "Inicio";

  const handleBack = () => {
    if (canGoBack) router.back();
  };

  return (
    <TouchableOpacity onPress={handleBack} style={styles.container}>
      { !canGoBack ? null : (
        <View style={styles.iconContainer}>
          <Ionicons name="chevron-back" size={20} color={Colors.white_50} />
        </View>
      )}
      <Text style={styles.title}>{titleES}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginTop: 10,
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: Colors.white_10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.white_40,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 20,
  },
  title: {
    color: Colors.white_60,
    fontFamily: "PlusJS_ExtraBold",
    fontSize: 24,
    textTransform: 'capitalize',
  },
});

