import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants";

const HandleBack = () => {
  alert("Back button pressed");
};

export const BackButton = () => {
  return (
    <TouchableOpacity onPress={() => HandleBack()} style={{
      width: 40,
      height: 40,
      marginLeft: 20,
      marginTop: 10,
      backgroundColor: Colors.white_10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: Colors.white_40,
      alignItems: "center",
      justifyContent: "center",
    }}>
      <Ionicons name="chevron-back" size={20} color={Colors.white_50} />
    </TouchableOpacity>
  );
};
