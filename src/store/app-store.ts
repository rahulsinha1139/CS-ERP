/**
 * Global Application Store
 * Zustand store with performance monitoring and notifications
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'ADMIN' | 'USER' | 'VIEWER';
  companyId: string;
}

export interface Company {
  id: string;
  name: string;
  email: string;
  gstin?: string;
  stateCode?: string;
}

export interface AppSettings {
  theme: 'light' | 'dark';
  currency: 'INR';
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  language: 'en-IN' | 'en-US';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

export interface PerformanceMetrics {
  apiCalls: number;
  averageResponseTime: number;
  errorCount: number;
  lastUpdated: Date;
}

export interface AppState {
  // User and Authentication
  user: User | null;
  company: Company | null;
  isAuthenticated: boolean;

  // UI State
  sidebarOpen: boolean;
  loading: boolean;

  // Notifications
  notifications: Notification[];
  unreadCount: number;

  // Settings
  settings: AppSettings;

  // Performance Tracking
  performance: PerformanceMetrics;

  // Actions
  setUser: (user: User | null) => void;
  setCompany: (company: Company | null) => void;
  setAuthenticated: (authenticated: boolean) => void;

  toggleSidebar: () => void;
  setLoading: (loading: boolean) => void;

  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  removeNotification: (id: string) => void;

  updateSettings: (settings: Partial<AppSettings>) => void;

  updatePerformance: (metrics: Partial<PerformanceMetrics>) => void;
  recordApiCall: (responseTime: number, isError?: boolean) => void;

  // Utility methods
  reset: () => void;
}

const defaultSettings: AppSettings = {
  theme: 'light',
  currency: 'INR',
  dateFormat: 'DD/MM/YYYY',
  language: 'en-IN',
  notifications: {
    email: true,
    push: true,
    sms: false,
  },
};

const defaultPerformance: PerformanceMetrics = {
  apiCalls: 0,
  averageResponseTime: 0,
  errorCount: 0,
  lastUpdated: new Date(),
};

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        company: null,
        isAuthenticated: false,
        sidebarOpen: true,
        loading: false,
        notifications: [],
        unreadCount: 0,
        settings: defaultSettings,
        performance: defaultPerformance,

        // User and Authentication actions
        setUser: (user) => {
          set({ user }, false, 'setUser');
        },

        setCompany: (company) => {
          set({ company }, false, 'setCompany');
        },

        setAuthenticated: (authenticated) => {
          set({ isAuthenticated: authenticated }, false, 'setAuthenticated');
        },

        // UI actions
        toggleSidebar: () => {
          set((state) => ({ sidebarOpen: !state.sidebarOpen }), false, 'toggleSidebar');
        },

        setLoading: (loading) => {
          set({ loading }, false, 'setLoading');
        },

        // Notification actions
        addNotification: (notification) => {
          const newNotification: Notification = {
            ...notification,
            id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date(),
            read: false,
          };

          set(
            (state) => ({
              notifications: [newNotification, ...state.notifications].slice(0, 50), // Keep only last 50
              unreadCount: state.unreadCount + 1,
            }),
            false,
            'addNotification'
          );

          // Auto-remove success notifications after 5 seconds
          if (notification.type === 'success') {
            setTimeout(() => {
              get().removeNotification(newNotification.id);
            }, 5000);
          }
        },

        markNotificationRead: (id) => {
          set(
            (state) => ({
              notifications: state.notifications.map((n) =>
                n.id === id ? { ...n, read: true } : n
              ),
              unreadCount: Math.max(0, state.unreadCount - 1),
            }),
            false,
            'markNotificationRead'
          );
        },

        clearNotifications: () => {
          set({ notifications: [], unreadCount: 0 }, false, 'clearNotifications');
        },

        removeNotification: (id) => {
          set(
            (state) => {
              const notification = state.notifications.find((n) => n.id === id);
              const wasUnread = notification && !notification.read;

              return {
                notifications: state.notifications.filter((n) => n.id !== id),
                unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
              };
            },
            false,
            'removeNotification'
          );
        },

        // Settings actions
        updateSettings: (newSettings) => {
          set(
            (state) => ({
              settings: { ...state.settings, ...newSettings },
            }),
            false,
            'updateSettings'
          );
        },

        // Performance tracking
        updatePerformance: (metrics) => {
          set(
            (state) => ({
              performance: {
                ...state.performance,
                ...metrics,
                lastUpdated: new Date(),
              },
            }),
            false,
            'updatePerformance'
          );
        },

        recordApiCall: (responseTime, isError = false) => {
          set(
            (state) => {
              const newApiCalls = state.performance.apiCalls + 1;
              const newAverageResponseTime =
                (state.performance.averageResponseTime * state.performance.apiCalls + responseTime) / newApiCalls;

              return {
                performance: {
                  ...state.performance,
                  apiCalls: newApiCalls,
                  averageResponseTime: newAverageResponseTime,
                  errorCount: state.performance.errorCount + (isError ? 1 : 0),
                  lastUpdated: new Date(),
                },
              };
            },
            false,
            'recordApiCall'
          );
        },

        // Utility methods
        reset: () => {
          set(
            {
              user: null,
              company: null,
              isAuthenticated: false,
              sidebarOpen: true,
              loading: false,
              notifications: [],
              unreadCount: 0,
              settings: defaultSettings,
              performance: defaultPerformance,
            },
            false,
            'reset'
          );
        },
      }),
      {
        name: 'cs-erp-app-storage',
        partialize: (state) => ({
          settings: state.settings,
          sidebarOpen: state.sidebarOpen,
          // Don't persist sensitive data like user info
        }),
      }
    ),
    {
      name: 'CS-ERP-Store',
    }
  )
);

// Selector hooks for better performance
export const useUser = () => useAppStore((state) => state.user);
export const useCompany = () => useAppStore((state) => state.company);
export const useNotifications = () => useAppStore((state) => state.notifications);
export const useUnreadCount = () => useAppStore((state) => state.unreadCount);
export const useSettings = () => useAppStore((state) => state.settings);
export const usePerformance = () => useAppStore((state) => state.performance);

// Performance monitoring hook
export const usePerformanceTracker = () => {
  const recordApiCall = useAppStore((state) => state.recordApiCall);

  return {
    startApiCall: () => {
      const startTime = performance.now();

      return {
        end: (isError = false) => {
          const endTime = performance.now();
          const responseTime = endTime - startTime;
          recordApiCall(responseTime, isError);
          return responseTime;
        },
      };
    },
  };
};
