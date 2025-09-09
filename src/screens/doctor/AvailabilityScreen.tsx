import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import {
  Text,
  useTheme,
  ActivityIndicator,
  FAB,
  List,
  Switch,
  IconButton,
  Portal,
  Modal,
  Card,
} from 'react-native-paper';
import {
  useGetAvailabilitiesQuery,
  useUpdateAvailabilityMutation,
  useDeleteAvailabilityMutation,
  useCreateAvailabilityMutation,
  DoctorAvailability,
} from '../../api/availabilityApi';
import { EmptyState } from '../../components/common/EmptyState';
import { AvailabilityForm } from '../../components/forms/AvailabilityForm';
import { colors } from '../../styles/colors';

const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const AvailabilityScreen: React.FC = () => {
  const theme = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAvailability, setEditingAvailability] =
    useState<DoctorAvailability | null>(null);

  const {
    data: availabilityData,
    isLoading,
    refetch,
    isFetching,
  } = useGetAvailabilitiesQuery(undefined);

  const [updateAvailability] = useUpdateAvailabilityMutation();
  const [deleteAvailability] = useDeleteAvailabilityMutation();
  const [createAvailability] = useCreateAvailabilityMutation();

  const availabilities = availabilityData?.data || [];

  // Group availabilities by day of week
  const groupedAvailabilities = availabilities.reduce((acc, availability) => {
    const day = availability.dayOfWeek;
    if (!acc[day]) acc[day] = [];
    acc[day].push(availability);
    return acc;
  }, {} as Record<number, DoctorAvailability[]>);

  const handleToggleActive = async (availability: DoctorAvailability) => {
    try {
      await updateAvailability({
        id: availability.id,
        data: { isActive: !availability.isActive },
      }).unwrap();
    } catch (error) {
      console.error('Failed to update availability:', error);
    }
  };

  const handleDeleteAvailability = async (availability: DoctorAvailability) => {
    Alert.alert(
      'Delete Availability',
      `Are you sure you want to delete ${
        DAYS_OF_WEEK[availability.dayOfWeek]
      } ${availability.startTime} - ${availability.endTime}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAvailability(availability.id).unwrap();
            } catch (error) {
              console.error('Failed to delete availability:', error);
            }
          },
        },
      ],
    );
  };

  const handleSaveAvailability = async (data: any) => {
    try {
      if (editingAvailability) {
        await updateAvailability({
          id: editingAvailability.id,
          data,
        }).unwrap();
      } else {
        await createAvailability(data).unwrap();
      }
      setModalVisible(false);
      setEditingAvailability(null);
    } catch (error) {
      console.error('Failed to save availability:', error);
    }
  };

  const handleRefresh = React.useCallback(() => {
    refetch();
  }, [refetch]);

  const openModal = (availability?: DoctorAvailability) => {
    setEditingAvailability(availability || null);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingAvailability(null);
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (isLoading && !availabilities.length) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading availability...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
          />
        }
      >
        <View style={styles.header}>
          <Text variant="headlineSmall" style={styles.title}>
            Manage Your Availability
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Set your working hours for each day of the week
          </Text>
        </View>

        {availabilities.length === 0 ? (
          <EmptyState
            icon="calendar-clock"
            title="No availability set"
            description="Add your working hours to let patients book appointments with you"
            actionLabel="Add Availability"
            onAction={() => openModal()}
          />
        ) : (
          <View style={styles.availabilityList}>
            {DAYS_OF_WEEK.map((dayName, dayIndex) => {
              const dayAvailabilities = groupedAvailabilities[dayIndex] || [];

              return (
                <Card key={dayIndex} style={styles.dayCard}>
                  <List.Section>
                    <List.Subheader style={styles.dayHeader}>
                      {dayName}
                    </List.Subheader>

                    {dayAvailabilities.length === 0 ? (
                      <View style={styles.noDayAvailability}>
                        <Text
                          variant="bodyMedium"
                          style={styles.noAvailabilityText}
                        >
                          Not available
                        </Text>
                      </View>
                    ) : (
                      dayAvailabilities.map(availability => (
                        <List.Item
                          key={availability.id}
                          title={`${formatTime(
                            availability.startTime,
                          )} - ${formatTime(availability.endTime)}`}
                          titleStyle={[
                            styles.timeText,
                            !availability.isActive && styles.inactiveText,
                          ]}
                          // eslint-disable-next-line react/no-unstable-nested-components
                          left={props => (
                            <List.Icon
                              {...props}
                              icon="clock-outline"
                              color={
                                availability.isActive
                                  ? colors.primary
                                  : colors.textLight
                              }
                            />
                          )}
                          // eslint-disable-next-line react/no-unstable-nested-components
                          right={() => (
                            <View style={styles.itemActions}>
                              <Switch
                                value={availability.isActive}
                                onValueChange={() =>
                                  handleToggleActive(availability)
                                }
                                color={theme.colors.primary}
                              />
                              <IconButton
                                icon="pencil"
                                size={20}
                                onPress={() => openModal(availability)}
                              />
                              <IconButton
                                icon="delete"
                                size={20}
                                iconColor={colors.error}
                                onPress={() =>
                                  handleDeleteAvailability(availability)
                                }
                              />
                            </View>
                          )}
                          style={[
                            styles.availabilityItem,
                            !availability.isActive && styles.inactiveItem,
                          ]}
                        />
                      ))
                    )}
                  </List.Section>
                </Card>
              );
            })}
          </View>
        )}
      </ScrollView>

      <FAB icon="plus" style={styles.fab} onPress={() => openModal()} />

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={closeModal}
          contentContainerStyle={styles.modalContent}
        >
          <AvailabilityForm
            initialData={editingAvailability}
            onSubmit={handleSaveAvailability}
            onCancel={closeModal}
            isEditing={!!editingAvailability}
          />
        </Modal>
      </Portal>
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
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    color: colors.textSecondary,
  },
  availabilityList: {
    gap: 12,
  },
  dayCard: {
    elevation: 2,
    backgroundColor: colors.surface,
  },
  dayHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    paddingVertical: 8,
  },
  noDayAvailability: {
    padding: 16,
    alignItems: 'center',
  },
  noAvailabilityText: {
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  availabilityItem: {
    paddingVertical: 8,
  },
  inactiveItem: {
    opacity: 0.6,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '500',
  },
  inactiveText: {
    color: colors.textLight,
    textDecorationLine: 'line-through',
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
  },
  modalContent: {
    backgroundColor: colors.surface,
    padding: 20,
    margin: 20,
    borderRadius: 12,
    maxHeight: '80%',
  },
});
