import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Text,
  TextInput,
  useTheme,
  HelperText,
  SegmentedButtons,
} from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';

import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { useRegisterMutation } from '../../api/authApi';
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from '../../features/auth/authSlice';
import { RegisterData } from '../../types/auth';
import { colors } from '../../styles/colors';

const registerSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  firstName: yup
    .string()
    .min(2, 'First name must be at least 2 characters')
    .required('First name is required'),
  lastName: yup
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .required('Last name is required'),
  phone: yup
    .string()
    .matches(/^[+]?[\d\s\-()]+$/, 'Please enter a valid phone number'),
  role: yup
    .string()
    .oneOf(['doctor', 'patient'], 'Please select a role')
    .required('Role is required'),
  specialty: yup.string().when('role', {
    is: 'doctor',
    then: schema => schema.required('Specialty is required for doctors'),
    otherwise: schema => schema.notRequired(),
  }),
});

interface RegisterFormData extends RegisterData {
  confirmPassword: string;
}

interface RegisterScreenProps {
  navigation: any;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  navigation,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [register, { isLoading }] = useRegisterMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phone: '',
      role: 'patient',
      specialty: '',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      dispatch(loginStart());

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...registerData } = data;
      const result = await register(registerData).unwrap();

      if (result.success) {
        dispatch(
          loginSuccess({
            user: result.data.user,
            token: result.data.token,
          }),
        );
      } else {
        dispatch(loginFailure());
        setError('root', { message: result.message || 'Registration failed' });
      }
    } catch (error: any) {
      dispatch(loginFailure());
      const errorMessage =
        error?.data?.message || 'An error occurred during registration';
      setError('root', { message: errorMessage });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text variant="headlineLarge" style={styles.title}>
            Create Account
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Join MediBook today
          </Text>
        </View>

        <Card style={styles.formCard}>
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
                    placeholder="Enter your email"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
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
                    label="Phone (Optional)"
                    placeholder="Enter your phone number"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
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

            <Controller
              control={control}
              name="role"
              render={({ field: { onChange, value } }) => (
                <View style={styles.inputContainer}>
                  <Text variant="bodyMedium" style={styles.fieldLabel}>
                    I am a:
                  </Text>
                  <SegmentedButtons
                    value={value}
                    onValueChange={onChange}
                    buttons={[
                      {
                        value: 'patient',
                        label: 'Patient',
                        icon: 'account',
                      },
                      {
                        value: 'doctor',
                        label: 'Doctor',
                        icon: 'stethoscope',
                      },
                    ]}
                    style={styles.segmentedButtons}
                  />
                  {errors.role && (
                    <HelperText type="error">{errors.role.message}</HelperText>
                  )}
                </View>
              )}
            />

            {selectedRole === 'doctor' && (
              <Controller
                control={control}
                name="specialty"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputContainer}>
                    <TextInput
                      mode="outlined"
                      label="Medical Specialty"
                      placeholder="e.g., Cardiology, Dermatology"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={!!errors.specialty}
                      left={<TextInput.Icon icon="medical-bag" />}
                      style={styles.input}
                    />
                    {errors.specialty && (
                      <HelperText type="error">
                        {errors.specialty.message}
                      </HelperText>
                    )}
                  </View>
                )}
              />
            )}

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputContainer}>
                  <TextInput
                    mode="outlined"
                    label="Password"
                    placeholder="Enter your password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry={!showPassword}
                    error={!!errors.password}
                    left={<TextInput.Icon icon="lock" />}
                    right={
                      <TextInput.Icon
                        icon={showPassword ? 'eye-off' : 'eye'}
                        onPress={() => setShowPassword(!showPassword)}
                      />
                    }
                    style={styles.input}
                  />
                  {errors.password && (
                    <HelperText type="error">
                      {errors.password.message}
                    </HelperText>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputContainer}>
                  <TextInput
                    mode="outlined"
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry={!showConfirmPassword}
                    error={!!errors.confirmPassword}
                    left={<TextInput.Icon icon="lock-check" />}
                    right={
                      <TextInput.Icon
                        icon={showConfirmPassword ? 'eye-off' : 'eye'}
                        onPress={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      />
                    }
                    style={styles.input}
                  />
                  {errors.confirmPassword && (
                    <HelperText type="error">
                      {errors.confirmPassword.message}
                    </HelperText>
                  )}
                </View>
              )}
            />

            {errors.root && (
              <HelperText type="error" style={styles.errorMessage}>
                {errors.root.message}
              </HelperText>
            )}

            <Button
              title="Create Account"
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
              disabled={isLoading}
              style={styles.registerButton}
            />

            <View style={styles.footer}>
              <Text variant="bodyMedium" style={styles.footerText}>
                Already have an account?{' '}
              </Text>
              <Text
                variant="bodyMedium"
                style={[styles.linkText, { color: theme.colors.primary }]}
                onPress={() => navigation.navigate('Login')}
              >
                Sign In
              </Text>
            </View>
          </View>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    color: colors.textSecondary,
    textAlign: 'center',
  },
  formCard: {
    elevation: 4,
  },
  form: {
    padding: 24,
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
  fieldLabel: {
    marginBottom: 8,
    color: colors.text,
    fontWeight: '500',
  },
  segmentedButtons: {
    marginBottom: 8,
  },
  errorMessage: {
    textAlign: 'center',
    marginBottom: 16,
  },
  registerButton: {
    marginTop: 8,
    marginBottom: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: colors.textSecondary,
  },
  linkText: {
    fontWeight: '600',
  },
});
