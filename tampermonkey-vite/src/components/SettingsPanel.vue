<script setup lang="ts">
import { settingsState, actions } from "../store";
import { t } from "../locales";
</script>

<template>
  <div class="settings-panel">
    <!-- Show Floating Button Toggle -->
    <div class="setting-item">
      <span class="setting-label">{{ t("settingsShowFloatingButton") }}</span>
      <input
        type="checkbox"
        class="toggle toggle-primary toggle-sm"
        :checked="settingsState.showFloatingButton"
        @change="actions.toggleShowFloatingButton"
      />
    </div>

    <!-- Auto Hide in Fullscreen Toggle -->
    <div class="setting-item">
      <span class="setting-label">{{ t("settingsAutoHideFullscreen") }}</span>
      <input
        type="checkbox"
        class="toggle toggle-primary toggle-sm"
        :checked="settingsState.autoHideFullscreen"
        @change="actions.toggleAutoHideFullscreen"
      />
    </div>

    <!-- Prefer Local Save Toggle -->
    <div class="setting-item">
      <span class="setting-label">{{ t("settingsSaveLocally") }}</span>
      <input
        type="checkbox"
        class="toggle toggle-primary toggle-sm"
        :checked="settingsState.saveLocally"
        @change="actions.toggleSaveLocally"
      />
    </div>
  </div>
</template>

<style scoped>
.settings-panel {
  background-color: var(--color-base-200, #f5f5f5);
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0;
}

.setting-item:not(:last-child) {
  border-bottom: 1px solid var(--color-base-300, #e8e8e8);
}

.setting-label {
  font-size: 0.875rem;
  color: var(--color-base-content, #1f2937);
}
</style>
