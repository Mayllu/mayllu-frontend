import React from "react";
import { Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { Colors } from "@/constants";

const ProfileAvatar = () => (
  <Image
    source={{ uri: "https://avatars.githubusercontent.com/u/118573214?v=4" }}
    style={styles.avatar}
  />
);

export const ProfileButton = () => {
  const router = useRouter();
  const pathname = usePathname();

  const isProfilePath =
    pathname === "/profile" || pathname.startsWith("/profile/");

  const handlePress = () => {
    if (!isProfilePath) router.push("/profile");
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress}>
      {isProfilePath ? null : <ProfileAvatar />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginRight: 20,
    marginTop: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    backgroundColor: Colors.white_10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.white_40,
  },
  text: {
    color: Colors.white_50,
    fontSize: 12,
    marginTop: 5,
  },
});
