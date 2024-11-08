import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useHeaderHeight } from "@react-navigation/elements";
import { CreatePageStyle } from "@/utils";
import { complaintsApi } from '@/api/complaints';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const COLORS = {
  primary: '#1B3045',
  secondary: '#2196F3',
  accent: '#4CAF50',
  background: '#F8F9FA',
  surface: '#FFFFFF',
  text: '#1B3045',
  error: '#DC3545',
  placeholderText: '#6C757D',
  disabled: '#E9ECEF'
};

const TakeReportPage = () => {
  const headerHeight = useHeaderHeight();
  const pageStyle = CreatePageStyle(headerHeight);
  
  const [photo, setPhoto] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const selectImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Se necesita acceso a la galería');
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
        setErrorMessage('');
      }
    } catch (error) {
      setErrorMessage('Error al seleccionar la imagen');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Se necesitan permisos de cámara');
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
        setErrorMessage('');
      }
    } catch (error) {
      setErrorMessage('Error al tomar la foto');
    }
  };

  const validateForm = () => {
    if (!photo) {
      setErrorMessage('Por favor, agrega una foto');
      return false;
    }
    if (!title.trim()) {
      setErrorMessage('Por favor, ingresa un título');
      return false;
    }
    if (!description.trim()) {
      setErrorMessage('Por favor, ingresa una descripción');
      return false;
    }
    return true;
  };

  // En la función handleSubmit
const handleSubmit = async () => {
  if (!validateForm()) return;
  
  try {
    setIsSubmitting(true);
    setErrorMessage('');

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMessage('Se necesitan permisos de ubicación');
      return;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High
    });

    // Crear el objeto File desde la URI de la imagen
    const response = await fetch(photo.uri);
    const blob = await response.blob();
    
    const formData = new FormData();
    
    // Añadir la imagen como archivo
    formData.append('photo', {
      uri: photo.uri,
      type: 'image/jpeg',
      name: 'photo.jpg'
    } as any);

    // Añadir el resto de campos
    formData.append('title', title.trim());
    formData.append('description', description.trim());
    formData.append('latitude', location.coords.latitude.toString());
    formData.append('longitude', location.coords.longitude.toString());
    formData.append('categoryId', '672ab1fcebeba5376101c24a'); // ID de una categoría válida
    formData.append('userId', '72671060'); // DNI del usuario

    const result = await complaintsApi.create(formData);
    
    if (result.error) {
      throw new Error(result.error);
    }
    
    // Éxito
    setPhoto(null);
    setTitle('');
    setDescription('');
    setErrorMessage('');
    alert('¡Reporte enviado con éxito!');
    
  } catch (error) {
    console.error('Error detallado:', error);
    setErrorMessage(
      error.message || 'Error al enviar el reporte. Por favor, intenta nuevamente.'
    );
  } finally {
    setIsSubmitting(false);
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
        <View style={styles.formContainer}>
          {/* Sección de Foto */}
          <View style={styles.photoSection}>
            {photo ? (
              <View style={styles.photoContainer}>
                <Image source={{ uri: photo.uri }} style={styles.photo} />
                <BlurView intensity={80} style={styles.photoOverlay}>
                  <TouchableOpacity 
                    style={styles.photoAction}
                    onPress={() => setPhoto(null)}
                  >
                    <MaterialIcons name="delete" size={24} color={COLORS.error} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.photoAction}
                    onPress={takePhoto}
                  >
                    <MaterialIcons name="photo-camera" size={24} color={COLORS.surface} />
                  </TouchableOpacity>
                </BlurView>
              </View>
            ) : (
              <View style={styles.photoOptions}>
                <TouchableOpacity 
                  style={styles.photoOptionButton}
                  onPress={takePhoto}
                >
                  <MaterialIcons name="photo-camera" size={32} color={COLORS.primary} />
                  <Text style={styles.photoOptionText}>Tomar Foto</Text>
                </TouchableOpacity>
                
                <View style={styles.photoOptionDivider} />
                
                <TouchableOpacity 
                  style={styles.photoOptionButton}
                  onPress={selectImage}
                >
                  <MaterialIcons name="photo-library" size={32} color={COLORS.primary} />
                  <Text style={styles.photoOptionText}>Galería</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Campos del formulario */}
          <View style={styles.inputsContainer}>
            <TextInput
              style={styles.input}
              placeholder="Título del reporte"
              value={title}
              onChangeText={setTitle}
              placeholderTextColor={COLORS.placeholderText}
              maxLength={50}
            />
            
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe el problema detalladamente"
              multiline
              value={description}
              onChangeText={setDescription}
              placeholderTextColor={COLORS.placeholderText}
              maxLength={500}
            />
            
            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}

            <TouchableOpacity 
              style={[
                styles.submitButton,
                (isSubmitting || !photo) && styles.submitButtonDisabled
              ]}
              onPress={handleSubmit}
              disabled={isSubmitting || !photo}
            >
              {isSubmitting ? (
                <ActivityIndicator color={COLORS.surface} />
              ) : (
                <>
                  <MaterialIcons name="send" size={20} color={COLORS.surface} />
                  <Text style={styles.submitButtonText}>Enviar Reporte</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  formContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.background,
  },
  photoSection: {
    marginBottom: 20,
  },
  photoContainer: {
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  photo: {
    width: '100%',
    height: 300,
    borderRadius: 15,
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
  },
  photoAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoOptions: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 15,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  photoOptionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoOptionDivider: {
    width: 1,
    backgroundColor: COLORS.disabled,
    marginHorizontal: 20,
  },
  photoOptionText: {
    marginTop: 8,
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '500',
  },
  inputsContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 15,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  input: {
    backgroundColor: COLORS.background,
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    color: COLORS.text,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  errorText: {
    color: COLORS.error,
    marginBottom: 15,
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: COLORS.accent,
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.disabled,
  },
  submitButtonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default TakeReportPage;