import * as Location from "expo-location";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { useEffect, useState } from "react";
import { useHeaderHeight } from "@react-navigation/elements";
import { View } from "react-native";
import { CreatePageStyle } from "@/utils";
import { ComplaintMap } from "@/components";
import { ComplaintPointInterface } from "@/types";
import { RecentComplaints } from "@/components";
import { complaintsApi } from "@/api/complaints";

const HomePage = () => {
  const headerHeight = useHeaderHeight();
  const pageStyle = CreatePageStyle(headerHeight);
  const [originLocation, setOriginLocation] =
    useState<Location.LocationObject | null>(null);
  const [complaints, setComplaints] = useState<ComplaintPointInterface[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadComplaints = async () => {
    setIsLoading(true);
    try {
      const complaintsData = await complaintsApi.getAll();
      setComplaints(complaintsData);
    } catch (error) {
      console.error("Error loading complaints xd", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const getPermissions = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          alert("No se proporcionó acceso a la ubicación");
          return;
        }
        let currentOrigin = await Location.getCurrentPositionAsync({});
        setOriginLocation(currentOrigin);
      } catch (error) {
        console.error("Error obteniendo la ubicación:", error);
      }
    };

    getPermissions();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadComplaints();

      const updateLocation = async () => {
        try {
          let currentOrigin = await Location.getCurrentPositionAsync({});
          setOriginLocation(currentOrigin);
        } catch (error) {
          console.error("Error updating location:", error);
        }
      };

      updateLocation();
    }, [])
  );

  return (
    <View style={[pageStyle.container, { flex: 1 }]}>
      <ComplaintMap origin={originLocation} complaints={complaints} />
      <RecentComplaints complaints={complaints} isLoading={isLoading} />
    </View>
  );
};

export default HomePage;
