import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Card } from '../common/Card';

interface StatsCardProps {
  title: string;
  value: number | string;
  iconName: string;
  color: string;
  subtitle?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  iconName,
  color,
  subtitle,
}) => {
  const theme = useTheme();

  return (
    <Card style={styles.card}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Icon name={iconName} size={24} color={color} />
          <Text
            variant="bodyMedium"
            style={[styles.title, { color: theme.colors.onSurface }]}
          >
            {title}
          </Text>
        </View>

        <Text
          variant="displaySmall"
          style={[styles.value, { color: theme.colors.onSurface }]}
        >
          {value}
        </Text>

        {subtitle && (
          <Text
            variant="bodySmall"
            style={[styles.subtitle, { color: theme.colors.outline }]}
          >
            {subtitle}
          </Text>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 120,
  },
  container: {
    padding: 16,
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    marginLeft: 8,
    fontWeight: '500',
  },
  value: {
    fontWeight: 'bold',
    marginVertical: 4,
  },
  subtitle: {
    marginTop: 4,
  },
});
