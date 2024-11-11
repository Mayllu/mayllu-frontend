export interface User {
    id: string;
    name: string;
    email: string;
    dni: string;
    role: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    dni: string;
}

export interface LoginData {
    email: string;
    password: string;
}