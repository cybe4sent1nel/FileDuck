<template>
  <div class="fixed top-4 right-4 z-[9999] space-y-2 max-w-md">
    <TransitionGroup name="notification">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        role="alert"
        :class="[
          'border-l-4 p-4 rounded-lg shadow-xl flex items-start transition duration-300 ease-in-out transform hover:scale-105',
          getNotificationClasses(notification.type)
        ]"
      >
        <component
          :is="getIcon(notification.type)"
          class="h-5 w-5 flex-shrink-0 mr-3 mt-0.5"
          :class="getIconColor(notification.type)"
        />
        <div class="flex-1 mr-3">
          <p class="text-sm font-semibold">{{ notification.message }}</p>
          <div v-if="notification.action" class="mt-3 flex gap-2">
            <button
              @click="notification.action.callback"
              class="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-bold text-sm"
            >
              {{ notification.action.label }}
            </button>
            <button
              v-if="notification.type === 'warning'"
              @click="handleCancel(notification)"
              class="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-bold text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
        <button
          @click="handleCancel(notification)"
          class="flex-shrink-0 ml-auto hover:scale-110 transition-transform"
        >
          <XIcon class="h-4 w-4" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { CheckCircleIcon, InfoIcon, AlertTriangleIcon, XCircleIcon, XIcon } from 'lucide-vue-next';
import { useNotifications, type NotificationType } from '../composables/useNotifications';

const { notifications, removeNotification } = useNotifications();

const handleCancel = (notification: any) => {
  if (notification.onCancel) {
    notification.onCancel();
  } else {
    removeNotification(notification.id);
  }
};

const getNotificationClasses = (type: NotificationType): string => {
  const baseClasses = 'bg-opacity-95 backdrop-blur-sm';
  
  switch (type) {
    case 'success':
      return `${baseClasses} bg-green-100 dark:bg-green-900 border-green-500 dark:border-green-700 text-green-900 dark:text-green-100`;
    case 'info':
      return `${baseClasses} bg-blue-100 dark:bg-blue-900 border-blue-500 dark:border-blue-700 text-blue-900 dark:text-blue-100`;
    case 'warning':
      return `${baseClasses} bg-yellow-100 dark:bg-yellow-900 border-yellow-500 dark:border-yellow-700 text-yellow-900 dark:text-yellow-100`;
    case 'error':
      return `${baseClasses} bg-red-100 dark:bg-red-900 border-red-500 dark:border-red-700 text-red-900 dark:text-red-100`;
    default:
      return `${baseClasses} bg-gray-100 dark:bg-gray-900 border-gray-500 dark:border-gray-700 text-gray-900 dark:text-gray-100`;
  }
};

const getIcon = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return CheckCircleIcon;
    case 'info':
      return InfoIcon;
    case 'warning':
      return AlertTriangleIcon;
    case 'error':
      return XCircleIcon;
    default:
      return InfoIcon;
  }
};

const getIconColor = (type: NotificationType): string => {
  switch (type) {
    case 'success':
      return 'text-green-600';
    case 'info':
      return 'text-blue-600';
    case 'warning':
      return 'text-yellow-600';
    case 'error':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100px) scale(0.8);
}
</style>
