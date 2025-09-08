import { BaseEntity } from './api';

export type UserRole = 'doctor' | 'patient' | 'admin';

export interface User extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  isActive: boolean;
}

export interface Doctor extends User {
  specialty: string;
  experience: number;
  rating: number;
  consultationFee: number;
  description?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  specialty?: string; // for doctors
}
