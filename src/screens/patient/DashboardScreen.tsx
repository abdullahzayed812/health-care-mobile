import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, useTheme, ActivityIndicator } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { useGetAppointmentsQuery } from '../../api/appointmentApi';
import { StatsCard } from '../../components/ui/StatsCard';
import { Card } from '../../components/common/Card';
import { colors } from '../../styles/colors';

export const PatientDashboardScreen: React.FC = () => {
  const theme = useTheme();
  const { user } = useSelector((state: RootState) => state.auth);

  const {
    data: appointmentsData,
    isLoading,
    refetch,
  } = useGetAppointmentsQuery({
    patientId: user?.id,
    limit: 10,
  });

  const appointments = appointmentsData?.data.data || [];
  const upcomingAppointments = appointments.filter(
    apt =>
      apt.status === 'confirmed' && new Date(apt.appointmentDate) >= new Date(),
  );

  const handleRefresh = React.useCallback(() => {
    refetch();
  }, [refetch]);

  if (isLoading && !appointments.length) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
      }
    >
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.greeting}>
          Hello, {user?.firstName}!
        </Text>
        <Text variant="bodyMedium" style={styles.subGreeting}>
          How can we help you today?
        </Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <StatsCard
            title="Upcoming"
            value={upcomingAppointments.length}
            iconName="calendar-clock"
            color={colors.primary}
            subtitle="Appointments"
          />
          <StatsCard
            title="Total"
            value={appointments.length}
            iconName="calendar-multiple"
            color={colors.info}
            subtitle="This year"
          />
        </View>
      </View>

      {/* Quick Actions */}
      <Card style={styles.quickActionsCard}>
        <View style={styles.cardContent}>
          <Text variant="titleLarge" style={styles.cardTitle}>
            Quick Actions
          </Text>
          <View style={styles.actionButtons}>
            <View style={styles.actionButton}>
              <Text variant="bodyMedium">Find a Doctor</Text>
            </View>
            <View style={styles.actionButton}>
              <Text variant="bodyMedium">Book Appointment</Text>
            </View>
            <View style={styles.actionButton}>
              <Text variant="bodyMedium">View Medical History</Text>
            </View>
          </View>
        </View>
      </Card>
    </ScrollView>
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
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    color: colors.textSecondary,
  },
  header: {
    padding: 16,
    backgroundColor: colors.textSecondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  greeting: {
    fontWeight: '600',
    color: colors.textSecondary,
  },
  subGreeting: {
    marginTop: 4,
    color: colors.textSecondary,
  },
  statsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickActionsCard: {
    marginHorizontal: 16,
    marginBottom: 24,
    marginTop: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: colors.textSecondary,
  },
  cardContent: {
    gap: 16,
  },
  cardTitle: {
    fontWeight: '600',
    color: colors.textSecondary,
  },
  actionButtons: {
    flexDirection: 'column',
    gap: 12,
  },
  actionButton: {
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
});
