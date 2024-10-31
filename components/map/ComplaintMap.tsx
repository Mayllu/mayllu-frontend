import * as Location from "expo-location";
import React, { useRef, useEffect } from "react";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { Platform, StyleSheet, View } from "react-native";
import { ComplaintPointInterface } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { customMapStyle } from "@/utils";

interface ComplaintMapInterfaceProps {
  origin: Location.LocationObject | null;
  complaints: ComplaintPointInterface[];
}

export const ComplaintMap: React.FC<ComplaintMapInterfaceProps> = ({
  origin,
  complaints,
}) => {
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (origin && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: origin.coords.latitude,
          longitude: origin.coords.longitude,
          latitudeDelta: 0.01, // Mucho más zoom
          longitudeDelta: 0.01,
        },
        1000
      );
    }
  }, [origin]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={Platform.select({
          android: PROVIDER_GOOGLE,
          ios: undefined,
        })}
        initialRegion={{
          latitude: -12.0630149,
          longitude: -77.0296179,
          latitudeDelta: 0.003,
          longitudeDelta: 0.003,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
        mapPadding={{ top: 0, right: 0, bottom: 0, left: 0 }}
        customMapStyle={customMapStyle}
      >
        {complaints.map((complaint, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: complaint.ubication.x,
              longitude: complaint.ubication.y,
            }}
            onPress={() =>
              router.push({
                pathname: "/complaint/[id]",
                params: { id: complaint.id.toString() },
              })
            }
          >
            <View style={styles.markerContainer}>
              <View style={styles.markerIcon}>
                <Ionicons name="warning" size={18} color="#FFFFFF" />
              </View>
              <View style={styles.markerTriangle} />
            </View>
          </Marker>
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "40%", // Reducimos altura para dejar espacio a las publicaciones
  },
  map: {
    width: "100%",
    height: "100%",
  },
  markerContainer: {
    alignItems: "center",
  },
  markerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FF4B4B",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  markerTriangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 12,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#FF4B4B",
    marginTop: -2,
  },
});
