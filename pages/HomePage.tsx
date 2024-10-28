import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { useHeaderHeight } from "@react-navigation/elements";
import { View } from "react-native";
import { CreatePageStyle } from "@/utils";
import { ComplaintMap } from "@/components";
import { ComplaintPointInterface } from "@/types";
import { RecentComplaints } from "@/components";
import { fetchComplaints } from "@/api/complaints";

const HomePage = () => {
  const headerHeight = useHeaderHeight();
  const pageStyle = CreatePageStyle(headerHeight);
  const [originLocation, setOriginLocation] = useState<Location.LocationObject | null>(null);
  const [complaints, setComplaints] = useState<ComplaintPointInterface[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const getPermissions = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync(); 
      if (status != 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      let currentOrigin = await Location.getCurrentPositionAsync({});
      setOriginLocation(currentOrigin);
      console.log("User location", currentOrigin);
    };

    const loadComplaints = async () => {
      setIsLoading(true);
      const complaintsData = await fetchComplaints();
      setComplaints(complaintsData);
      setIsLoading(false);
    };

    getPermissions();
    loadComplaints();
  }, [])

  return (
    <View style={[pageStyle.container, { flex: 1 }]}>
      <ComplaintMap 
        origin={originLocation}
        complaints={complaints}
      />
      <RecentComplaints 
        complaints={complaints}
        isLoading={isLoading}
      />
    </View>
  );
};

export default HomePage;

