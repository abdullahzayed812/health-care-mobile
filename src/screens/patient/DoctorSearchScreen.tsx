import React, { useState, useMemo } from 'react';
import { View, FlatList, RefreshControl, StyleSheet } from 'react-native';
import {
  Text,
  useTheme,
  ActivityIndicator,
  Searchbar,
  Chip,
} from 'react-native-paper';
import { useGetDoctorsQuery } from '../../api/doctorApi';
import { DoctorCard } from '../../components/ui/DoctorCard';
import { EmptyState } from '../../components/common/EmptyState';
import { Doctor } from '../../types/auth';
import { colors } from '../../styles/colors';

const specialtyFilters = [
  'All',
  'Cardiology',
  'Dermatology',
  'Orthopedics',
  'Pediatrics',
  'Neurology',
  'Psychiatry',
];

export const DoctorSearchScreen: React.FC = () => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');

  const {
    data: doctorsData,
    isLoading,
    refetch,
    isFetching,
  } = useGetDoctorsQuery({
    specialty: selectedSpecialty !== 'All' ? selectedSpecialty : undefined,
    page: 1,
    limit: 20,
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const doctors = doctorsData?.data.data || [];

  const filteredDoctors = useMemo(() => {
    if (!searchQuery) return doctors;

    return doctors.filter(doctor => {
      const fullName = `${doctor.firstName} ${doctor.lastName}`.toLowerCase();
      const searchLower = searchQuery.toLowerCase();
      return (
        fullName.includes(searchLower) ||
        doctor.specialty?.toLowerCase().includes(searchLower)
      );
    });
  }, [doctors, searchQuery]);

  const handleRefresh = React.useCallback(() => {
    refetch();
  }, [refetch]);

  const renderDoctor = ({ item }: { item: Doctor }) => (
    <DoctorCard
      doctor={item}
      onBook={() => console.log('Book appointment with', item.id)}
    />
  );

  if (isLoading && !doctors.length) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Finding doctors...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search doctors by name or specialty..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />

        <FlatList
          horizontal
          data={specialtyFilters}
          renderItem={({ item }) => (
            <Chip
              mode={selectedSpecialty === item ? 'flat' : 'outlined'}
              selected={selectedSpecialty === item}
              onPress={() => setSelectedSpecialty(item)}
              style={styles.specialtyChip}
            >
              {item}
            </Chip>
          )}
          keyExtractor={item => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.specialtyList}
        />
      </View>

      {filteredDoctors.length === 0 ? (
        <EmptyState
          icon="doctor"
          title="No doctors found"
          description={
            searchQuery || selectedSpecialty !== 'All'
              ? 'Try adjusting your search or filters'
              : 'No doctors available at the moment'
          }
          actionLabel="Refresh"
          onAction={handleRefresh}
        />
      ) : (
        <FlatList
          data={filteredDoctors}
          renderItem={renderDoctor}
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
