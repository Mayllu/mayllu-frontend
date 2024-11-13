import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  SectionList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
  StatusBar,
} from "react-native";
import { useLocalSearchParams, Stack, router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import { CreatePageStyle } from "@/utils";
import { complaintsApi } from "@/api/complaints";
import { ComplaintPointInterface } from "@/types";
import { Colors } from "@/constants";
import { formatTimeAgo } from "@/utils";

interface Comment {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  text: string;
  createdAt: Date;
}

const SAMPLE_COMMENTS = [
  {
    id: "1",
    user: {
      name: "Juan Pérez",
      avatar: "https://i.pravatar.cc/150?u=1",
    },
    text: "Es importante mantener limpio el río Rímac. ¡Gracias por reportar!",
    createdAt: new Date("2024-03-13T10:00:00"),
  },
  {
    id: "2",
    user: {
      name: "María García",
      avatar: "https://i.pravatar.cc/150?u=2",
    },
    text: "Ya contacté a las autoridades locales sobre este tema.",
    createdAt: new Date("2024-03-13T11:30:00"),
  },
];

const ComplaintDetailPage = () => {
  const { id } = useLocalSearchParams();
  const [complaint, setComplaint] = useState<ComplaintPointInterface | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>(SAMPLE_COMMENTS);

  useEffect(() => {
    const loadComplaint = async () => {
      try {
        const result = await complaintsApi.findOne(id as string);
        setComplaint(result);
      } catch (error) {
        console.error("Error loading complaint:", error);
      } finally {
        setLoading(false);
      }
    };
    loadComplaint();
  }, [id]);

  console.log("Complaint:", complaint);

  const renderCommentItem = ({ item }: { item: Comment }) => (
    <Animated.View style={styles.commentItem}>
      <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text style={styles.userName}>{item.user.name}</Text>
          <Text style={styles.timeAgo}>{formatTimeAgo(item.createdAt)}</Text>
        </View>
        <Text style={styles.commentText}>{item.text}</Text>
      </View>
    </Animated.View>
  );

  const renderSectionHeader = ({ section }: { section: { title: string } }) => (
    <Text style={styles.sectionHeader}>{section.title}</Text>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!complaint) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={48} color={Colors.error} />
        <Text style={styles.errorText}>No se encontró el reporte</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const sections = [
    {
      title: "Detalles del reporte",
      data: [
        {
          type: "details",
          content: complaint,
        },
      ],
    },
    {
      title: "Comentarios",
      data: comments,
    },
  ];

  const renderItem = ({
    item,
    section,
  }: {
    item: any;
    section: { title: string };
  }) => {
    if (section.title === "Detalles del reporte") {
      console.log("Renderizando detalles del reporte:", complaint);
      return (
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{complaint.title}</Text>

          {/* Info del reporte */}
          <View style={styles.metaInfoContainer}>
            <View style={styles.metaInfoRow}>
              <MaterialIcons
                name="person-outline"
                size={20}
                color={Colors.white_60}
              />
              <Text style={styles.metaInfoText}>
                DNI: <Text>{complaint.user}</Text>
              </Text>
            </View>
            <View style={styles.metaInfoRow}>
              <MaterialIcons
                name="access-time"
                size={20}
                color={Colors.white_60}
              />
              <Text style={styles.metaInfoText}>
                Reportado {formatTimeAgo(complaint.createdAt)}
              </Text>
            </View>
          </View>

          {/* Categoría y Estado */}
          <View style={styles.badgesContainer}>
            <View
              style={[
                styles.categoryBadge,
                { backgroundColor: complaint.category.color },
              ]}
            >
              <MaterialIcons
                name={complaint.category.icon}
                size={20}
                color={Colors.white_00}
              />
              <Text style={styles.categoryText} numberOfLines={1}>
                {complaint.category.name}
              </Text>
            </View>

            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>En revisión</Text>
            </View>
          </View>

          {/* Ubicación */}
          <View style={styles.locationSection}>
            <Text style={styles.sectionLabel}>Ubicación</Text>
            <View style={styles.locationContainer}>
              <View style={styles.locationIcon}>
                <MaterialIcons
                  name="location-on"
                  size={24}
                  color={Colors.blue_60}
                />
              </View>
              <View style={styles.locationDetails}>
                <Text style={styles.locationText}>
                  {complaint.formattedAddress}
                </Text>
                <Text style={styles.districtText}>
                  {/* Asumiendo que tienes el distrito en el objeto complaint */}
                  Distrito de San Isidro
                </Text>
              </View>
            </View>
          </View>

          {/* Descripción */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionLabel}>Descripción</Text>
            <Text style={styles.description}>{complaint.description}</Text>
          </View>
        </View>
      );
    }
    return renderCommentItem({ item });
  };

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item) => item.id || "details"}
        ListHeaderComponent={() => (
          <View style={styles.headerContainer}>
            <Image
              source={{ uri: complaint?.imageUrl }}
              style={styles.headerImage}
              resizeMode="cover"
            />
          </View>
        )}
        contentContainerStyle={styles.contentContainer}
      />

      <View style={styles.commentInputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Escribe un comentario..."
          placeholderTextColor={Colors.white_50}
          value={newComment}
          onChangeText={setNewComment}
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, { opacity: newComment.trim() ? 1 : 0.5 }]}
          disabled={!newComment.trim()}
        >
          <MaterialIcons name="send" size={20} color={Colors.white_00} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  detailsContainer: {
    padding: 20,
    gap: 24,
  },
  title: {
    fontSize: 24,
    color: Colors.white_90,
    fontFamily: "Inter_Bold",
    marginBottom: 8,
  },
  metaInfoContainer: {
    gap: 8,
  },
  metaInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  metaInfoText: {
    fontSize: 14,
    color: Colors.white_70,
    fontFamily: "Inter_Regular",
  },
  metaInfoHighlight: {
    fontFamily: "Inter_SemiBold",
    color: Colors.white_80,
  },
  badgesContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    maxWidth: 200, // Ancho máximo más razonable
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.yellow_10,
    borderRadius: 8,
  },
  sectionLabel: {
    fontSize: 16,
    color: Colors.white_80,
    fontFamily: "Inter_SemiBold",
    marginBottom: 12,
  },
  locationSection: {
    gap: 8,
  },
  locationContainer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: Colors.white_10,
    borderRadius: 12,
    gap: 16,
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: Colors.white_20,
    alignItems: "center",
    justifyContent: "center",
  },
  locationDetails: {
    flex: 1,
    gap: 4,
  },
  locationText: {
    fontSize: 15,
    color: Colors.white_90,
    fontFamily: "Inter_Regular",
    lineHeight: 22,
  },
  districtText: {
    fontSize: 14,
    color: Colors.white_60,
    fontFamily: "Inter_Regular",
  },
  descriptionSection: {
    gap: 8,
  },
  description: {
    fontSize: 15,
    color: Colors.white_80,
    lineHeight: 24,
    fontFamily: "Inter_Regular",
    backgroundColor: Colors.white_10,
    padding: 16,
    borderRadius: 12,
  },
  titleDetails: {
    fontSize: 16,
    color: Colors.white_70,
    fontFamily: "Inter_Regular",
  },

  container: {
    flex: 1,
    backgroundColor: Colors.white_10,
  },
  contentContainer: {
    paddingBottom: 100, // Más espacio para el input de comentarios
  },
  headerContainer: {
    height: 350,
    position: "relative",
  },
  headerImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  headerActions: {
    position: "absolute",
    top: 0,
    right: 16,
    height: 100,
    flexDirection: "row",
    gap: 12,
    padding: 16,
    justifyContent: "flex-end",
    alignItems: "flex-start",
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryText: {
    color: Colors.white_00,
    marginLeft: 6,
    fontSize: 14,
    fontFamily: "Inter_SemiBold",
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    fontSize: 18,
    fontFamily: "Inter_SemiBold",
    color: Colors.white_70,
    marginBottom: 4,
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 16,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: Colors.yellow_10,
    borderRadius: 12,
    alignSelf: "flex-start", // Para que no ocupe todo el ancho
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.yellow_40,
    marginRight: 8,
  },
  statusText: {
    color: Colors.yellow_70,
    fontSize: 14,
    fontFamily: "Inter_SemiBold",
  },
  commentItem: {
    flexDirection: "row",
    padding: 16,
    paddingHorizontal: 20,
    gap: 12,
    backgroundColor: Colors.white_00,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  commentContent: {
    flex: 1,
    backgroundColor: Colors.white_10,
    padding: 16,
    borderRadius: 12,
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  userName: {
    fontSize: 14,
    color: Colors.white_90,
    fontFamily: "Inter_Bold",
  },
  commentText: {
    fontSize: 14,
    color: Colors.white_80,
    lineHeight: 22,
    fontFamily: "Inter_Regular",
  },
  timeAgo: {
    fontSize: 12,
    color: Colors.white_60,
    fontFamily: "Inter_Regular",
  },
  keyboardView: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  commentInputWrapper: {
    backgroundColor: Colors.white_00,
    borderTopWidth: 1,
    borderTopColor: Colors.white_20,
    padding: 16,
    paddingBottom: Platform.OS === "ios" ? 32 : 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.white_10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.white_20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: Colors.white_90,
    maxHeight: 100,
    minHeight: 48,
    fontFamily: "Inter_Regular",
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.blue_60,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ComplaintDetailPage;
