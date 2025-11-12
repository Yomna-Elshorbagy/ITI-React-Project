// Authentication related types

export interface DecodedToken {
  name?: string;
  email?: string;
  role?: string;
  exp?: number;
  iat?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  role?: string;
}

export interface AuthResponse {
  token: string;
  data: {
    user: {
      _id: string;
      userName: string;
      email: string;
      role: string;
      phone: string;
    };
  };
}
