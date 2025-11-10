import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import { TextInput, Button, Snackbar, Appbar } from "react-native-paper";
import Animated, { FadeInDown } from "react-native-reanimated";
import { theme } from "../theme/theme";
import { useRouter } from "expo-router";
import api from "../api/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RegistroScreen() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Estado para el Snackbar de error
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState(false);
  const onDismissSnackBar = () => setVisible(false);

  const handleRegister = async () => {
    if (loading) return;

    // 1. Validación simple en el frontend
    if (!nombre || !email || !password || !passwordConfirm) {
      setError("Todos los campos son obligatorios");
      setVisible(true);
      return;
    }
    if (password !== passwordConfirm) {
      setError("Las contraseñas no coinciden");
      setVisible(true);
      return;
    }

    setLoading(true);
    setError(null);
    setVisible(false);

    try {
      // 2. Llamar a la API de Registro
      await api.post(`/prestadores`, {
        nombre,
        email,
        password,
      });

      // 3. Si el registro es exitoso, hacer login automáticamente
      const loginResponse = await api.post(`/prestadores/login`, {
        email,
        password,
      });

      const { accessToken } = loginResponse.data;
      await AsyncStorage.setItem("userToken", accessToken);

      // 4. Redirigir a la app principal
      // router.replace("/(tabs)/agenda");
      console.log("entre");
    } catch (apiError) {
      console.error(
        "Error en el registro:",
        apiError.response?.data || apiError.message
      );
      // Usamos el mensaje de error de la API (ej: "El email ya está registrado")
      const apiErrorMessage =
        apiError.response?.data?.message ||
        "Error al crear la cuenta. Intenta de nuevo.";
      setError(apiErrorMessage);
      setVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {/* Barra superior para volver atrás */}
      <Appbar.Header
        style={{ backgroundColor: theme.colors.primary, elevation: 0 }}
      >
        <Appbar.BackAction onPress={() => router.back()} color="#FFFFFF" />
        <Appbar.Content
          title="Crear Cuenta"
          titleStyle={{ color: "#FFFFFF" }}
        />
      </Appbar.Header>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.subtitle}>
            Ingresa tus datos para empezar a gestionar tus servicios.
          </Text>

          {/* Formulario (Animado) */}
          <Animated.View
            style={styles.formContainer}
            entering={FadeInDown.duration(800)}
          >
            <TextInput
              label="Nombre Completo"
              value={nombre}
              onChangeText={setNombre}
              style={styles.input}
              mode="outlined"
              autoCapitalize="words"
              left={<TextInput.Icon icon="account-outline" />}
            />
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              left={<TextInput.Icon icon="email-outline" />}
            />
            <TextInput
              label="Contraseña (mín. 8 caracteres)"
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              mode="outlined"
              secureTextEntry
              left={<TextInput.Icon icon="lock-outline" />}
            />
            <TextInput
              label="Confirmar Contraseña"
              value={passwordConfirm}
              onChangeText={setPasswordConfirm}
              style={styles.input}
              mode="outlined"
              secureTextEntry
              left={<TextInput.Icon icon="lock-check-outline" />}
            />
            <Button
              mode="contained"
              onPress={handleRegister}
              style={styles.button}
              labelStyle={styles.buttonLabel}
              loading={loading}
              disabled={loading}
              contentStyle={styles.buttonContent}
              buttonColor="#FFFFFF" // Fondo blanco
            >
              Registrarme
            </Button>
          </Animated.View>
        </ScrollView>
      </TouchableWithoutFeedback>

      {/* Snackbar para errores */}
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        duration={3000}
        style={{ backgroundColor: theme.colors.notification }}
      >
        {error}
      </Snackbar>
    </KeyboardAvoidingView>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary, // Fondo morado
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
  },
  subtitle: {
    fontSize: 16,
    color: "#E0E0E0", // Texto gris claro
    textAlign: "center",
    marginBottom: 32,
    marginTop: 16,
  },
  formContainer: {
    width: "100%",
  },
  input: {
    marginBottom: 16,
    backgroundColor: theme.colors.surface,
    paddingTop: 8,
  },
  button: {
    marginTop: 16,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.primary, // Texto morado
  },
});
