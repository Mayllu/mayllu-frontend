import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, NotificationsCategories as NC, NotificationColors } from "@/constants";
import { NotificationItemInterface } from "@/types";

type IconNameType = keyof typeof Ionicons.glyphMap;

const iconMap: {[key: string]: IconNameType} = {
  [NC.REPORT_NEW]: 'add-circle',
  [NC.REPORT_RESOLVED]: 'star',
  [NC.REPORT_APPROVED]: 'paper-plane',
  [NC.REPORT_REJECTED]: 'close-circle',
};

export const NotificationItem: React.FC<NotificationItemInterface> = ({ title, description, status, createdAt }) => {
  const iconName = (iconMap[status] || 'alert-circle') as IconNameType;
  const iconColor = NotificationColors[status] || NotificationColors.default;

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-PE', {hour: '2-digit', minute: '2-digit', hour12: true});
  };

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, {backgroundColor: iconColor + "20"}]}>
        <Ionicons name={iconName} size={30} color={iconColor} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{title}</Text>
        <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">{description}</Text>
        <Text style={styles.time}>{formatTime(createdAt)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: 8,
    backgroundColor: Colors.white_00,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 10,
  },
  iconContainer: {
    padding: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontFamily: "PlusJS_ExtraBold",
    fontSize: 16,
    marginBottom: 4,
    color: Colors.white_80,
  },
  description: {
    fontFamily: "PlusJS_SemiBold",
    fontSize: 14,
    color: Colors.white_60,
    lineHeight: 20,
  },
  time: {
    width: "100%",
    textAlign: "right",
    fontFamily: "PlusJS_Regular",
    fontSize: 12,
    color: Colors.white_40,
  }
});
