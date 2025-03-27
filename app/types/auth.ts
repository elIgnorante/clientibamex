export interface AuthState {
  user: User | null;
  token: string | null;
  role: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface User {
  id?: string;
  username: string;
  email?: string;
  fullName?: string;
  role?: string;
  mfaEnabled?: boolean;
}
