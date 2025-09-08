import React from 'react';
import { Animated, StyleSheet, ViewStyle } from 'react-native';
import { Card as PaperCard, useTheme } from 'react-native-paper';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevation?: (number & (0 | 2 | 1 | 3 | 4 | 5 | Animated.Value)) | undefined;
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  elevation = 2,
  onPress,
}) => {
  const theme = useTheme();

  return (
    <PaperCard
      style={[styles.card, { backgroundColor: theme.colors.surface }, style]}
      elevation={elevation}
      onPress={onPress}
    >
      {children}
    </PaperCard>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 8,
    borderRadius: 12,
  },
});
