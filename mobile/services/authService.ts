import api from './api';

interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'client';
  };
}

interface RegisterResponse {
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: 'client';
  };
}

/**
 * POST /api/auth/login
 */
export async function loginRequest(email: string, password: string): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/login', { email, password });
  return data;
}

/**
 * POST /api/auth/register
 */
export async function registerRequest(
  name: string,
  email: string,
  password: string
): Promise<RegisterResponse> {
  const { data } = await api.post<RegisterResponse>('/auth/register', { name, email, password });
  return data;
}
