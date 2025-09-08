import { BaseEntity } from './api';
import { User, Doctor } from './auth';

export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'cancelled'
  | 'completed';

export interface Appointment extends BaseEntity {
  patientId: number;
  doctorId: number;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  notes?: string;
  cancelReason?: string;

  // Relations
  patient?: User;
  doctor?: Doctor;
}

export interface CreateAppointmentData {
  doctorId: number;
  appointmentDate: string;
  startTime: string;
  notes?: string;
}

export interface UpdateAppointmentData {
  status?: AppointmentStatus;
  notes?: string;
  cancelReason?: string;
}
