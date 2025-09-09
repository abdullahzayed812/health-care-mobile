import React, { useState, useMemo } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import {
  Text,
  useTheme,
  ActivityIndicator,
  Chip,
  FAB,
  Searchbar,
  Menu,
  Divider,
} from 'react-native-paper';
import {
  useGetAppointmentsQuery,
  useCancelAppointmentMutation,
} from '../../api/appointmentApi';
import { AppointmentCard } from '../../components/ui/AppointmentCard';
import { EmptyState } from '../../components/common/EmptyState';
import { Appointment, AppointmentStatus } from '../../types/appointment';
import { colors } from '../../styles/colors';

const statusFilters = [
  { label: 'All', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

export const AppointmentsScreen: React.FC = () => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [page, setPage] = useState(1);

  const {
    data: appointmentsData,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useGetAppointmentsQuery({
    status: statusFilter || undefined,
    page,
    limit: 20,
  });

  const [cancelAppointment] = useCancelAppointmentMutation();

  const appointments = appointmentsData?.data.data || [];

  const filteredAppointments = useMemo(() => {
    if (!searchQuery) return appointments;

    return appointments.filter(appointment => {
      const patientName =
        `${appointment.patient?.firstName} ${appointment.patient?.lastName}`.toLowerCase();
      const searchLower = searchQuery.toLowerCase();
      return (
        patientName.includes(searchLower) ||
        appointment.notes?.toLowerCase().includes(searchLower)
      );
    });
  }, [appointments, searchQuery]);

  const handleRefresh = React.useCallback(() => {
    refetch();
  }, [refetch]);

  const handleCancelAppointment = async (
    appointmentId: number,
    reason: string,
  ) => {
    try {
      await cancelAppointment({ id: appointmentId, reason }).unwrap();
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
    }
  };

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

  const renderAppointment = ({ item }: { item: Appointment }) => (
    <AppointmentCard
      appointment={item}
      onCancel={reason => handleCancelAppointment(item.id, reason)}
      showPatientInfo
    />
  );

  if (isLoading && !appointments.length) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading appointments...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search appointments..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />

        <View style={styles.filterContainer}>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Chip
                mode="outlined"
                onPress={() => setMenuVisible(true)}
                icon="filter"
                style={styles.filterChip}
              >
                {statusFilters.find(f => f.value === statusFilter)?.label ||
                  'All'}
              </Chip>
            }
          >
            {statusFilters.map(filter => (
              <React.Fragment key={filter.value}>
                <Menu.Item
                  onPress={() => {
                    setStatusFilter(filter.value);
                    setMenuVisible(false);
                  }}
                  title={filter.label}
                  leadingIcon={
                    statusFilter === filter.value ? 'check' : undefined
                  }
                />
                {filter.value !==
                  statusFilters[statusFilters.length - 1].value && <Divider />}
              </React.Fragment>
            ))}
          </Menu>
        </View>
      </View>

      {filteredAppointments.length === 0 ? (
        <EmptyState
          icon="calendar-blank"
          title="No appointments found"
          description={
            statusFilter
              ? `No ${statusFilter} appointments at the moment`
              : "You don't have any appointments yet"
          }
          actionLabel="Refresh"
          onAction={handleRefresh}
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
              onRefresh={handleRefresh}
              colors={[theme.colors.primary]}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      <FAB
        icon="calendar-plus"
        style={styles.fab}
        onPress={() => {
          // Navigate to create appointment screen
          console.log('Create appointment');
        }}
      />
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
    padding: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchbar: {
    marginBottom: 12,
    elevation: 2,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterChip: {
    marginRight: 8,
  },
  list: {
    padding: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
  },
});
