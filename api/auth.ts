import { API_URL } from "@/constants";
import { AuthResponse, RegisterData, LoginData } from "@/types/auth";

export const authApi = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    console.log("Sending register request to:", `${API_URL}/auth/register`);
    console.log("Register data:", { ...data, password: "***" });

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include", // Importante para manejar cookies
      });

      // Primero verificamos si la respuesta es JSON válido
      let responseData;
      try {
        responseData = await response.json();
      } catch (e) {
        throw new Error("El servidor no devolvió una respuesta JSON válida");
      }

      if (!response.ok) {
        throw new Error(responseData.message || "Error en el registro");
      }

      console.log("Register success:", responseData);
      return responseData;
    } catch (error) {
      console.error("Error registering user:", error);
      throw error instanceof Error
        ? error
        : new Error("Error desconocido en el registro");
    }
  },

  login: async (credentials: LoginData): Promise<AuthResponse> => {
    try {
      console.log("Login request:", { ...credentials, password: "***" });

      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(credentials),
        credentials: "include", // Importante para manejar cookies
      });

      // Primero verificamos si la respuesta es JSON válido
      let responseData;
      try {
        responseData = await response.json();
      } catch (e) {
        throw new Error("El servidor no devolvió una respuesta JSON válida");
      }

      if (!response.ok) {
        throw new Error(
          responseData.message ||
            `Error al iniciar sesión: ${response.statusText}`,
        );
      }

      return responseData;
    } catch (error) {
      console.error("Error logging in user:", error);
      if (error instanceof Error) {
        throw new Error(`Error al iniciar sesión: ${error.message}`);
      }
      throw new Error("Error desconocido al iniciar sesión");
    }
  },

  verifyToken: async (token: string): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_URL}/auth/verify`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        credentials: "include", // Importante para manejar cookies
      });

      // Primero verificamos si la respuesta es JSON válido
      let responseData;
      try {
        responseData = await response.json();
      } catch (e) {
        throw new Error("El servidor no devolvió una respuesta JSON válida");
      }

      if (!response.ok) {
        throw new Error(
          responseData.message || `Token inválido: ${response.statusText}`,
        );
      }

      return responseData;
    } catch (error) {
      console.error("Error verifying token:", error);
      if (error instanceof Error) {
        throw new Error(`Error al verificar token: ${error.message}`);
      }
      throw new Error("Error desconocido al verificar token");
    }
  },
};
