import React from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { Ionicons } from '@expo/vector-icons';
import { Colors } from "@/constants";
import { CreatePageStyle } from "@/utils";

const ProfileOption = ({ icon, text, color = Colors.white_60 }) => (
  <TouchableOpacity style={styles.option}>
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

  const profileSections = [
    {
      title: "Ajustes",
      options: [
        { icon: "person", text: "Editar Perfil" },
        { icon: "notifications", text: "Notificaciones" },
        { icon: "lock-closed", text: "Privacidad y Seguridad" },
      ]
    },
    {
      title: "Preferencias",
      options: [
        { icon: "moon", text: "Modo Oscuro" },
        { icon: "language", text: "Idioma" },
        { icon: "color-palette", text: "Tema" },
      ]
    },
    {
      title: "Ayuda y Soporte",
      options: [
        { icon: "information-circle", text: "Acerca de" },
        { icon: "help-circle", text: "Centro de Ayuda" },
        { icon: "mail", text: "Contáctanos" },
      ]
    },
    {
      title: "Sesión",
      options: [
        { icon: "log-out", text: "Cerrar Sesión", color: Colors.red_60 },
      ]
    }
  ];

  return (
    <ScrollView style={pageStyle.container}>
      <View style={styles.header}>
        <Image 
          source={{uri: "https://randomuser.me/api/portraits/men/86.jpg"}} 
          style={styles.avatar} 
        />
        <View style={styles.userData}>
          <Text style={styles.name}>Carlos Balbuena</Text>
          <Text style={styles.email}>carlos.balbuena@utec.edu.pe</Text>
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
    fontFamily: "PlusJS_ExtraBold",
    color: Colors.white_80,
    fontSize: 20,
    marginBottom: 5,
  },
  email: {
    fontFamily: "PlusJS_Regular",
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
    fontFamily: "PlusJS_SemiBold",
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
    fontFamily: "PlusJS_ExtraBold",
    color: Colors.white_80,
    fontSize: 20,
  },
  statLabel: {
    fontFamily: "PlusJS_Regular",
    color: Colors.white_60,
    fontSize: 14,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: "PlusJS_ExtraBold",
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
    fontFamily: "PlusJS_SemiBold",
    color: Colors.white_80,
    fontSize: 16,
  },
});

export default ProfilePage;
