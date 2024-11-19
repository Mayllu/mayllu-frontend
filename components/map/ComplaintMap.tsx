import * as Location from "expo-location";
import React, { useRef, useEffect, useState } from "react";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import {
  StyleSheet,
  View,
  Text,
  Modal,
  FlatList,
  TouchableOpacity,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ComplaintPointInterface } from "@/types";
import { customMapStyle } from "@/utils";
import { Colors } from "@/constants";

interface LocationGroup {
  key: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  complaints: ComplaintPointInterface[];
}

export const ComplaintMap: React.FC<ComplaintMapInterfaceProps> = ({
  origin,
  complaints,
}) => {
  const mapRef = useRef<MapView>(null);
  const [groupedComplaints, setGroupedComplaints] = useState<LocationGroup[]>(
    []
  );
  const [selectedGroup, setSelectedGroup] = useState<LocationGroup | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);

  const parseLocation = (ubicationString: string) => {
    try {
      const coords = ubicationString
        .replace("(", "")
        .replace(")", "")
        .split(",")
        .map((coord) => parseFloat(coord.trim()));

      if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
        return {
          latitude: coords[0],
          longitude: coords[1],
        };
      }
      return null;
    } catch (error) {
      console.error("Error parsing location:", error);
      return null;
    }
  };

  const groupComplaintsByLocation = () => {
    const groups: { [key: string]: LocationGroup } = {};

    complaints.forEach((complaint) => {
      const location = parseLocation(complaint.ubication);
      if (!location) return;

      const key = `${location.latitude},${location.longitude}`;

      if (!groups[key]) {
        groups[key] = {
          key,
          coordinate: location,
          complaints: [],
        };
      }
      groups[key].complaints.push(complaint);
    });

    setGroupedComplaints(Object.values(groups));
  };

  useEffect(() => {
    if (origin && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: origin.coords.latitude,
          longitude: origin.coords.longitude,
          latitudeDelta: 0.0,
          longitudeDelta: 0.006,
        },
        1000
      );
    }
  }, [origin]);

  useEffect(() => {
    groupComplaintsByLocation();
  }, [complaints]);

  const handleMarkerPress = (group: LocationGroup) => {
    if (group.complaints.length === 1) {
      router.push(`/complaint/${group.complaints[0]._id}`); // Corrección aquí
    } else {
      setSelectedGroup(group);
      setShowModal(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapWrapper}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: -12.0630149,
            longitude: -77.0296179,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
          showsUserLocation={true}
          showsMyLocationButton={false}
          showsBuildings={false}
          showsTraffic={false}
          showsIndoors={false}
          pitchEnabled={false}
          scrollEnabled={true}
          rotateEnabled={false}
          mapPadding={{ top: 0, right: 0, bottom: 0, left: 0 }}
          customMapStyle={customMapStyle}
          toolbarEnabled={false} // Añadir esta línea
          moveOnMarkerPress={false} // Añadir esta línea
          liteMode={false} // Añadir esta línea
          loadingEnabled={true} // Añadir esta línea
          loadingBackgroundColor={Colors.white_10} // Añadir esta línea
        >
          {groupedComplaints.map((group) => (
            <Marker
              key={group.key}
              coordinate={group.coordinate}
              onPress={() => handleMarkerPress(group)}
            >
              <View style={styles.markerContainer}>
                <View
                  style={[
                    styles.markerIcon,
                    {
                      backgroundColor:
                        group.complaints[0].category.color || Colors.blue_60,
                    },
                  ]}
                >
                  <MaterialIcons
                    name={
                      (group.complaints[0].category.icon as any) || "warning"
                    }
                    size={20} // Ajustado para el nuevo tamaño
                    color="#FFFFFF"
                  />
                  {group.complaints.length > 1 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>
                        {group.complaints.length}
                      </Text>
                    </View>
                  )}
                </View>
                <View
                  style={[
                    styles.markerTriangle,
                    {
                      borderTopColor:
                        group.complaints[0].category.color || Colors.blue_60,
                    },
                  ]}
                />
              </View>
            </Marker>
          ))}
        </MapView>
        <TouchableOpacity
          style={styles.locationButton}
          onPress={() => {
            if (origin && mapRef.current) {
              mapRef.current.animateToRegion(
                {
                  latitude: origin.coords.latitude,
                  longitude: origin.coords.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                },
                1000
              );
            }
          }}
        >
          <View style={styles.locationButtonInner}>
            <MaterialIcons
              name="my-location"
              size={22}
              color={Colors.blue_60}
            />
          </View>
        </TouchableOpacity>
      </View>

      {/* Modal para mostrar múltiples reportes en la misma ubicación */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedGroup?.complaints.length} reportes en esta ubicación
              </Text>
              <TouchableOpacity
                onPress={() => setShowModal(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <MaterialIcons name="close" size={24} color={Colors.grey} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={selectedGroup?.complaints}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContainer}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.complaintItem}
                  onPress={() => {
                    setShowModal(false);
                    router.push(`/complaint/${item._id}`);
                  }}
                >
                  <View style={styles.complaintContent}>
                    <View style={styles.complaintIconContainer}>
                      <MaterialIcons
                        name={(item.category.icon as any) || "warning"}
                        size={24}
                        color={item.category.color || Colors.blue_60}
                      />
                    </View>
                    <View style={styles.complaintInfo}>
                      <Text style={styles.complaintTitle} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <View style={styles.complaintMeta}>
                        <MaterialIcons
                          name="location-on"
                          size={14}
                          color={Colors.grey}
                        />
                        <Text style={styles.metaText}>
                          {item.location || "San Isidro"}
                        </Text>
                        <View style={styles.timeMeta}>
                          <MaterialIcons
                            name="access-time"
                            size={14}
                            color={Colors.grey}
                          />
                          <Text style={styles.metaText}>Hace 3 días</Text>
                        </View>
                      </View>
                    </View>
                    <MaterialIcons
                      name="chevron-right"
                      size={24}
                      color={Colors.grey}
                      style={styles.chevron}
                    />
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: Colors.white_00,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.white_40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.white_70,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  separator: {
    height: 8,
  },
  complaintItem: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    marginVertical: 4,
  },
  complaintContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  complaintIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white_40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  complaintInfo: {
    flex: 1,
    marginRight: 8,
  },
  complaintTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.black,
    marginBottom: 4,
  },
  complaintMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
  },
  metaText: {
    fontSize: 12,
    color: Colors.grey,
    marginLeft: 4,
  },
  chevron: {
    marginLeft: 8,
  },
  container: {
    height: "40%",
  },
  mapWrapper: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.white_40,
    position: "relative", // Asegura que el botón se posicione correctamente
  },
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
  },
  map: {
    width: "100%",
    height: "120%", // Esto es crucial para ocultar el logo
    marginBottom: -50, // Esto también es crucial
  },
  markerContainer: {
    alignItems: "center",
    position: "relative", // Asegura que el posicionamiento sea relativo al contenedor
  },
  markerIcon: {
    width: 40, // Incrementado ligeramente para acomodar el badge
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: "relative", // Para el posicionamiento del badge
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#ff3030",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FFFFFF",
    paddingHorizontal: 2,
    transform: [{ translateX: 2 }, { translateY: -2 }], // Ajuste fino de la posición
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
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
    marginTop: -2,
  },
  closeButton: {
    padding: 4,
  },
  complaintItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  locationButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.white_00,
    justifyContent: "center",
    alignItems: "center",
  },
  locationButtonInner: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.white_40,
  },
});
