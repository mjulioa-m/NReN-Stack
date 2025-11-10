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

// Esta es la pantalla de Login
// la 'navigation' la recibimos como prop del Stack Navigator
export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Lógica para conectar a la API
  const handleLogin = async () => {
    setLoading(true);
    console.log("Enviando a la API:", email, password);

    // Aquí es donde llamaremos a Axios
    // axios.post('http://tu-api/prestadores/login', { email, password })
    //   .then(response => {
    //     // 1. Guardar el token (AsyncStorage)
    //     // 2. Navegar a la Home (navigation.replace('AppHome'))
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
      // navigation.replace('AppHome');
    }, 1500);
  };

  return (
    <PaperProvider theme={theme}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {/* 1. Animación Lottie (La parte "hermosa") */}
            <Animated.View
              style={styles.lottieContainer}
              entering={FadeInUp.duration(1000)}
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

            {/* 3. Formulario (Animado con Reanimated) */}
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
              >
                Ingresar
              </Button>
            </Animated.View>

            {/* 4. Botón de Registro */}
            <Animated.View
              style={styles.footer}
              entering={FadeInDown.duration(800).delay(800)}
            >
              <Button
                mode="text"
                onPress={() => navigation.navigate("Registro")}
                color={theme.colors.primary}
              >
                ¿No tienes cuenta? Regístrate aquí
              </Button>
            </Animated.View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </PaperProvider>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
    color: theme.colors.text,
    textAlign: "center",
    marginTop: -20, // Ajuste para Lottie
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.placeholder,
    textAlign: "center",
    marginBottom: 32,
  },
  formContainer: {
    width: "100%",
  },
  input: {
    marginBottom: 16,
    backgroundColor: theme.colors.surface,
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
  },
  footer: {
    marginTop: 24,
    alignItems: "center",
  },
});
