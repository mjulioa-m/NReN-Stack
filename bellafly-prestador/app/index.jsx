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
import { TextInput, Button } from "react-native-paper";
import LottieView from "lottie-react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { theme } from "../theme/theme"; // Importamos nuestro tema
import { Link, useRouter } from "expo-router"; // <-- ¡Importante! Usamos Link y useRouter de Expo

// Esta es la pantalla de Login
export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // El "navegador" de Expo Router

  // Lógica para conectar a la API
  const handleLogin = async () => {
    setLoading(true);
    console.log("Enviando a la API:", email, password);

    // Aquí es donde llamaremos a Axios
    // axios.post('http://tu-api/prestadores/login', { email, password })
    //   .then(response => {
    //     // 1. Guardar el token (AsyncStorage)
    //     // 2. Navegar a la Home (router.replace('/home'))
    //   })
    //   .catch(error => {
    //     // 3. Mostrar un 'Snackbar' (de Paper) con el error
    //   })
    //   .finally(() => {
    //     setLoading(false);
    //   });

    // Simulación por ahora:
    setTimeout(() => {
      setLoading(false);
      // Cuando tengamos el Home, aquí navegaremos
      // router.replace('/(tabs)/agenda'); // Reemplazamos la ruta
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* 1. Animación Lottie */}
          <Animated.View
            style={styles.lottieContainer}
            entering={FadeInUp.duration(2000)}
          >
            <LottieView
              source={require("../assets/lottie-login.json")} // Necesitaremos este archivo
              autoPlay
              loop
              style={styles.lottie}
            />
          </Animated.View>

          {/* 2. Título */}
          <Animated.Text
            style={styles.title}
            entering={FadeInDown.duration(800).delay(200)}
          >
            ¡Bienvenido de vuelta!
          </Animated.Text>
          <Animated.Text
            style={styles.subtitle}
            entering={FadeInDown.duration(800).delay(400)}
          >
            Ingresa a tu portal de prestador
          </Animated.Text>

          {/* 3. Formulario (Animado) */}
          <Animated.View
            style={styles.formContainer}
            entering={FadeInDown.duration(800).delay(600)}
          >
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
              label="Contraseña"
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              mode="outlined"
              secureTextEntry
              left={<TextInput.Icon icon="lock-outline" />}
            />
            <Button
              mode="contained"
              onPress={handleLogin}
              style={styles.button}
              labelStyle={styles.buttonLabel}
              loading={loading}
              disabled={loading || !email || !password}
              contentStyle={styles.buttonContent}
              buttonColor="#FFFFFF" // <-- AÑADIDO: Fondo blanco
            >
              Ingresar
            </Button>
          </Animated.View>

          {/* 4. Botón de Registro */}
          <Animated.View
            style={styles.footer}
            entering={FadeInDown.duration(800).delay(800)}
          >
            {/* Usamos 'Link' de Expo Router para navegar */}
            <Link href="/registro" asChild>
              <Button
                mode="text"
                labelStyle={{ color: "#FFFFFF" }} // <-- CAMBIO AQUÍ
              >
                ¿No tienes cuenta? Regístrate aquí
              </Button>
            </Link>
          </Animated.View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary, // <-- CAMBIO: Fondo morado (del tema)
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  lottieContainer: {
    alignItems: "center",
  },
  lottie: {
    width: 250,
    height: 250,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF", // <-- CAMBIO: Texto blanco
    textAlign: "center",
    marginTop: -20, // Ajuste para Lottie
  },
  subtitle: {
    fontSize: 16,
    color: "#E0E0E0", // <-- CAMBIO: Texto gris claro
    textAlign: "center",
    marginBottom: 32,
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
    backgroundColor: theme.colors.surface,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.primary, // <-- AÑADIDO: Texto color morado
  },
  footer: {
    marginTop: 24,
    alignItems: "center",
  },
});
