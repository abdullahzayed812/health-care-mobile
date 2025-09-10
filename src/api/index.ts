import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs } from '@reduxjs/toolkit/query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootState } from '../app/store';
import { logout } from '../features/auth/authSlice';
import { ApiError } from '../types/api';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://10.0.2.2:3000/api/',
  prepareHeaders: async (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token || (await AsyncStorage.getItem('authToken'));

    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }

    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  ApiError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    const { status, data } = result.error;

    // Optional: log out if unauthorized
    if (status === 401) {
      api.dispatch(logout());
      await AsyncStorage.removeItem('authToken');
    }

    // Return transformed error
    return {
      status,
      data: { error: typeof data === 'string' ? data : 'Unknown error' },
    };
  }

  return {
    data: result.data,
  };
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Auth', 'User', 'Doctor', 'Appointment', 'Availability'],
  endpoints: () => ({}),
});
