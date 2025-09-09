import { baseApi } from './index';
import { ApiResponse, PaginatedResponse } from '../types/api';
import { Doctor } from '../types/auth';

interface DoctorFilters {
  specialty?: string;
  rating?: number;
  location?: string;
  availability?: boolean;
  page?: number;
  limit?: number;
}

export const doctorApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getDoctors: builder.query<
      ApiResponse<PaginatedResponse<Doctor>>,
      DoctorFilters
    >({
      query: filters => ({
        url: 'doctors',
        params: filters,
      }),
      providesTags: result =>
        result?.data.data
          ? [
              ...result.data.data.map(({ id }) => ({
                type: 'Doctor' as const,
                id,
              })),
              { type: 'Doctor', id: 'LIST' },
            ]
          : [{ type: 'Doctor', id: 'LIST' }],
    }),
    getDoctor: builder.query<ApiResponse<Doctor>, number>({
      query: id => `doctors/${id}`,
      providesTags: (result, error, id) => [{ type: 'Doctor', id }],
    }),
    getDoctorAvailability: builder.query<
      ApiResponse<any[]>,
      { doctorId: number; date?: string }
    >({
      query: ({ doctorId, date }) => ({
        url: `doctors/${doctorId}/availability`,
        params: { date },
      }),
      providesTags: (result, error, { doctorId }) => [
        { type: 'Availability', id: `doctor-${doctorId}` },
      ],
    }),
    searchDoctors: builder.query<ApiResponse<Doctor[]>, string>({
      query: searchTerm => ({
        url: 'doctors/search',
        params: { q: searchTerm },
      }),
      providesTags: [{ type: 'Doctor', id: 'SEARCH' }],
    }),
  }),
});

export const {
  useGetDoctorsQuery,
  useGetDoctorQuery,
  useGetDoctorAvailabilityQuery,
  useSearchDoctorsQuery,
} = doctorApi;
