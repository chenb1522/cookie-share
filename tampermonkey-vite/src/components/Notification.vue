<script setup lang="ts">
import { notifications } from "../store";

const getAlertClass = (type: string) => {
  const classes: Record<string, string> = {
    success: "alert-success",
    error: "alert-error",
    warning: "alert-warning",
    info: "alert-info",
  };
  return classes[type] || "alert-info";
};
</script>

<template>
  <div class="notification-container">
    <TransitionGroup name="notification">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="alert shadow-lg min-w-72 max-w-96"
        :class="getAlertClass(notification.type)"
      >
        <!-- Success Icon -->
        <svg
          v-if="notification.type === 'success'"
          class="w-5 h-5"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          >
            <path d="M21.801 10A10 10 0 1 1 17 3.335" />
            <path d="m9 11l3 3L22 4" />
          </g>
        </svg>
        <!-- Error Icon -->
        <svg
          v-else-if="notification.type === 'error'"
          class="w-5 h-5"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="m15 9l-6 6m0-6l6 6" />
          </g>
        </svg>
        <!-- Warning Icon -->
        <svg
          v-else-if="notification.type === 'warning'"
          class="w-5 h-5"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m21.73 18l-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3M12 9v4m0 4h.01"
          />
        </svg>
        <!-- Info Icon -->
        <svg
          v-else
          class="w-5 h-5"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4m0-4h.01" />
          </g>
        </svg>
        <span class="text-sm">{{ notification.message }}</span>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.notification-container {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 2147483647;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  pointer-events: auto;
}

.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
