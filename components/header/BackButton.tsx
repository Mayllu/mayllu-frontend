import { FC } from "react";
import { useRouter } from "expo-router";
import { TouchableOpacity, StyleSheet, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants";

interface BackButtonPropsInterface {
  title: string;
  canGoBack: boolean;
}

interface RoutesESInterface {
  [key: string]: string;
}

const routesES: RoutesESInterface = {
  index: "Inicio",
  ranking: "Ranking",
  "take-report": "Reportar",
  notifications: "Notificaciones",
  profile: "Cuenta",
};

export const BackButton: FC<BackButtonPropsInterface> = ({
  title,
  canGoBack,
}) => {
  const router = useRouter();
  const titleES = routesES[title] || "Inicio";
  const handleBack = () => router.back();
  const isComplaintDetail = title === "Detalles";

  return (
    <TouchableOpacity
      onPress={handleBack}
      style={[
        styles.container,
        // Si es página de detalles, ajustar el margen
        isComplaintDetail && { marginLeft: 8 },
      ]}
    >
      {/* Siempre mostrar el icono en la página de detalles */}
      {(canGoBack || isComplaintDetail) && (
        <View style={styles.iconContainer}>
          <Ionicons name="chevron-back" size={20} color={Colors.white_50} />
        </View>
      )}
      {/* Mostrar título solo si no es página de detalles */}
      {!isComplaintDetail && <Text style={styles.title}>{titleES}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 20,
    marginTop: 10,
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: Colors.white_00,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.white_40,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginLeft: 10,
  },
  title: {
    color: Colors.white_60,
    fontFamily: "Inter_ExtraBold",
    fontSize: 24,
    textTransform: "capitalize",
  },
});
