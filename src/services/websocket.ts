import { io, Socket } from 'socket.io-client';
import { Middleware } from '@reduxjs/toolkit';
import { appointmentApi } from '../api/appointmentApi';
import { availabilityApi } from '../api/availabilityApi';
import { RootState } from '../app/store';

class WebSocketService {
  private socket: Socket | null = null;
  private store: any = null;

  connect(token: string, store: any) {
    if (this.socket?.connected) return;

    this.store = store;
    this.socket = io('ws://localhost:3000', {
      auth: { token },
      transports: ['websocket'],
    });

    this.setupEventListeners();
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  private setupEventListeners() {
    if (!this.socket || !this.store) return;

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    this.socket.on('disconnect', reason => {
      console.log('WebSocket disconnected:', reason);
      if (reason === 'io server disconnect') {
        // Server disconnected, try to reconnect
        setTimeout(() => this.socket?.connect(), 1000);
      }
    });

    // Appointment events
    this.socket.on('appointment_created', _ => {
      this.store.dispatch(
        appointmentApi.util.invalidateTags([
          { type: 'Appointment', id: 'LIST' },
          { type: 'Appointment', id: 'STATS' },
        ]),
      );
    });

    this.socket.on('appointment_updated', data => {
      const { appointment } = data;

      // Update specific appointment in cache
      this.store.dispatch(
        appointmentApi.util.updateQueryData(
          'getAppointment',
          appointment.id,
          draft => {
            Object.assign(draft.data, appointment);
          },
        ),
      );

      // Invalidate list and stats
      this.store.dispatch(
        appointmentApi.util.invalidateTags([
          { type: 'Appointment', id: 'LIST' },
          { type: 'Appointment', id: 'STATS' },
        ]),
      );
    });

    // Availability events
    this.socket.on('availability_created', _ => {
      this.store.dispatch(
        availabilityApi.util.invalidateTags([
          { type: 'Availability', id: 'LIST' },
        ]),
      );
    });

    this.socket.on('availability_updated', _ => {
      this.store.dispatch(
        availabilityApi.util.invalidateTags([
          { type: 'Availability', id: 'LIST' },
        ]),
      );
    });
  }

  emit(event: string, data: any) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    }
  }
}

export const websocketService = new WebSocketService();

// type KnownActions = ReturnType<typeof loginSuccess> | ReturnType<typeof logout>;

const websocketMiddlewareImpl: Middleware<{}, RootState, any> =
  store => next => (action: any) => {
    const result = next(action);

    // Connect on successful login
    if (action.type === 'auth/loginSuccess') {
      const { token } = action.payload;
      websocketService.connect(token, store);
    }

    // Disconnect on logout
    if (action.type === 'auth/logout') {
      websocketService.disconnect();
    }

    return result;
  };

export const websocketMiddleware: any = websocketMiddlewareImpl;
