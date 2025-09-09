import React, { useState, useMemo } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useTheme, Searchbar } from 'react-native-paper';
import { EmptyState } from '../../components/common/EmptyState';
import { colors } from '../../styles/colors';
import { useSelector } from 'react-redux';
import { useGetAppointmentsQuery } from '../../api/appointmentApi';
import { AppointmentCard } from '../../components/ui/AppointmentCard';
import { RootState } from '../../app/store';
import { Appointment } from '../../types/appointment';

export const PatientAppointmentsScreen: React.FC = () => {
  const theme = useTheme();
  const { user } = useSelector((state: RootState) => state.auth);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter] = useState('');

  const {
    data: appointmentsData,

    refetch,
    isFetching,
  } = useGetAppointmentsQuery({
    patientId: user?.id,
    status: statusFilter || undefined,
    page: 1,
    limit: 20,
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const appointments = appointmentsData?.data.data || [];

  const filteredAppointments = useMemo(() => {
    if (!searchQuery) return appointments;

    return appointments.filter(appointment => {
      const doctorName =
        `Dr. ${appointment.doctor?.firstName} ${appointment.doctor?.lastName}`.toLowerCase();
      const searchLower = searchQuery.toLowerCase();
      return (
        doctorName.includes(searchLower) ||
        appointment.doctor?.specialty?.toLowerCase().includes(searchLower)
      );
    });
  }, [appointments, searchQuery]);

  const renderAppointment = ({ item }: { item: Appointment }) => (
    <AppointmentCard appointment={item} showDoctorInfo />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search appointments..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
      </View>

      {filteredAppointments.length === 0 ? (
        <EmptyState
          icon="calendar-blank"
          title="No appointments found"
          description="You don't have any appointments yet"
          actionLabel="Find a Doctor"
          onAction={() => console.log('Navigate to doctor search')}
        />
      ) : (
        <FlatList
          data={filteredAppointments}
          renderItem={renderAppointment}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              onRefresh={() => refetch()}
              colors={[theme.colors.primary]}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  greeting: {
    fontWeight: 'bold',
    color: colors.text,
  },
  subGreeting: {
    color: colors.textSecondary,
    marginTop: 4,
  },
  statsContainer: {
    paddingHorizontal: 12,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  quickActionsCard: {
    margin: 16,
    marginTop: 8,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
    color: colors.text,
  },
  actionButtons: {
    gap: 12,
  },
  actionButton: {
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchbar: {
    marginBottom: 12,
    elevation: 2,
  },
  specialtyList: {
    paddingHorizontal: 4,
  },
  specialtyChip: {
    marginRight: 8,
  },
  list: {
    padding: 16,
  },
});
