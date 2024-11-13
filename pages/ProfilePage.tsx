import React from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { Ionicons } from '@expo/vector-icons';
import { Colors } from "@/constants";
import { CreatePageStyle } from "@/utils";
import { useSession } from '@/context';
import { useNavigation } from '@react-navigation/native';

const ProfileOption = ({ icon, text, color = Colors.white_60, onPress }) => (
  <TouchableOpacity style={styles.option} onPress={onPress}>
    <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
      <Ionicons name={icon} size={20} color={color} />
    </View>
    <Text style={styles.optionText}>{text}</Text>
    <Ionicons name="chevron-forward" size={20} color={Colors.white_60} />
  </TouchableOpacity>
);

const ProfileSection = ({ title, options }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {options.map((option, index) => (
      <ProfileOption key={index} {...option} />
    ))}
  </View>
);

const ProfilePage = () => {
  const headerHeight = useHeaderHeight();
  const pageStyle = CreatePageStyle(headerHeight);
  const { user, signOut } = useSession();
  const navigation = useNavigation();

  const handleLogout = async () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro que deseas cerrar sesión?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Sí, cerrar sesión",
          onPress: async () => {
            try {
              await signOut();
              navigation.reset({
                index: 0,
                routes: [{ name: 'Auth' }],
              });
            } catch (error) {
              Alert.alert("Error", "No se pudo cerrar sesión. Intente nuevamente.");
            }
          }
        }
      ]
    );
  };

  const profileSections = [
    {
      title: "Ajustes",
      options: [
        { 
          icon: "person", 
          text: "Editar Perfil",
          onPress: () => navigation.navigate('EditProfile')
        },
        { 
          icon: "notifications", 
          text: "Notificaciones",
          onPress: () => navigation.navigate('Notifications')
        },
        { 
          icon: "lock-closed", 
          text: "Privacidad y Seguridad",
          onPress: () => navigation.navigate('Privacy')
        },
      ]
    },
    {
      title: "Preferencias",
      options: [
        { 
          icon: "moon", 
          text: "Modo Oscuro",
          onPress: () => navigation.navigate('DarkMode')
        },
        { 
          icon: "language", 
          text: "Idioma",
          onPress: () => navigation.navigate('Language')
        },
        { 
          icon: "color-palette", 
          text: "Tema",
          onPress: () => navigation.navigate('Theme')
        },
      ]
    },
    {
      title: "Ayuda y Soporte",
      options: [
        { 
          icon: "information-circle", 
          text: "Acerca de",
          onPress: () => navigation.navigate('About')
        },
        { 
          icon: "help-circle", 
          text: "Centro de Ayuda",
          onPress: () => navigation.navigate('Help')
        },
        { 
          icon: "mail", 
          text: "Contáctanos",
          onPress: () => navigation.navigate('Contact')
        },
      ]
    },
    {
      title: "Sesión",
      options: [
        { 
          icon: "log-out", 
          text: "Cerrar Sesión", 
          color: Colors.red_60,
          onPress: handleLogout
        },
      ]
    }
  ];

  return (
    <ScrollView style={[pageStyle.container, styles.scrollView]} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Image 
          source={{ uri: "https://avatars.githubusercontent.com/u/118573214?v=4" }} 
          style={styles.avatar} 
        />
        <View style={styles.userData}>
          <Text style={styles.name}>{user?.name || 'Usuario'}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Usuario Verificado</Text>
          </View>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Reportes</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>Explorador</Text>
          <Text style={styles.statLabel}>Rango</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Meses</Text>
        </View>
      </View>

      {profileSections.map((section, index) => (
        <ProfileSection key={index} {...section} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 150,
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: Colors.white_00,
    borderRadius: 8,
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  userData: {
    marginLeft: 20,
    flex: 1,
  },
  name: {
    fontFamily: "Inter_Regular",
    color: Colors.white_80,
    fontSize: 20,
    marginBottom: 5,
  },
  email: {
    fontFamily: "Inter_Regular",
    color: Colors.white_60,
    fontSize: 14,
    marginBottom: 5,
  },
  badge: {
    backgroundColor: Colors.blue_60 + '20',
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: Colors.blue_60,
    fontFamily: "Inter_Regular",
    fontSize: 11,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: Colors.white_00,
    borderRadius: 8,
    paddingVertical: 25,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statItem: {
    alignItems: "center",
    gap: 5,
  },
  statNumber: {
    fontFamily: "Inter_SemiBold",
    color: Colors.white_80,
    fontSize: 20,
  },
  statLabel: {
    fontFamily: "Inter_Regular",
    color: Colors.white_60,
    fontSize: 14,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: Colors.white_80,
    fontSize: 18,
    marginBottom: 15,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: Colors.white_00,
  },
  iconContainer: {
    padding: 10,
    borderRadius: 4,
    marginRight: 15,
  },
  optionText: {
    flex: 1,
    fontFamily: "Inter_Regular",
    color: Colors.white_80,
    fontSize: 16,
  },
});

export default ProfilePage;
