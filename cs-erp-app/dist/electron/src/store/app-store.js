"use strict";
/**
 * Global Application Store
 * Zustand store with performance monitoring and notifications
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePerformanceTracker = exports.usePerformance = exports.useSettings = exports.useUnreadCount = exports.useNotifications = exports.useCompany = exports.useUser = exports.useAppStore = void 0;
const zustand_1 = require("zustand");
const middleware_1 = require("zustand/middleware");
const defaultSettings = {
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
const defaultPerformance = {
    apiCalls: 0,
    averageResponseTime: 0,
    errorCount: 0,
    lastUpdated: new Date(),
};
exports.useAppStore = (0, zustand_1.create)()((0, middleware_1.devtools)((0, middleware_1.persist)((set, get) => ({
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
        const newNotification = {
            ...notification,
            id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date(),
            read: false,
        };
        set((state) => ({
            notifications: [newNotification, ...state.notifications].slice(0, 50), // Keep only last 50
            unreadCount: state.unreadCount + 1,
        }), false, 'addNotification');
        // Auto-remove success notifications after 5 seconds
        if (notification.type === 'success') {
            setTimeout(() => {
                get().removeNotification(newNotification.id);
            }, 5000);
        }
    },
    markNotificationRead: (id) => {
        set((state) => ({
            notifications: state.notifications.map((n) => n.id === id ? { ...n, read: true } : n),
            unreadCount: Math.max(0, state.unreadCount - 1),
        }), false, 'markNotificationRead');
    },
    clearNotifications: () => {
        set({ notifications: [], unreadCount: 0 }, false, 'clearNotifications');
    },
    removeNotification: (id) => {
        set((state) => {
            const notification = state.notifications.find((n) => n.id === id);
            const wasUnread = notification && !notification.read;
            return {
                notifications: state.notifications.filter((n) => n.id !== id),
                unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
            };
        }, false, 'removeNotification');
    },
    // Settings actions
    updateSettings: (newSettings) => {
        set((state) => ({
            settings: { ...state.settings, ...newSettings },
        }), false, 'updateSettings');
    },
    // Performance tracking
    updatePerformance: (metrics) => {
        set((state) => ({
            performance: {
                ...state.performance,
                ...metrics,
                lastUpdated: new Date(),
            },
        }), false, 'updatePerformance');
    },
    recordApiCall: (responseTime, isError = false) => {
        set((state) => {
            const newApiCalls = state.performance.apiCalls + 1;
            const newAverageResponseTime = (state.performance.averageResponseTime * state.performance.apiCalls + responseTime) / newApiCalls;
            return {
                performance: {
                    ...state.performance,
                    apiCalls: newApiCalls,
                    averageResponseTime: newAverageResponseTime,
                    errorCount: state.performance.errorCount + (isError ? 1 : 0),
                    lastUpdated: new Date(),
                },
            };
        }, false, 'recordApiCall');
    },
    // Utility methods
    reset: () => {
        set({
            user: null,
            company: null,
            isAuthenticated: false,
            sidebarOpen: true,
            loading: false,
            notifications: [],
            unreadCount: 0,
            settings: defaultSettings,
            performance: defaultPerformance,
        }, false, 'reset');
    },
}), {
    name: 'cs-erp-app-storage',
    partialize: (state) => ({
        settings: state.settings,
        sidebarOpen: state.sidebarOpen,
        // Don't persist sensitive data like user info
    }),
}), {
    name: 'CS-ERP-Store',
}));
// Selector hooks for better performance
const useUser = () => (0, exports.useAppStore)((state) => state.user);
exports.useUser = useUser;
const useCompany = () => (0, exports.useAppStore)((state) => state.company);
exports.useCompany = useCompany;
const useNotifications = () => (0, exports.useAppStore)((state) => state.notifications);
exports.useNotifications = useNotifications;
const useUnreadCount = () => (0, exports.useAppStore)((state) => state.unreadCount);
exports.useUnreadCount = useUnreadCount;
const useSettings = () => (0, exports.useAppStore)((state) => state.settings);
exports.useSettings = useSettings;
const usePerformance = () => (0, exports.useAppStore)((state) => state.performance);
exports.usePerformance = usePerformance;
// Performance monitoring hook
const usePerformanceTracker = () => {
    const recordApiCall = (0, exports.useAppStore)((state) => state.recordApiCall);
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
exports.usePerformanceTracker = usePerformanceTracker;
