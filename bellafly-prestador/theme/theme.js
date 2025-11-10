import { DefaultTheme } from "react-native-paper";

// Esta es nuestra paleta de marca "bellafly"
export const theme = {
  ...DefaultTheme,
  roundness: 12, // Bordes redondeados modernos
  colors: {
    ...DefaultTheme.colors,
    primary: "#6D28D9", // Púrpura profundo (nuestro color principal)
    accent: "#C026D3", // Magenta (para botones y highlights)
    background: "#FFFFFF",
    surface: "#F9FAFB", // Un gris muy suave para los inputs
    text: "#1F2937",
    placeholder: "#6B7280",
    notification: "#EC4899", // Un rosa para notificaciones
  },
};
