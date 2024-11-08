import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import { ComplaintPointInterface } from "@/types";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ComplaintSkeleton } from "./ComplaintSkeleton";
import { Colors } from "@/constants";

const { width } = Dimensions.get("window");
const CARD_PADDING = 0;
const CARD_MARGIN = 8;
const CARD_WIDTH = width - CARD_PADDING * 2;

interface RecentComplaintsProps {
  complaints: ComplaintPointInterface[];
  isLoading?: boolean;
}

const getCategoryIcon = (categoryId: number) => {
  switch (categoryId) {
    case 1:
      return "construct";
    case 2:
      return "car";
    case 3:
      return "warning";
    case 4:
      return "people";
    default:
      return "alert-circle";
  }
};

const getCategoryColor = (categoryId: number) => {
  switch (categoryId) {
    case 1:
      return "#FF4B4B";
    case 2:
      return "#4B7BFF";
    case 3:
      return "#FFB74B";
    case 4:
      return "#4BFF4B";
    default:
      return "#808080";
  }
};

export const RecentComplaints: React.FC<RecentComplaintsProps> = ({
  complaints,
  isLoading = false,
}) => {
  const renderItem = ({ item }: { item: ComplaintPointInterface }) => (
    <TouchableOpacity
      style={styles.complaintItem}
      onPress={() =>
        router.push({
          pathname: "/complaint/[id]",
          params: { id: item.id },
        })
      }
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.imageUrl}}
          style={styles.image}
          resizeMode="cover"
        />
        <View
          style={[
            styles.categoryBadge,
            { backgroundColor: getCategoryColor(item.category.id) },
          ]}
        >
          <Ionicons
            name={getCategoryIcon(item.category.id)}
            size={16}
            color="white"
          />
        </View>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.complaintTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.complaintDesc} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.footer}>
          <Ionicons name="location" size={14} color="#666" />
          <Text style={styles.location}>{item.district.name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

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
        <Text style={styles.sectionTitle}>Últimas Publicaciones</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>Ver todas</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={complaints}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
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
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: "PlusJS_ExtraBold",
    fontSize: 20,
    fontWeight: "600",
    marginVertical: 10,
    color: Colors.white_80,
  },
  viewAll: {
    fontSize: 14,
    color: Colors.blue_60,
    fontFamily: "PlusJS_SemiBold",
  },
  listContent: {
    padding: CARD_PADDING,
  },
  complaintItem: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    marginBottom: CARD_MARGIN,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  imageContainer: {
    width: CARD_WIDTH,
    height: 160,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  categoryBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    padding: 8,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    padding: 16,
  },
  complaintTitle: {
    fontSize: 16,
    fontFamily: "PlusJS_SemiBold",
    marginBottom: 4,
  },
  complaintDesc: {
    fontSize: 14,
    color: "#666",
    fontFamily: "PlusJS_Regular",
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
  },
  location: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
    fontFamily: "PlusJS_Regular",
  },
  skeletonHeaderTitle: {
    width: 180,
    height: 24,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
  },
  skeletonHeaderButton: {
    width: 70,
    height: 20,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
  },
});
