import * as yup from 'yup';

export const emailValidation = yup
  .string()
  .email('Please enter a valid email address')
  .required('Email is required');

export const passwordValidation = yup
  .string()
  .min(6, 'Password must be at least 6 characters')
  .required('Password is required');

export const phoneValidation = yup
  .string()
  .matches(/^[+]?[\d\s\-()]+$/, 'Please enter a valid phone number')
  .min(10, 'Phone number must be at least 10 digits');

export const nameValidation = yup
  .string()
  .min(2, 'Name must be at least 2 characters')
  .required('Name is required');

export const appointmentValidationSchema = yup.object().shape({
  doctorId: yup.number().required('Doctor is required'),
  appointmentDate: yup.date().required('Date is required'),
  startTime: yup.string().required('Time is required'),
  notes: yup.string().max(500, 'Notes cannot exceed 500 characters'),
});

export const availabilityValidationSchema = yup.object().shape({
  dayOfWeek: yup.number().min(0).max(6).required('Day is required'),
  startTime: yup.string().required('Start time is required'),
  endTime: yup.string().required('End time is required'),
});
