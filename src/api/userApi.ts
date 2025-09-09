import { baseApi } from './index';
import { ApiResponse } from '../types/api';
import { User } from '../types/auth';

interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export const userApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    updateUser: builder.mutation<ApiResponse<User>, UpdateUserData>({
      query: userData => ({
        url: 'users/profile',
        method: 'PATCH',
        body: userData,
      }),
      invalidatesTags: ['Auth'],
    }),
    changePassword: builder.mutation<ApiResponse, ChangePasswordData>({
      query: passwordData => ({
        url: 'users/change-password',
        method: 'POST',
        body: passwordData,
      }),
    }),
    uploadAvatar: builder.mutation<ApiResponse<{ avatar: string }>, FormData>({
      query: formData => ({
        url: 'users/avatar',
        method: 'POST',
        body: formData,
        formData: true,
      }),
      invalidatesTags: ['Auth'],
    }),
    deleteAccount: builder.mutation<ApiResponse, void>({
      query: () => ({
        url: 'users/account',
        method: 'DELETE',
      }),
    }),
    getUserProfile: builder.query<ApiResponse<User>, number>({
      query: userId => `users/${userId}`,
      providesTags: (result, error, userId) => [{ type: 'User', id: userId }],
    }),
  }),
});

export const {
  useUpdateUserMutation,
  useChangePasswordMutation,
  useUploadAvatarMutation,
  useDeleteAccountMutation,
  useGetUserProfileQuery,
} = userApi;
