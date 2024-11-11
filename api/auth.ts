import { API_URL } from "@/constants";
import { AuthResponse, RegisterData, LoginData } from "@/types/auth";

export const authApi = {
    register: async (data: RegisterData): Promise<AuthResponse> => {
        console.log('Sending register request to:', `${API_URL}/auth/register`);
        console.log('Register data:', { ...data, password: '***' });

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const responseData = await response.text();
            console.log('Register raw response:', responseData);

            if (!response.ok) {
                let errorMessage: string;
                try {
                    const errorData = JSON.parse(responseData);
                    errorMessage = errorData.message || 'Error en el registro';
                } catch (e) {
                    errorMessage = `Error en el registro: ${response.status} ${response.statusText}`;
                }
                throw new Error(errorMessage);
            }

            try {
                const parsedData = JSON.parse(responseData);
                console.log('Register success:', parsedData);
                return parsedData;
            } catch (e) {
                console.error('Error parsing success response:', e);
                throw new Error('Error al procesar la respuesta del servidor');
            }
        } catch (error) {
            console.error("Error registering user:", error);
            throw error;
        }
    },

    login: async (credentials: LoginData): Promise<AuthResponse> => {
        try {
            console.log('Login request:', { ...credentials, password: '***' });

            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            const responseData = await response.text();
            console.log('Login response:', responseData);

            if (!response.ok) {
                try {
                    const errorData = JSON.parse(responseData);
                    throw new Error(errorData.message || 'Error al iniciar sesión');
                } catch (e) {
                    throw new Error('Error al iniciar sesión: ' + response.statusText);
                }
            }

            return JSON.parse(responseData);
        } catch (error) {
            console.error("Error logging in user:", error);
            throw error;
        }
    },

    verifyToken: async (token: string): Promise<AuthResponse> => {
        try {
            const response = await fetch(`${API_URL}/auth/verify`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            });

            const responseData = await response.text();
            console.log('Verify token response:', responseData);

            if (!response.ok) {
                try {
                    const errorData = JSON.parse(responseData);
                    throw new Error(errorData.message || 'Token inválido');
                } catch (e) {
                    throw new Error('Error al verificar token: ' + response.statusText);
                }
            }

            return JSON.parse(responseData);
        } catch (error) {
            console.error("Error verifying token:", error);
            throw error;
        }
    },
};
