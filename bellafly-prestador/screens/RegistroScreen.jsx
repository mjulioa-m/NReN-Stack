import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { theme } from "../theme/theme";

// Pantalla de Registro (placeholder por ahora)
export default function RegistroScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Cuenta</Text>
      <Text style={styles.subtitle}>
        Aquí irá el formulario de registro para nuevos prestadores.
      </Text>
      <Button
        mode="contained"
        onPress={() => navigation.goBack()}
        style={{ marginTop: 20 }}
      >
        Volver al Login
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.placeholder,
    textAlign: "center",
    marginTop: 8,
  },
});
