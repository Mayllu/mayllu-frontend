import React from "react";
import { View, StyleSheet } from "react-native";
import { Marker } from "react-native-maps";
import { router } from "expo-router";
import { Colors } from "@/constants";

interface CustomMapMarkerProps {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  description: string;
}

export const CustomMapMarker: React.FC<CustomMapMarkerProps> = ({
  id,
  latitude,
  longitude,
  title,
  description,
}) => {
  const handlePress = () => {
    router.push({
      pathname: "/complaint/[id]",
      params: { id },
    });
  };

  return (
    <Marker
      coordinate={{
        latitude,
        longitude,
      }}
      onPress={handlePress}
      title={title}
      description={description}
    >
      <View style={styles.markerContainer}>
        <View style={styles.marker} />
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: "center",
  },
  marker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.white_00,
    borderWidth: 3,
    borderColor: Colors.red_60,
  },
});
