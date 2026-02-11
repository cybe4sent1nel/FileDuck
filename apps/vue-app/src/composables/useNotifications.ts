/**
 * In-App Notification System
 * Replaces all browser alerts with beautiful in-app notifications
 */

import { ref, readonly } from 'vue';

export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
  action?: {
    label: string;
    callback: () => void;
  };
}

const notifications = ref<Notification[]>([]);

let notificationId = 0;

export function useNotifications() {
  const addNotification = (
    type: NotificationType,
    message: string,
    duration: number = 5000,
    action?: { label: string; callback: () => void }
  ): string => {
    const id = `notification-${++notificationId}`;
    
    notifications.value.push({
      id,
      type,
      message,
      duration,
      action,
    });

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  };

  const removeNotification = (id: string) => {
    notifications.value = notifications.value.filter((n) => n.id !== id);
  };

  const success = (message: string, duration?: number) => {
    return addNotification('success', message, duration);
  };

  const info = (message: string, duration?: number) => {
    return addNotification('info', message, duration);
  };

  const warning = (message: string, duration?: number) => {
    return addNotification('warning', message, duration);
  };

  const error = (message: string, duration?: number) => {
    return addNotification('error', message, duration);
  };

  const confirm = (message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const id = addNotification(
        'warning',
        message,
        0, // Don't auto-dismiss
        {
          label: 'OK',
          callback: () => {
            removeNotification(id);
            resolve(true);
          },
        }
      );

      // Store cancel handler for X button
      const notification = notifications.value.find((n) => n.id === id);
      if (notification) {
        const originalRemove = () => {
          removeNotification(id);
          resolve(false);
        };
        // Intercept removal to handle cancel
        (notification as any).onCancel = originalRemove;
      }
    });
  };

  const clear = () => {
    notifications.value = [];
  };

  return {
    notifications: readonly(notifications),
    addNotification,
    removeNotification,
    success,
    info,
    warning,
    error,
    confirm,
    clear,
  };
}
