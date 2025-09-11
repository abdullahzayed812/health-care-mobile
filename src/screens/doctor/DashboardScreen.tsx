import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, useTheme, ActivityIndicator } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { useGetDashboardStatsQuery } from '../../api/appointmentApi';
import { StatsCard } from '../../components/ui/StatsCard';
import { Card } from '../../components/common/Card';
import { colors } from '../../styles/colors';

export const DoctorDashboardScreen: React.FC = () => {
  const theme = useTheme();
  const { user } = useSelector((state: RootState) => state.auth);

  const {
    data: statsData,
    isLoading,
    error,
    refetch,
  } = useGetDashboardStatsQuery();

  const stats = statsData;

  console.log(stats);

  const handleRefresh = React.useCallback(() => {
    refetch();
  }, [refetch]);

  if (isLoading && !stats) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text variant="headlineSmall">Error loading dashboard</Text>
        <Text variant="bodyMedium">Please try again</Text>
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
          Welcome back, Dr. {user?.firstName}!
        </Text>
        <Text variant="bodyMedium" style={styles.subGreeting}>
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <StatsCard
            title="Total Appointments"
            value={stats?.total || 0}
            iconName="calendar-multiple"
            color={colors.primary}
            subtitle="All time"
          />
          <StatsCard
            title="Today"
            value={stats?.todayAppointments || 0}
            iconName="calendar-today"
            color={colors.info}
            subtitle="Scheduled today"
          />
        </View>

        <View style={styles.statsRow}>
          <StatsCard
            title="Pending"
            value={stats?.pending || 0}
            iconName="clock-outline"
            color={colors.warning}
            subtitle="Awaiting confirmation"
          />
          <StatsCard
            title="Completed"
            value={stats?.completed || 0}
            iconName="check-circle"
            color={colors.success}
            subtitle="This month"
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
              <Text variant="bodyMedium">View Today's Appointments</Text>
            </View>
            <View style={styles.actionButton}>
              <Text variant="bodyMedium">Manage Availability</Text>
            </View>
            <View style={styles.actionButton}>
              <Text variant="bodyMedium">View Patient History</Text>
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
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
});
