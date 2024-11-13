import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import { ComplaintPointInterface } from "@/types";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants";
import { formatTimeAgo } from "@/utils";
import { ComplaintSkeleton } from "./ComplaintSkeleton";

const { width } = Dimensions.get("window");
const CARD_PADDING = 0;
const CARD_HEIGHT = 110;

interface RecentComplaintsProps {
  complaints: ComplaintPointInterface[];
  isLoading?: boolean;
}

export const RecentComplaints: React.FC<RecentComplaintsProps> = ({
  complaints,
  isLoading = false,
}) => {
  const renderItem = ({ item }: { item: ComplaintPointInterface }) => {
    return (
      <TouchableOpacity
        style={styles.complaintItem}
        onPress={() => router.push(`/complaint/${item._id}`)}
      >
        {/* container with image section */}
        <View style={styles.imageSection}>
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.thumbnailImage}
            resizeMode="cover"
          />
          <View
            style={[
              styles.categoryIcon,
              { backgroundColor: item.category.color || Colors.white_80 },
            ]}
          >
            <MaterialIcons
              name={item.category.icon || "alert-circle"}
              size={20}
              color={Colors.white_00}
            />
          </View>
        </View>

        {/* report content */}
        <View style={styles.contentContainer}>
          <Text style={styles.complaintTitle} numberOfLines={1}>
            {item.title}
          </Text>

          <View style={styles.locationContainer}>
            <MaterialIcons
              name="location-on"
              size={15}
              color={Colors.white_60}
            />
            <Text style={styles.locationText}>{item.district.name}</Text>
          </View>

          <View style={styles.timeContainer}>
            <MaterialIcons
              name="access-time"
              size={15}
              color={Colors.white_60}
            />
            <Text style={styles.timeText}>
              Hace {formatTimeAgo(item.createdAt)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  {
    /* skeleton if  is loading */
  }
  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.skeletonHeaderTitle} />
          <View style={styles.skeletonHeaderButton} />
        </View>
        <ComplaintSkeleton />
        <ComplaintSkeleton />
        <ComplaintSkeleton />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Reportes Recientes</Text>
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAll}>Ver todos</Text>
          <MaterialIcons
            name="arrow-forward"
            size={16}
            color={Colors.blue_60}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        data={complaints}
        renderItem={renderItem}
        keyExtractor={(item: any) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    paddingTop: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: CARD_PADDING,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Inter_SemiBold",
    color: Colors.white_80,
    marginTop: 10,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 10,
  },
  viewAll: {
    fontSize: 14,
    color: Colors.blue_60,
    fontFamily: "Inter_Regular",
  },
  listContent: {
    padding: CARD_PADDING,
  },
  complaintItem: {
    flexDirection: "row",
    backgroundColor: Colors.white_00,
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    height: CARD_HEIGHT,
    borderWidth: 1,
    borderColor: Colors.white_40,
  },
  imageSection: {
    width: CARD_HEIGHT,
    height: CARD_HEIGHT,
    position: "relative",
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
  },
  categoryIcon: {
    position: "absolute",
    top: 8,
    left: 8,
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  contentContainer: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
    gap: 4,
  },
  complaintTitle: {
    fontSize: 15,
    fontFamily: "Inter_SemiBold",
    color: Colors.white_80,
    marginBottom: 2,
  },
  locationContainer: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    fontSize: 13,
    color: Colors.white_60,
    fontFamily: "Inter_Regular",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  timeText: {
    fontSize: 13,
    color: Colors.white_60,
    fontFamily: "Inter_Regular",
  },
  skeletonHeaderTitle: {
    width: 180,
    height: 24,
    backgroundColor: Colors.white_10,
    borderRadius: 4,
  },
  skeletonHeaderButton: {
    width: 70,
    height: 20,
    backgroundColor: Colors.white_10,
    borderRadius: 4,
  },
});
