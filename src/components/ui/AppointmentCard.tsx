// src/components/ui/AppointmentCard.tsx
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Text,
  Chip,
  IconButton,
  Menu,
  Divider,
  Portal,
  Modal,
  TextInput,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Appointment, AppointmentStatus } from '../../types/appointment';
import { colors } from '../../styles/colors';

interface AppointmentCardProps {
  appointment: Appointment;
  onCancel?: (reason: string) => void;
  onUpdate?: (status: AppointmentStatus) => void;
  showPatientInfo?: boolean;
  showDoctorInfo?: boolean;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onCancel,
  onUpdate,
  showPatientInfo = false,
  showDoctorInfo = false,
}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case 'pending':
        return colors.warning;
      case 'confirmed':
        return colors.info;
      case 'completed':
        return colors.success;
      case 'cancelled':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusIcon = (status: AppointmentStatus) => {
    switch (status) {
      case 'pending':
        return 'clock-outline';
      case 'confirmed':
        return 'check-circle';
      case 'completed':
        return 'check-all';
      case 'cancelled':
        return 'cancel';
      default:
        return 'help';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleCancelAppointment = () => {
    if (cancelReason.trim() && onCancel) {
      onCancel(cancelReason.trim());
      setCancelModalVisible(false);
      setCancelReason('');
    }
  };

  const canCancel =
    appointment.status === 'pending' || appointment.status === 'confirmed';
  const canConfirm = appointment.status === 'pending';
  const canComplete = appointment.status === 'confirmed';

  return (
    <>
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text variant="titleMedium" style={styles.date}>
              {formatDate(appointment.appointmentDate)}
            </Text>
            <Text variant="bodyLarge" style={styles.time}>
              {formatTime(appointment.startTime)} -{' '}
              {formatTime(appointment.endTime)}
            </Text>
          </View>

          <View style={styles.headerRight}>
            <Chip
              icon={getStatusIcon(appointment.status)}
              style={[
                styles.statusChip,
                { backgroundColor: `${getStatusColor(appointment.status)}20` },
              ]}
              textStyle={{
                color: getStatusColor(appointment.status),
                fontWeight: '600',
              }}
            >
              {appointment.status.charAt(0).toUpperCase() +
                appointment.status.slice(1)}
            </Chip>

            {(canCancel || canConfirm || canComplete) && (
              <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={
                  <IconButton
                    icon="dots-vertical"
                    onPress={() => setMenuVisible(true)}
                  />
                }
              >
                {canConfirm && onUpdate && (
                  <>
                    <Menu.Item
                      onPress={() => {
                        onUpdate('confirmed');
                        setMenuVisible(false);
                      }}
                      title="Confirm"
                      leadingIcon="check-circle"
                    />
                    <Divider />
                  </>
                )}

                {canComplete && onUpdate && (
                  <>
                    <Menu.Item
                      onPress={() => {
                        onUpdate('completed');
                        setMenuVisible(false);
                      }}
                      title="Mark Complete"
                      leadingIcon="check-all"
                    />
                    <Divider />
                  </>
                )}

                {canCancel && onCancel && (
                  <Menu.Item
                    onPress={() => {
                      setCancelModalVisible(true);
                      setMenuVisible(false);
                    }}
                    title="Cancel"
                    leadingIcon="cancel"
                    titleStyle={{ color: colors.error }}
                  />
                )}
              </Menu>
            )}
          </View>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.content}>
          {showPatientInfo && appointment.patient && (
            <View style={styles.personInfo}>
              <Icon name="account" size={20} color={colors.primary} />
              <View style={styles.personDetails}>
                <Text variant="bodyMedium" style={styles.personName}>
                  {appointment.patient.firstName} {appointment.patient.lastName}
                </Text>
                {appointment.patient.phone && (
                  <Text variant="bodySmall" style={styles.personContact}>
                    {appointment.patient.phone}
                  </Text>
                )}
              </View>
            </View>
          )}

          {showDoctorInfo && appointment.doctor && (
            <View style={styles.personInfo}>
              <Icon name="stethoscope" size={20} color={colors.primary} />
              <View style={styles.personDetails}>
                <Text variant="bodyMedium" style={styles.personName}>
                  Dr. {appointment.doctor.firstName}{' '}
                  {appointment.doctor.lastName}
                </Text>
                <Text variant="bodySmall" style={styles.specialty}>
                  {appointment.doctor.specialty}
                </Text>
              </View>
            </View>
          )}

          {appointment.notes && (
            <View style={styles.notes}>
              <Icon name="note-text" size={16} color={colors.textSecondary} />
              <Text variant="bodySmall" style={styles.notesText}>
                {appointment.notes}
              </Text>
            </View>
          )}

          {appointment.cancelReason && (
            <View style={[styles.notes, styles.cancelReason]}>
              <Icon name="information" size={16} color={colors.error} />
              <Text
                variant="bodySmall"
                style={[styles.notesText, { color: colors.error }]}
              >
                Cancelled: {appointment.cancelReason}
              </Text>
            </View>
          )}
        </View>
      </Card>

      <Portal>
        <Modal
          visible={cancelModalVisible}
          onDismiss={() => setCancelModalVisible(false)}
          contentContainerStyle={styles.modalContent}
        >
          <Text variant="titleLarge" style={styles.modalTitle}>
            Cancel Appointment
          </Text>

          <Text variant="bodyMedium" style={styles.modalDescription}>
            Please provide a reason for cancelling this appointment:
          </Text>

          <TextInput
            mode="outlined"
            label="Cancellation Reason"
            value={cancelReason}
            onChangeText={setCancelReason}
            multiline
            numberOfLines={3}
            style={styles.cancelInput}
          />

          <View style={styles.modalActions}>
            <Button
              title="Cancel"
              mode="outlined"
              onPress={() => {
                setCancelModalVisible(false);
                setCancelReason('');
              }}
              style={styles.modalButton}
            />
            <Button
              title="Confirm Cancellation"
              variant="danger"
              onPress={handleCancelAppointment}
              disabled={!cancelReason.trim()}
              style={styles.modalButton}
            />
          </View>
        </Modal>
      </Portal>
    </>
  );
};

export const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontWeight: '600',
    color: colors.primaryLight,
  },
  time: {
    color: colors.textSecondary,
    marginTop: 4,
  },
  statusChip: {
    marginLeft: 8,
    borderRadius: 16,
    height: 28,
    justifyContent: 'center',
  },
  divider: {
    marginVertical: 8,
  },
  content: {
    gap: 12,
  },
  personInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  personDetails: {
    flex: 1,
  },
  personName: {
    fontWeight: '600',
    color: colors.primaryDark,
  },
  personContact: {
    color: colors.textSecondary,
  },
  specialty: {
    color: colors.textSecondary,
  },
  notes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  notesText: {
    color: colors.textSecondary,
    flex: 1,
  },
  cancelReason: {
    marginTop: 8,
  },
  modalContent: {
    backgroundColor: colors.textSecondary,
    padding: 24,
    margin: 16,
    borderRadius: 12,
  },
  modalTitle: {
    fontWeight: '600',
    marginBottom: 12,
    color: colors.textSecondary,
  },
  modalDescription: {
    marginBottom: 12,
    color: colors.textSecondary,
  },
  cancelInput: {
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalButton: {
    minWidth: 120,
  },
});
