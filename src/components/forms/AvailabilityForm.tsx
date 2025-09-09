import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, HelperText } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button } from '../common/Button';
import { DoctorAvailability } from '../../api/availabilityApi';
import { colors } from '../../styles/colors';

const availabilitySchema = yup.object().shape({
  dayOfWeek: yup.number().min(0).max(6).required('Day is required'),
  startTime: yup.string().required('Start time is required'),
  endTime: yup.string().required('End time is required'),
});

interface AvailabilityFormData {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

interface AvailabilityFormProps {
  initialData?: DoctorAvailability | null;
  onSubmit: (data: AvailabilityFormData) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
}

const DAYS_OF_WEEK = [
  { label: 'Sunday', value: '0' },
  { label: 'Monday', value: '1' },
  { label: 'Tuesday', value: '2' },
  { label: 'Wednesday', value: '3' },
  { label: 'Thursday', value: '4' },
  { label: 'Friday', value: '5' },
  { label: 'Saturday', value: '6' },
];

export const AvailabilityForm: React.FC<AvailabilityFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isEditing = false,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<AvailabilityFormData>({
    resolver: yupResolver(availabilitySchema),
    defaultValues: {
      dayOfWeek: initialData?.dayOfWeek ?? 1, // Default to Monday
      startTime: initialData?.startTime ?? '09:00',
      endTime: initialData?.endTime ?? '17:00',
    },
  });

  const startTime = watch('startTime');
  const endTime = watch('endTime');

  const handleFormSubmit = async (data: AvailabilityFormData) => {
    // Validate that end time is after start time
    const start = new Date(`1970-01-01T${data.startTime}:00`);
    const end = new Date(`1970-01-01T${data.endTime}:00`);

    if (end <= start) {
      return; // This should be handled by validation
    }

    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text variant="titleLarge" style={styles.title}>
        {isEditing ? 'Edit Availability' : 'Add Availability'}
      </Text>

      <View style={styles.form}>
        <Controller
          control={control}
          name="dayOfWeek"
          render={({ field: { onChange, value } }) => (
            <View style={styles.fieldContainer}>
              <Text variant="bodyMedium" style={styles.fieldLabel}>
                Day of Week
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.dayButtons}>
                  {DAYS_OF_WEEK.map(day => (
                    <Button
                      key={day.value}
                      title={day.label.substring(0, 3)}
                      mode={
                        value === parseInt(day.value, 10)
                          ? 'contained'
                          : 'outlined'
                      }
                      onPress={() => onChange(parseInt(day.value, 10))}
                      style={[
                        styles.dayButton,
                        value === parseInt(day.value, 10)
                          ? styles.selectedDayButton
                          : {},
                      ]}
                    />
                  ))}
                </View>
              </ScrollView>
              {errors.dayOfWeek && (
                <HelperText type="error">{errors.dayOfWeek.message}</HelperText>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="startTime"
          render={({ field: { onChange, value } }) => (
            <View style={styles.fieldContainer}>
              <Text variant="bodyMedium" style={styles.fieldLabel}>
                Start Time
              </Text>
              <TextInput
                mode="outlined"
                label="Start Time"
                value={formatTime(value)}
                onPress={() => {
                  // In a real app, you'd use a time picker here
                  console.log('Open time picker for start time');
                }}
                right={<TextInput.Icon icon="clock" />}
                style={styles.timeInput}
                editable={false}
              />
              <View style={styles.timePickerContainer}>
                <Text variant="bodySmall" style={styles.timePickerLabel}>
                  Tap to select time or use buttons:
                </Text>
                <View style={styles.timeButtons}>
                  {[
                    '08:00',
                    '09:00',
                    '10:00',
                    '11:00',
                    '12:00',
                    '13:00',
                    '14:00',
                  ].map(time => (
                    <Button
                      key={time}
                      title={formatTime(time)}
                      mode={value === time ? 'contained' : 'outlined'}
                      onPress={() => onChange(time)}
                      style={styles.timeButton}
                    />
                  ))}
                </View>
              </View>
              {errors.startTime && (
                <HelperText type="error">{errors.startTime.message}</HelperText>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="endTime"
          render={({ field: { onChange, value } }) => (
            <View style={styles.fieldContainer}>
              <Text variant="bodyMedium" style={styles.fieldLabel}>
                End Time
              </Text>
              <TextInput
                mode="outlined"
                label="End Time"
                value={formatTime(value)}
                onPress={() => {
                  console.log('Open time picker for end time');
                }}
                right={<TextInput.Icon icon="clock" />}
                style={styles.timeInput}
                editable={false}
              />
              <View style={styles.timePickerContainer}>
                <Text variant="bodySmall" style={styles.timePickerLabel}>
                  Tap to select time or use buttons:
                </Text>
                <View style={styles.timeButtons}>
                  {[
                    '15:00',
                    '16:00',
                    '17:00',
                    '18:00',
                    '19:00',
                    '20:00',
                    '21:00',
                  ].map(time => (
                    <Button
                      key={time}
                      title={formatTime(time)}
                      mode={value === time ? 'contained' : 'outlined'}
                      onPress={() => onChange(time)}
                      style={styles.timeButton}
                    />
                  ))}
                </View>
              </View>
              {errors.endTime && (
                <HelperText type="error">{errors.endTime.message}</HelperText>
              )}
            </View>
          )}
        />

        {/* Time validation message */}
        {startTime && endTime && (
          <View style={styles.validationContainer}>
            <Text variant="bodySmall" style={styles.durationText}>
              Duration: {calculateDuration(startTime, endTime)}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        <Button
          title="Cancel"
          mode="outlined"
          onPress={onCancel}
          disabled={isSubmitting}
          style={styles.actionButton}
        />
        <Button
          title={isEditing ? 'Update' : 'Add'}
          onPress={handleSubmit(handleFormSubmit)}
          loading={isSubmitting}
          disabled={isSubmitting}
          style={styles.actionButton}
        />
      </View>
    </ScrollView>
  );
};

// Helper functions
const formatTime = (time: string) => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

const calculateDuration = (startTime: string, endTime: string) => {
  const start = new Date(`1970-01-01T${startTime}:00`);
  const end = new Date(`1970-01-01T${endTime}:00`);
  const diffMs = end.getTime() - start.getTime();

  if (diffMs <= 0) {
    return 'Invalid duration';
  }

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (hours === 0) {
    return `${minutes} minutes`;
  } else if (minutes === 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  } else {
    return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minutes`;
  }
};

const styles = StyleSheet.create({
  container: {
    maxHeight: 600,
  },
  title: {
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  form: {
    marginBottom: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    color: colors.text,
    fontWeight: '500',
    marginBottom: 8,
  },
  dayButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  dayButton: {
    minWidth: 50,
  },
  selectedDayButton: {
    elevation: 2,
  },
  timeInput: {
    backgroundColor: colors.background,
    marginBottom: 8,
  },
  timePickerContainer: {
    marginTop: 8,
  },
  timePickerLabel: {
    color: colors.textSecondary,
    marginBottom: 8,
  },
  timeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeButton: {
    minWidth: 80,
  },
  validationContainer: {
    backgroundColor: colors.primaryLight + '20',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  durationText: {
    color: colors.primary,
    fontWeight: '500',
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
  },
});
