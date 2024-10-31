import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const CARD_PADDING = 12;
const CARD_WIDTH = width - CARD_PADDING * 2;

export const ComplaintSkeleton = () => (
  <View style={styles.skeletonCard}>
    <View style={styles.skeletonImage} />
    <View style={styles.skeletonContent}>
      <View style={styles.skeletonTitle} />
      <View style={styles.skeletonDesc} />
      <View style={styles.skeletonDesc} />
      <View style={styles.skeletonLocation} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  skeletonCard: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    marginBottom: 8,
    overflow: "hidden",
  },
  skeletonImage: {
    width: CARD_WIDTH,
    height: 160,
    backgroundColor: "#f0f0f0",
  },
  skeletonContent: {
    padding: 16,
  },
  skeletonTitle: {
    height: 20,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    marginBottom: 8,
    width: "60%",
  },
  skeletonDesc: {
    height: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    marginBottom: 8,
    width: "100%",
  },
  skeletonLocation: {
    height: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    width: "30%",
    marginTop: 4,
  },
});
