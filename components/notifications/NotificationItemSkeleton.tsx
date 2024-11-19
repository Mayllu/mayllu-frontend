import { Colors } from "@/constants";
import React from "react";
import { View, StyleSheet } from "react-native";

export const NotificationSkeletonItem = () => (
  <View style={styles.skeletonItem}>
    <View style={styles.skeletonIcon} />
    <View style={styles.skeletonLines}>
      <View style={styles.skeletonLine} />
      <View style={[styles.skeletonLine]} />
      <View style={[styles.skeletonLineTime]} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  skeletonItem: {
    flexDirection: "row",
    paddingVertical: 16,
    marginBottom: 10,
  },
  skeletonIcon: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: Colors.white_20,
  },
  skeletonLines: {
    flex: 1,
    marginLeft: 16,
  },
  skeletonLine: {
    height: 16,
    backgroundColor: Colors.white_20,
    marginBottom: 8,
    borderRadius: 5,
  },
  skeletonLineTime: {
    height: 12,
    alignSelf: "flex-end",
    width: "20%",
    backgroundColor: Colors.white_20,
  },
});
