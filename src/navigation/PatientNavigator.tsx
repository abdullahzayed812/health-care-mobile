// src/navigation/PatientNavigator.tsx
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from 'react-native-paper';

import { PatientDashboardScreen } from '../screens/patient/DashboardScreen';
import { DoctorSearchScreen } from '../screens/patient/DoctorSearchScreen';
import { ProfileScreen } from '../screens/common/ProfileScreen';
import { colors } from '../styles/colors';
import { PatientAppointmentsScreen } from '../screens/patient/AppointmentsScreen';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const PatientTabNavigator = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // eslint-disable-next-line react/no-unstable-nested-components
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Dashboard':
              iconName = focused ? 'view-dashboard' : 'view-dashboard-outline';
              break;
            case 'FindDoctors':
              iconName = focused ? 'doctor' : 'stethoscope';
              break;
            case 'Appointments':
              iconName = focused
                ? 'calendar-multiple'
                : 'calendar-multiple-check';
              break;
            case 'Profile':
              iconName = focused ? 'account' : 'account-outline';
              break;
            default:
              iconName = 'help';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingVertical: 4,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={PatientDashboardScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen
        name="FindDoctors"
        component={DoctorSearchScreen}
        options={{ title: 'Find Doctors' }}
      />
      <Tab.Screen
        name="Appointments"
        component={PatientAppointmentsScreen}
        options={{ title: 'My Appointments' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

export const PatientNavigator: React.FC = () => {
  const theme = useTheme();

  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.onPrimary,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        drawerStyle: {
          backgroundColor: theme.colors.surface,
        },
        drawerActiveTintColor: theme.colors.primary,
        drawerInactiveTintColor: colors.textSecondary,
      }}
    >
      <Drawer.Screen
        name="PatientTabs"
        component={PatientTabNavigator}
        options={{
          title: 'MediBook Patient',
          drawerLabel: 'Home',
          // eslint-disable-next-line react/no-unstable-nested-components
          drawerIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};
