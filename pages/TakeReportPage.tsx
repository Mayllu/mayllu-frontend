import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  Alert,
  Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useHeaderHeight } from "@react-navigation/elements";
import { CreatePageStyle } from "@/utils";
import { complaintsApi } from "@/api/complaints";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useSession } from "@/context";

const SCREEN_WIDTH = Dimensions.get("window").width;

const COLORS = {
  primary: "#1B3045",
  secondary: "#2196F3",
  accent: "#4CAF50",
  background: "#F8F9FA",
  surface: "#FFFFFF",
  text: "#1B3045",
  error: "#DC3545",
  placeholderText: "#6C757D",
  disabled: "#E9ECEF",
  success: "#28a745",
};

const CATEGORIES = [
  {
    name: "Alumbrado Público",
    icon: "lightbulb",
    color: "#FFA726",
    description: "Problemas de alumbrado público",
  },
  {
    _id: "672ab1fcebeba5376101c24b",
    name: "Residuos",
    icon: "delete",
    color: "#26A69A",
    description: "Problemas de residuos y limpieza",
  },
  {
    name: "Calles",
    icon: "road",
    color: "#42A5F5",
    description: "Problemas en vías públicas",
  },
  {
    name: "Seguridad",
    icon: "security",
    color: "#EF5350",
    description: "Problemas de seguridad",
  },
  {
    name: "Parques",
    icon: "park",
    color: "#66BB6A",
    description: "Problemas en áreas públicas",
  },
  {
    name: "Otros",
    icon: "more-horiz",
    color: "#78909C",
    description: "Otros problemas",
  },
];

const TakeReportPage = () => {
  const headerHeight = useHeaderHeight();
  const pageStyle = CreatePageStyle(headerHeight);
  const { user } = useSession();

  const [photo, setPhoto] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [step, setStep] = useState(1); // 1: Categoría, 2: Foto, 3: Detalles

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLocationError("Permission to access location was denied");
          return;
        }

        const locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 10000,
            distanceInterval: 10,
          },
          (newLocation) => {
            setLocation(newLocation);
            setLocationError("");
          }
        );

        return () => {
          if (locationSubscription) {
            locationSubscription.remove();
          }
        };
      } catch (err) {
        setLocationError("Error getting location");
        console.error("Location error:", err);
      }
    })();
  }, []);

  const selectImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Error", "Se necesita acceso a la galería");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setPhoto(result.assets[0]);
        setErrorMessage("");
      }
    } catch (error) {
      setErrorMessage("Error al seleccionar la imagen");
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Error", "Se necesitan permisos de cámara");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setPhoto(result.assets[0]);
        setErrorMessage("");
      }
    } catch (error) {
      setErrorMessage("Error al tomar la foto");
    }
  };

  const validateForm = () => {
    if (!selectedCategory || !selectedCategory.name) {
      setErrorMessage("Seleccione una categoría del problema");
      setStep(1);
      return false;
    }
    if (!photo) {
      setErrorMessage("Tome o seleccione una foto del problema");
      setStep(2);
      return false;
    }
    if (!title.trim()) {
      setErrorMessage("Escriba un título breve del problema");
      setStep(3);
      return false;
    }
    if (!description.trim()) {
      setErrorMessage("Describa el problema con más detalle");
      setStep(3);
      return false;
    }
    if (!location || !location.coords) {
      setErrorMessage("Esperando obtener su ubicación...");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      if (!user?.dni) {
        console.error("User DNI not found in session:", user);
        setErrorMessage(
          "Error de sesión. Usuario no identificado correctamente."
        );
        return;
      }

      const formData = new FormData();
      formData.append("photo", {
        uri: photo.uri,
        type: "image/jpeg",
        name: "photo.jpg",
      } as any);
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("latitude", location.coords.latitude.toString());
      formData.append("longitude", location.coords.longitude.toString());
      formData.append("categoryName", selectedCategory.name);
      formData.append("userId", user.dni);

      console.log("Sending complaint with data:", {
        userId: user.dni,
        categoryName: selectedCategory.name,
        title: title.trim(),
        hasPhoto: !!photo,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      const result = await complaintsApi.create(formData);

      if (result.error) {
        throw new Error(result.error);
      }

      Alert.alert(
        "¡Reporte Enviado!",
        "Gracias por ayudar a mejorar nuestra ciudad.",
        [
          {
            text: "OK",
            onPress: () => {
              setPhoto(null);
              setTitle("");
              setDescription("");
              setSelectedCategory(null);
              setErrorMessage("");
              setStep(1);
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error completo:", error);
      let errorMessage = "No se pudo enviar el reporte. ";
      setErrorMessage(
        errorMessage + "Por favor, verifique su conexión e intente nuevamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3].map((stepNumber) => (
        <TouchableOpacity
          key={stepNumber}
          style={[
            styles.stepDot,
            step === stepNumber && styles.stepDotActive,
            step > stepNumber && styles.stepDotCompleted,
          ]}
          onPress={() => setStep(stepNumber)}
        >
          <Text
            style={[
              styles.stepNumber,
              (step === stepNumber || step > stepNumber) &&
                styles.stepNumberActive,
            ]}
          >
            {stepNumber}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Seleccione el tipo de problema</Text>
            <View style={styles.categoriesGrid}>
              {CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category.name}
                  style={[
                    styles.categoryItem,
                    selectedCategory?.name === category.name &&
                      styles.categoryItemSelected,
                  ]}
                  onPress={() => {
                    setSelectedCategory(category);
                    setStep(2);
                  }}
                >
                  <MaterialIcons
                    name={category.icon}
                    size={28}
                    color={
                      selectedCategory?.name === category.name
                        ? COLORS.surface
                        : category.color
                    }
                  />
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategory?.name === category.name && {
                        color: COLORS.surface,
                      },
                    ]}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Capture o seleccione una foto</Text>
            <View style={styles.photoSection}>
              {photo ? (
                <View style={styles.photoContainer}>
                  <Image source={{ uri: photo.uri }} style={styles.photo} />
                  <View style={styles.photoActions}>
                    <TouchableOpacity
                      style={styles.photoAction}
                      onPress={() => setPhoto(null)}
                    >
                      <MaterialIcons
                        name="delete"
                        size={32}
                        color={COLORS.error}
                      />
                      <Text style={styles.photoActionText}>Eliminar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.photoAction}
                      onPress={takePhoto}
                    >
                      <MaterialIcons
                        name="photo-camera"
                        size={32}
                        color={COLORS.primary}
                      />
                      <Text style={styles.photoActionText}>Otra foto</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.photoOptions}>
                  <TouchableOpacity
                    style={styles.photoOptionButton}
                    onPress={takePhoto}
                  >
                    <MaterialIcons
                      name="photo-camera"
                      size={48}
                      color={COLORS.primary}
                    />
                    <Text style={styles.photoOptionText}>Tomar Foto</Text>
                  </TouchableOpacity>

                  <View style={styles.photoOptionDivider} />

                  <TouchableOpacity
                    style={styles.photoOptionButton}
                    onPress={selectImage}
                  >
                    <MaterialIcons
                      name="photo-library"
                      size={48}
                      color={COLORS.primary}
                    />
                    <Text style={styles.photoOptionText}>Galería</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            {photo && (
              <TouchableOpacity
                style={styles.nextButton}
                onPress={() => setStep(3)}
              >
                <Text style={styles.nextButtonText}>Siguiente</Text>
                <MaterialIcons
                  name="arrow-forward"
                  size={24}
                  color={COLORS.surface}
                />
              </TouchableOpacity>
            )}
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Describa el problema</Text>
            <View style={styles.inputsContainer}>
              <Text style={styles.inputLabel}>Título breve</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: Poste de luz dañado"
                value={title}
                onChangeText={setTitle}
                placeholderTextColor={COLORS.placeholderText}
                maxLength={50}
                fontSize={18}
              />

              <Text style={styles.inputLabel}>Descripción detallada</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describa el problema con más detalle..."
                multiline
                value={description}
                onChangeText={setDescription}
                placeholderTextColor={COLORS.placeholderText}
                maxLength={500}
                fontSize={18}
                textAlignVertical="top"
              />

              {errorMessage ? (
                <Text style={styles.errorText}>{errorMessage}</Text>
              ) : null}

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  isSubmitting && styles.submitButtonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="large" color={COLORS.surface} />
                ) : (
                  <>
                    <MaterialIcons
                      name="send"
                      size={24}
                      color={COLORS.surface}
                    />
                    <Text style={styles.submitButtonText}>Enviar Reporte</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[pageStyle.container, { flex: 1 }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderStepIndicator()}
        {renderStep()}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  stepIndicator: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  stepDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    borderWidth: 2,
    borderColor: COLORS.disabled,
  },
  stepDotActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  stepDotCompleted: {
    borderColor: COLORS.success,
    backgroundColor: COLORS.success,
  },
  stepNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.disabled,
  },
  stepNumberActive: {
    color: COLORS.surface,
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 20,
    textAlign: "center",
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 0,
    gap: 16,
  },
  categoryItem: {
    width: (SCREEN_WIDTH - 100) / 2,
    aspectRatio: 2,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  photoSection: {
    marginBottom: 20,
  },
  photoContainer: {
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: COLORS.surface,
    elevation: 3,
  },
  photo: {
    width: "100%",
    height: 400,
    borderRadius: 15,
  },
  photoActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 15,
    backgroundColor: COLORS.surface,
  },
  photoAction: {
    alignItems: "center",
  },
  photoActionText: {
    marginTop: 5,
    fontSize: 16,
    color: COLORS.text,
  },
  photoOptions: {
    backgroundColor: COLORS.surface,
    borderRadius: 15,
    padding: 30,
    height: 400,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  photoOptionButton: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  photoOptionDivider: {
    width: 2,
    height: "80%",
    backgroundColor: COLORS.disabled,
    marginHorizontal: 20,
  },
  photoOptionText: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: "500",
    color: COLORS.text,
  },
  inputsContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 10,
    marginTop: 10,
  },
  input: {
    backgroundColor: COLORS.background,
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    fontSize: 18,
    color: COLORS.text,
    fontFamily: "Inter_Regular",
    borderWidth: 1,
    borderColor: COLORS.disabled,
    minHeight: 60,
  },
  textArea: {
    height: 200,
    paddingTop: 15,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 16,
    fontFamily: "Inter_Regular",
    textAlign: "center",
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  submitButton: {
    backgroundColor: COLORS.accent,
    padding: 20,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.disabled,
    elevation: 0,
    shadowOpacity: 0,
  },
  submitButtonText: {
    color: COLORS.surface,
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 10,
    fontFamily: "Inter_SemiBold",
  },
  nextButton: {
    backgroundColor: COLORS.primary,
    padding: 20,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  nextButtonText: {
    color: COLORS.surface,
    fontSize: 20,
    fontWeight: "600",
    marginRight: 10,
    fontFamily: "Inter_SemiBold",
  },
  categoryItemSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    marginTop: 8,
    fontSize: 16,
    color: COLORS.text,
    fontWeight: "500",
    textAlign: "center",
  },
  categoryTextSelected: {
    color: COLORS.surface,
  },
});

export default TakeReportPage;
