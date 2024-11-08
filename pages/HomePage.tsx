import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { useHeaderHeight } from "@react-navigation/elements";
import { View } from "react-native";
import { CreatePageStyle } from "@/utils";
import { ComplaintMap } from "@/components";
import { ComplaintPointInterface } from "@/types";
import { RecentComplaints } from "@/components";
import { complaintsApi } from '@/api/complaints';

const HomePage = () => {
  const headerHeight = useHeaderHeight();
  const pageStyle = CreatePageStyle(headerHeight);
  const [originLocation, setOriginLocation] = useState<Location.LocationObject | null>(null);
  const [complaints, setComplaints] = useState<ComplaintPointInterface[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadComplaints = async () => {
    setIsLoading(true);
    try {
      const complaintsData = await complaintsApi.getAll();
      setComplaints(complaintsData);
    } catch (error) {
      console.error("Error loading complaints:", error);
      // Aquí podrías manejar el error, por ejemplo mostrar un mensaje al usuario
    } finally {
      setIsLoading(false);
    }
  };

  // Obtener permisos de ubicación solo una vez al montar el componente
  useEffect(() => {
    const getPermissions = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          alert("Permission to access location was denied");
          return;
        }
        let currentOrigin = await Location.getCurrentPositionAsync({});
        setOriginLocation(currentOrigin);
      } catch (error) {
        console.error("Error getting location:", error);
      }
    };

    getPermissions();
  }, []);

  // Cargar quejas cada vez que la pantalla recibe el foco
  useFocusEffect(
    useCallback(() => {
      loadComplaints();
      
      // Opcional: actualizar la ubicación cada vez que se enfoca la pantalla
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