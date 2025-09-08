import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from '../api/authApi';
import { appointmentApi } from '../api/appointmentApi';
import { doctorApi } from '../api/doctorApi';
import { availabilityApi } from '../api/availabilityApi';
import { userApi } from '../api/userApi';
import authReducer from '../features/auth/authSlice';
import { websocketMiddleware } from '../services/websocket';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [appointmentApi.reducerPath]: appointmentApi.reducer,
    [doctorApi.reducerPath]: doctorApi.reducer,
    [availabilityApi.reducerPath]: availabilityApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    })
      .concat(authApi.middleware)
      .concat(appointmentApi.middleware)
      .concat(doctorApi.middleware)
      .concat(availabilityApi.middleware)
      .concat(userApi.middleware)
      .concat(websocketMiddleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
