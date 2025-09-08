import { baseApi } from './index';
import { ApiResponse } from '../types/api';

export interface DoctorAvailability {
  id: number;
  doctorId: number;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAvailabilityData {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface UpdateAvailabilityData {
  startTime?: string;
  endTime?: string;
  isActive?: boolean;
}

export const availabilityApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getAvailabilities: builder.query<
      ApiResponse<DoctorAvailability[]>,
      number | undefined
    >({
      query: doctorId => ({
        url: 'availability',
        params: doctorId ? { doctorId } : {},
      }),
      providesTags: result =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: 'Availability' as const,
                id,
              })),
              { type: 'Availability', id: 'LIST' },
            ]
          : [{ type: 'Availability', id: 'LIST' }],
    }),
    createAvailability: builder.mutation<
      ApiResponse<DoctorAvailability>,
      CreateAvailabilityData
    >({
      query: data => ({
        url: 'availability',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Availability', id: 'LIST' }],
    }),
    updateAvailability: builder.mutation<
      ApiResponse<DoctorAvailability>,
      { id: number; data: UpdateAvailabilityData }
    >({
      query: ({ id, data }) => ({
        url: `availability/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Availability', id },
        { type: 'Availability', id: 'LIST' },
      ],
    }),
    deleteAvailability: builder.mutation<ApiResponse, number>({
      query: id => ({
        url: `availability/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Availability', id },
        { type: 'Availability', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetAvailabilitiesQuery,
  useCreateAvailabilityMutation,
  useUpdateAvailabilityMutation,
  useDeleteAvailabilityMutation,
} = availabilityApi;
