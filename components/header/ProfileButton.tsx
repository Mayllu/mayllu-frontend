import { Colors } from "@/constants";
import { Image, TouchableOpacity } from "react-native";

export const ProfileButton = () => {
  return (
    <TouchableOpacity style={{
      marginRight: 20,
      marginTop: 10,
    }}>
      <Image source={{ uri: "https://xsgames.co/randomusers/avatar.php?g=male" }} style={{
        width: 40,
        height: 40,
        backgroundColor: Colors.white_10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.white_40,
      }}/>
    </TouchableOpacity>
  );
};
