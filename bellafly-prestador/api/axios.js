import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// --- ¡¡CONFIGURACIÓN DE ENTORNOS!! ---

// 1. Esta variable global __DEV__ es mágica.
//    Expo la pone en 'true' cuando estás en desarrollo.
//    Será 'false' cuando construyas la app para producción.
const isDevelopment = __DEV__;

// 2. Define tus URLs
const PROD_URL = "https://api.bellafly.com";
const DEV_URL = "http://192.168.1.190:3000";

const baseURL = isDevelopment ? DEV_URL : PROD_URL;
// ------------------------------------

// 3. Creamos la instancia de Axios
const api = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 4. ¡EL INTERCEPTOR MÁGICO!
//    Esto se ejecuta ANTES de CADA petición.
api.interceptors.request.use(
  async (config) => {
    // 5. Revisa si ya tenemos un token guardado
    const token = await AsyncStorage.getItem("userToken");

    // 6. Si el token existe, lo añade a la cabecera
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config; // Continúa con la petición
  },
  (error) => {
    // Si hay un error al configurar la petición
    return Promise.reject(error);
  }
);

export default api;
