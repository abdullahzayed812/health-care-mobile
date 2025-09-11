import { baseApi } from './index';
import { ApiResponse, PaginatedResponse } from '../types/api';
import {
  Appointment,
  CreateAppointmentData,
  UpdateAppointmentData,
} from '../types/appointment';

interface AppointmentFilters {
  status?: string;
  doctorId?: number;
  patientId?: number;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export const appointmentApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getAppointments: builder.query<
      ApiResponse<PaginatedResponse<Appointment>>,
      AppointmentFilters
    >({
      query: filters => ({
        url: 'appointments',
        params: filters,
      }),
      providesTags: result =>
        result?.data.data
          ? [
              ...result.data.data.map(({ id }) => ({
                type: 'Appointment' as const,
                id,
              })),
              { type: 'Appointment', id: 'LIST' },
            ]
          : [{ type: 'Appointment', id: 'LIST' }],
    }),
    getAppointment: builder.query<ApiResponse<Appointment>, number>({
      query: id => `appointments/${id}`,
      providesTags: (result, error, id) => [{ type: 'Appointment', id }],
    }),
    createAppointment: builder.mutation<
      ApiResponse<Appointment>,
      CreateAppointmentData
    >({
      query: appointmentData => ({
        url: 'appointments',
        method: 'POST',
        body: appointmentData,
      }),
      invalidatesTags: [{ type: 'Appointment', id: 'LIST' }],
    }),
    updateAppointment: builder.mutation<
      ApiResponse<Appointment>,
      { id: number; data: UpdateAppointmentData }
    >({
      query: ({ id, data }) => ({
        url: `appointments/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Appointment', id },
        { type: 'Appointment', id: 'LIST' },
      ],
    }),
    cancelAppointment: builder.mutation<
      ApiResponse,
      { id: number; reason: string }
    >({
      query: ({ id, reason }) => ({
        url: `appointments/${id}/cancel`,
        method: 'PATCH',
        body: { cancelReason: reason },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Appointment', id },
        { type: 'Appointment', id: 'LIST' },
      ],
    }),
    getDashboardStats: builder.query<
      {
        total: number;
        pending: number;
        confirmed: number;
        completed: number;
        todayAppointments: number;
      },
      void
    >({
      query: () => 'appointments/stats',
      providesTags: [{ type: 'Appointment', id: 'STATS' }],
    }),
  }),
});

export const {
  useGetAppointmentsQuery,
  useGetAppointmentQuery,
  useCreateAppointmentMutation,
  useUpdateAppointmentMutation,
  useCancelAppointmentMutation,
  useGetDashboardStatsQuery,
} = appointmentApi;
