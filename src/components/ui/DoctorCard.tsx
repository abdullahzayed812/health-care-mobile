// src/components/ui/DoctorCard.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Avatar, Chip, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Doctor } from '../../types/auth';
import { colors } from '../../styles/colors';

interface DoctorCardProps {
  doctor: Doctor;
  onBook?: () => void;
  onViewProfile?: () => void;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({
  doctor,
  onBook,
  onViewProfile,
}) => {
  const getInitials = () => {
    return `${doctor.firstName.charAt(0)}${doctor.lastName.charAt(
      0,
    )}`.toUpperCase();
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Icon key={i} name="star" size={16} color={colors.warning} />);
    }

    if (hasHalfStar) {
      stars.push(
        <Icon
          key="half"
          name="star-half-full"
          size={16}
          color={colors.warning}
        />,
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Icon
          key={`empty-${i}`}
          name="star-outline"
          size={16}
          color={colors.textLight}
        />,
      );
    }

    return stars;
  };

  const formatFee = (fee: number) => {
    return `$${fee.toFixed(0)}`;
  };

  return (
    <Card style={styles.card} onPress={onViewProfile}>
      <View style={styles.header}>
        <Avatar.Text
          size={60}
          label={getInitials()}
          style={[styles.avatar, { backgroundColor: colors.primary }]}
        />

        <View style={styles.headerInfo}>
          <Text variant="titleMedium" style={styles.name}>
            Dr. {doctor.firstName} {doctor.lastName}
          </Text>

          <Chip
            mode="outlined"
            style={styles.specialtyChip}
            textStyle={styles.specialtyText}
          >
            {doctor.specialty}
          </Chip>

          <View style={styles.ratingContainer}>
            <View style={styles.stars}>{renderStars(doctor.rating)}</View>
            <Text variant="bodySmall" style={styles.ratingText}>
              {doctor.rating.toFixed(1)} ({Math.floor(Math.random() * 50 + 10)}{' '}
              reviews)
            </Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <IconButton
            icon="heart-outline"
            size={24}
            onPress={() => console.log('Add to favorites')}
          />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Icon name="briefcase" size={16} color={colors.primary} />
            <Text variant="bodySmall" style={styles.infoText}>
              {doctor.experience} years exp.
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Icon name="cash" size={16} color={colors.success} />
            <Text variant="bodySmall" style={styles.infoText}>
              {formatFee(doctor.consultationFee)} consultation
            </Text>
          </View>
        </View>

        {doctor.description && (
          <Text
            variant="bodySmall"
            style={styles.description}
            numberOfLines={2}
          >
            {doctor.description}
          </Text>
        )}

        <View style={styles.availability}>
          <Icon name="calendar-check" size={16} color={colors.success} />
          <Text
            variant="bodySmall"
            style={[styles.infoText, { color: colors.success }]}
          >
            Available today
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Button
          title="View Profile"
          mode="outlined"
          onPress={() => onViewProfile?.()}
          style={styles.actionButton}
        />
        <Button
          title="Book Now"
          onPress={() => onBook?.()}
          style={styles.actionButton}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 12,
  },
  avatar: {
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerRight: {
    alignItems: 'center',
  },
  name: {
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 6,
  },
  specialtyChip: {
    alignSelf: 'flex-start',
    marginBottom: 8,
    backgroundColor: colors.primaryLight + '20',
    borderColor: colors.primaryLight,
  },
  specialtyText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingText: {
    color: colors.textSecondary,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  description: {
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 8,
  },
  availability: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    flex: 1,
  },
});
