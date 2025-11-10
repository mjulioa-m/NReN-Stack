import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/LoginScreen";
import RegistroScreen from "../screens/RegistroScreen";

const Stack = createStackNavigator();

// Este es nuestro "Navegador de Autenticación"
export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Ocultamos la barra superior
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Registro" component={RegistroScreen} />

      {/* Aquí añadiremos el navegador principal (Tabs) después del login:
        <Stack.Screen name="AppHome" component={HomeTabNavigator} />
      */}
    </Stack.Navigator>
  );
}
