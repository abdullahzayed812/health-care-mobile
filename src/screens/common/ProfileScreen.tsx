import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import {
  Text,
  TextInput,
  useTheme,
  Avatar,
  HelperText,
  Divider,
  List,
  Switch,
} from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';

import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { RootState } from '../../app/store';
import { useUpdateUserMutation } from '../../api/userApi';
import { logout, updateUser } from '../../features/auth/authSlice';
import { colors } from '../../styles/colors';
import { useLogoutMutation } from '../../api/authApi';

const profileSchema = yup.object().shape({
  firstName: yup
    .string()
    .min(2, 'First name must be at least 2 characters')
    .required('First name is required'),
  lastName: yup
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .required('Last name is required'),
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  phone: yup
    .string()
    .matches(/^[+]?[\d\s\-()]+$/, 'Please enter a valid phone number'),
});

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export const ProfileScreen: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const [updateUserMutation, { isLoading: isUpdating }] =
    useUpdateUserMutation();
  const [logoutMutation] = useLogoutMutation();

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<ProfileFormData>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
  });

  const handleSaveProfile = async (data: ProfileFormData) => {
    try {
      const result = await updateUserMutation(data).unwrap();
      if (result.success) {
        dispatch(updateUser(result.data));
        setIsEditing(false);
        reset(data);
      }
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    reset();
    setIsEditing(false);
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          try {
            await logoutMutation().unwrap();
          } catch (error) {
            console.error('Logout error:', error);
          } finally {
            dispatch(logout());
          }
        },
      },
    ]);
  };

  const getInitials = () => {
    if (!user) return '';
    return `${user.firstName.charAt(0)}${user.lastName.charAt(
      0,
    )}`.toUpperCase();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Header */}
      <Card style={styles.headerCard}>
        <View style={styles.header}>
          <Avatar.Text
            size={80}
            label={getInitials()}
            style={[styles.avatar, { backgroundColor: theme.colors.primary }]}
          />
          <View style={styles.headerInfo}>
            <Text variant="headlineSmall" style={styles.name}>
              {user?.firstName} {user?.lastName}
            </Text>
            <Text variant="bodyMedium" style={styles.role}>
              {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
            </Text>
            <Text variant="bodySmall" style={styles.email}>
              {user?.email}
            </Text>
          </View>
        </View>
      </Card>

      {/* Profile Information */}
      <Card style={styles.formCard}>
        <View style={styles.cardHeader}>
          <Text variant="titleLarge" style={styles.cardTitle}>
            Personal Information
          </Text>
          <Button
            title={isEditing ? 'Cancel' : 'Edit'}
            mode="outlined"
            onPress={isEditing ? handleCancelEdit : () => setIsEditing(true)}
            style={styles.editButton}
          />
        </View>

        <View style={styles.form}>
          <View style={styles.nameRow}>
            <Controller
              control={control}
              name="firstName"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={[styles.inputContainer, styles.halfWidth]}>
                  <TextInput
                    mode="outlined"
                    label="First Name"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    disabled={!isEditing}
                    error={!!errors.firstName}
                    style={styles.input}
                  />
                  {errors.firstName && (
                    <HelperText type="error">
                      {errors.firstName.message}
                    </HelperText>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="lastName"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={[styles.inputContainer, styles.halfWidth]}>
                  <TextInput
                    mode="outlined"
                    label="Last Name"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    disabled={!isEditing}
                    error={!!errors.lastName}
                    style={styles.input}
                  />
                  {errors.lastName && (
                    <HelperText type="error">
                      {errors.lastName.message}
                    </HelperText>
                  )}
                </View>
              )}
            />
          </View>

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  mode="outlined"
                  label="Email"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  disabled={!isEditing}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={!!errors.email}
                  left={<TextInput.Icon icon="email" />}
                  style={styles.input}
                />
                {errors.email && (
                  <HelperText type="error">{errors.email.message}</HelperText>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  mode="outlined"
                  label="Phone Number"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  disabled={!isEditing}
                  keyboardType="phone-pad"
                  error={!!errors.phone}
                  left={<TextInput.Icon icon="phone" />}
                  style={styles.input}
                />
                {errors.phone && (
                  <HelperText type="error">{errors.phone.message}</HelperText>
                )}
              </View>
            )}
          />

          {isEditing && (
            <Button
              title="Save Changes"
              onPress={handleSubmit(handleSaveProfile)}
              loading={isUpdating}
              disabled={!isDirty || isUpdating}
              style={styles.saveButton}
            />
          )}
        </View>
      </Card>

      {/* Settings */}
      <Card style={styles.settingsCard}>
        <Text variant="titleLarge" style={styles.cardTitle}>
          Settings
        </Text>

        <List.Item
          title="Push Notifications"
          description="Receive notifications for appointments and updates"
          left={props => <List.Icon {...props} icon="bell" />}
          right={() => (
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              color={theme.colors.primary}
            />
          )}
        />

        <Divider style={styles.divider} />

        <List.Item
          title="Privacy Policy"
          description="View our privacy policy"
          left={props => <List.Icon {...props} icon="shield-account" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => console.log('Privacy Policy')}
        />

        <List.Item
          title="Terms of Service"
          description="View terms and conditions"
          left={props => <List.Icon {...props} icon="file-document" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => console.log('Terms of Service')}
        />

        <List.Item
          title="Help & Support"
          description="Get help and contact support"
          left={props => <List.Icon {...props} icon="help-circle" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => console.log('Help & Support')}
        />

        <Divider style={styles.divider} />

        <List.Item
          title="Sign Out"
          description="Sign out of your account"
          left={props => (
            <List.Icon {...props} icon="logout" color={colors.error} />
          )}
          titleStyle={{ color: colors.error }}
          onPress={handleLogout}
        />
      </Card>

      <View style={styles.footer}>
        <Text variant="bodySmall" style={styles.footerText}>
          MediBook v1.0.0
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  headerCard: {
    marginBottom: 16,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  role: {
    color: colors.primary,
    fontWeight: '500',
    marginBottom: 2,
  },
  email: {
    color: colors.textSecondary,
  },
  formCard: {
    marginBottom: 16,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 0,
  },
  cardTitle: {
    fontWeight: 'bold',
    color: colors.text,
  },
  editButton: {
    minWidth: 80,
  },
  form: {
    padding: 20,
    paddingTop: 16,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputContainer: {
    marginBottom: 16,
  },
  halfWidth: {
    flex: 1,
  },
  input: {
    backgroundColor: colors.background,
  },
  saveButton: {
    marginTop: 8,
  },
  settingsCard: {
    elevation: 2,
  },
  divider: {
    marginVertical: 8,
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
  },
  footerText: {
    color: colors.textLight,
  },
});
