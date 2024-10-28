// app/(tabs)/complaint/[id].tsx
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  StatusBar, 
  Dimensions,
  ScrollView
} from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn } from 'react-native-reanimated';
import { fetchComplaints } from '@/api/complaints';
import { ComplaintPointInterface } from '@/types';

const { width, height } = Dimensions.get('window');

const ComplaintDetailPage = () => {
  const { id } = useLocalSearchParams();
  const [complaint, setComplaint] = useState<ComplaintPointInterface | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadComplaint = async () => {
      const complaints = await fetchComplaints();
      const found = complaints.find(c => c.userId === id);
      setComplaint(found || null);
      setLoading(false);
    };
    loadComplaint();
  }, [id]);

  if (loading || !complaint) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <Stack.Screen options={{ headerShown: false }} />

      {/* Imagen de fondo */}
      <Image 
        source={{ uri: complaint.image }}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      {/* Header sin blur */}
      <View style={[styles.header]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Gradiente superior */}
      <LinearGradient
        colors={['rgba(0,0,0,0.4)', 'transparent']}
        style={styles.topGradient}
      />

      <ScrollView 
        style={styles.contentScroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Contenedor principal con blur y gradiente */}
        <View style={styles.contentWrapper}>
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.titleGradient}
          >
            <View style={styles.categoryBadge}>
              <Ionicons 
                name={complaint.categoryId === 1 ? "construct" : "warning"} 
                size={16} 
                color="#FFF" 
              />
              <Text style={styles.categoryText}>Infraestructura</Text>
            </View>

            <Text style={styles.title}>{complaint.title}</Text>

            <View style={styles.locationContainer}>
              <Ionicons name="location" size={16} color="#FFF" />
              <Text style={styles.locationText}>UTEC</Text>
            </View>
          </LinearGradient>

          {/* Card de contenido */}
          <Animated.View 
            entering={FadeIn}
            style={styles.detailsCard}
          >
            <Text style={styles.descriptionTitle}>Descripción</Text>
            <Text style={styles.description}>{complaint.description}</Text>

            {/* Acciones */}
            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="share-social-outline" size={22} color="#4B7BFF" />
                <Text style={styles.actionText}>Compartir</Text>
              </TouchableOpacity>

              <View style={styles.actionDivider} />

              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="flag-outline" size={22} color="#FF4B4B" />
                <Text style={styles.actionText}>Reportar</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#FFF',
    fontSize: 16,
  },
  backgroundImage: {
    position: 'absolute',
    width,
    height: height * 0.6,
    top: 0,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    paddingTop: StatusBar.currentHeight,
    zIndex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 1,
  },
  contentScroll: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
    marginTop: height * 0.3,
  },
  titleGradient: {
    padding: 20,
    paddingTop: 20,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  categoryText: {
    color: '#FFF',
    marginLeft: 6,
    fontSize: 14,
    fontFamily: 'PlusJS_SemiBold',
  },
  title: {
    fontSize: 24,
    color: '#FFF',
    fontFamily: 'PlusJS_Bold',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    color: '#FFF',
    marginLeft: 6,
    fontSize: 14,
    fontFamily: 'PlusJS_Regular',
    opacity: 0.9,
  },
  detailsCard: {
    backgroundColor: '#FFF',
    padding: 20,
    paddingTop: 32,
    minHeight: height * 0.5,
  },
  descriptionTitle: {
    fontSize: 18,
    color: '#000',
    fontFamily: 'PlusJS_SemiBold',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    fontFamily: 'PlusJS_Regular',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 32,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  actionText: {
    marginLeft: 8,
    fontSize: 15,
    color: '#666',
    fontFamily: 'PlusJS_Regular',
  },
  actionDivider: {
    width: 1,
    backgroundColor: '#f0f0f0',
  },
});

export default ComplaintDetailPage;
