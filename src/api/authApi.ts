import { baseApi } from './index';
import { ApiResponse } from '../types/api';
import { User, LoginCredentials, RegisterData } from '../types/auth';

interface AuthResponse {
  user: User;
  accessToken: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation<ApiResponse<AuthResponse>, LoginCredentials>({
      query: credentials => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    register: builder.mutation<ApiResponse<AuthResponse>, RegisterData>({
      query: userData => ({
        url: 'auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
    logout: builder.mutation<ApiResponse, void>({
      query: () => ({
        url: 'auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),
    refreshToken: builder.mutation<ApiResponse<{ token: string }>, void>({
      query: () => ({
        url: 'auth/refresh',
        method: 'POST',
      }),
    }),
    getProfile: builder.query<ApiResponse<User>, void>({
      query: () => 'auth/me',
      providesTags: ['Auth'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useGetProfileQuery,
} = authApi;
