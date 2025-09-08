import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootState, AppDispatch } from '../app/store';
import { rehydrateAuth } from '../features/auth/authSlice';
import { useGetProfileQuery } from '../api/authApi';
import { AuthNavigator } from './AuthNavigator';
import { DoctorNavigator } from './DoctorNavigator';
import { PatientNavigator } from './PatientNavigator';
import { LoadingOverlay } from '../components/common/LoadingOverlay';

export const AppNavigator: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user, token } = useSelector(
    (state: RootState) => state.auth,
  );
  const [isInitializing, setIsInitializing] = useState(true);

  const { data: profileData, isLoading: isProfileLoading } = useGetProfileQuery(
    undefined,
    {
      skip: !token,
    },
  );

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('authToken');
        if (storedToken && profileData?.data) {
          dispatch(
            rehydrateAuth({
              user: profileData.data,
              token: storedToken,
            }),
          );
        }
      } catch (error) {
        console.error('Failed to rehydrate auth:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    if (!token) {
      setIsInitializing(false);
    } else if (profileData?.data) {
      initializeAuth();
    }
  }, [dispatch, token, profileData]);

  if (isInitializing || isProfileLoading) {
    return <LoadingOverlay />;
  }

  const getNavigator = () => {
    if (!isAuthenticated) {
      return <AuthNavigator />;
    }

    switch (user?.role) {
      case 'doctor':
        return <DoctorNavigator />;
      case 'patient':
        return <PatientNavigator />;
      case 'admin':
        // TODO: Implement admin navigator
        return <DoctorNavigator />;
      default:
        return <AuthNavigator />;
    }
  };

  return <NavigationContainer>{getNavigator()}</NavigationContainer>;
};
