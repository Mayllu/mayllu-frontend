import React from "react";
import { View, Text, StyleSheet, SectionList } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { CreatePageStyle } from "@/utils";
import { useNotifications } from "@/hooks/notifications/useNotifications";
import { NotificationItemInterface } from "@/types";
import { NotificationItem, NotificationSkeletonItem } from "@/components";
import { Colors } from "@/constants";

interface SectionHeaderPropsInterface {
  section: { title: string; data: NotificationItemInterface[] };
}

const NotificationsPage = () => {
  const headerHeight = useHeaderHeight();
  const pageStyle = CreatePageStyle(headerHeight);
  const { notifications, isLoading } = useNotifications();

  const renderItem = ({ item }: { item: NotificationItemInterface }) => (
    <NotificationItem {...item} />
  );

  const renderHeaderTime = ({ section }: SectionHeaderPropsInterface) => (
    <Text style={styles.header}>{section.title}</Text>
  );

  const getDateSection = (date: string) => {
    const today = new Date();
    const notificationDate = new Date(date);
    if (notificationDate.toDateString() === today.toDateString()) return "Hoy";
    if (
      notificationDate.toDateString() ===
      new Date(today.setDate(today.getDate() - 1)).toDateString()
    )
      return "Ayer";
    return "Anteriores";
  };

  const sectionsByDate = notifications.reduce(
    (acc: any, notification: NotificationItemInterface) => {
      const currentSection = getDateSection(notification.createdAt);
      if (!acc[currentSection]) acc[currentSection] = [];
      acc[currentSection].push(notification);
      return acc;
    },
    {},
  );

  const sectionsListByDate = Object.keys(sectionsByDate).map((key) => ({
    title: key,
    data: sectionsByDate[key],
  }));

  const renderSkeletonContent = () => (
    <View>
      {[...Array(6)].map((_, index) => (
        <NotificationSkeletonItem key={index} />
      ))}
    </View>
  );

  return (
    <View style={pageStyle.container}>
      {isLoading ? (
        renderSkeletonContent()
      ) : (
        <SectionList
          sections={sectionsListByDate}
          renderItem={renderItem}
          renderSectionHeader={renderHeaderTime}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    fontFamily: "Manrope_ExtraBold",
    fontSize: 20,
    fontWeight: "600",
    marginVertical: 10,
    color: Colors.white_80,
  },
});

export default NotificationsPage;
