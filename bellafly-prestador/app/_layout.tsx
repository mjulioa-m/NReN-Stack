import "react-native-gesture-handler"; // Sigue siendo la primera línea
import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { Stack } from "expo-router"; // El "Stack Navigator" de Expo Router
import { theme } from "../theme/theme"; // Nuestro tema (¡este sí está bien!)
import { StatusBar } from "expo-status-bar";

// Este es el "Layout" principal de la app (reemplaza a App.js y AppNavigator)
export default function RootLayout() {
  return (
    // 1. PaperProvider aplica nuestro tema
    <PaperProvider theme={theme}>
      <StatusBar style="dark" />

      {/* 2. Stack es nuestro "mapa" de navegación */}
      <Stack
        screenOptions={{
          headerShown: false, // Ocultamos la barra de título en todas las pantallas
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="registro" />

        {/* Aquí añadiremos las pantallas de la app (ej. "home") */}
        {/* <Stack.Screen name="(tabs)" /> */}
      </Stack>
    </PaperProvider>
  );
}
