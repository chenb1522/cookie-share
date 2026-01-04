<script setup lang="ts">
import { ref, watch } from "vue";
import { uiState, formState, actions } from "../store";
import { t } from "../locales";
import SettingsPanel from "./SettingsPanel.vue";

const dialogRef = ref<HTMLDialogElement | null>(null);
const showPassword = ref(false);

// Watch for modal state changes
watch(
  () => uiState.showMainModal,
  (show) => {
    if (show) {
      dialogRef.value?.showModal();
    } else {
      dialogRef.value?.close();
    }
  }
);

const handleServerUrlInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  actions.updateServerUrl(target.value);
};

const handlePasswordInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  actions.updateAdminPassword(target.value);
};

const handleClose = () => {
  actions.closeMainModal();
};
</script>

<template>
  <Teleport to="body">
    <dialog ref="dialogRef" class="modal" @close="handleClose">
      <div class="modal-box bg-base-100 max-w-lg">
        <!-- Close Button -->
        <form method="dialog">
          <button
            class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            ✕
          </button>
        </form>

        <!-- Title -->
        <div class="flex items-center justify-center gap-3 mb-6">
          <h3 class="font-bold text-xl">{{ t("cookieShareTitle") }}</h3>
          <a
            href="https://github.com/fangyuan99/cookie-share"
            target="_blank"
            class="github-link"
            title="GitHub"
          >
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                fill="currentColor"
                d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"
              />
            </svg>
          </a>
        </div>

        <!-- Cookie ID Input -->
        <div class="input-row">
          <input
            v-model="formState.cookieId"
            type="text"
            :placeholder="t('placeholderCookieId')"
            class="input input-bordered flex-1"
          />
          <button
            type="button"
            @click="() => actions.generateId()"
            class="btn btn-secondary btn-fixed"
          >
            {{ t("generateIdButton") }}
          </button>
        </div>

        <!-- Server URL Input -->
        <div class="input-row">
          <input
            :value="formState.serverUrl"
            @input="handleServerUrlInput"
            type="text"
            :placeholder="t('placeholderServerAddress')"
            class="input input-bordered flex-1"
          />
          <button
            type="button"
            @click="actions.openListModal"
            class="btn btn-ghost btn-fixed"
          >
            {{ t("showListButton") }}
          </button>
        </div>

        <!-- Password Input -->
        <div class="input-row">
          <input
            :value="formState.adminPassword"
            @input="handlePasswordInput"
            :type="showPassword ? 'text' : 'password'"
            :placeholder="t('placeholderAdminPassword')"
            class="input input-bordered flex-1"
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="btn btn-ghost btn-icon"
          >
            <!-- Eye / Eye-off icon -->
            <svg
              v-if="!showPassword"
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
                <path
                  d="M2.062 12.348a1 1 0 0 1 0-.696a10.75 10.75 0 0 1 19.876 0a1 1 0 0 1 0 .696a10.75 10.75 0 0 1-19.876 0"
                />
                <circle cx="12" cy="12" r="3" />
              </g>
            </svg>
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
                <path
                  d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575a1 1 0 0 1 0 .696a10.8 10.8 0 0 1-1.444 2.49m-6.41-.679a3 3 0 0 1-4.242-4.242"
                />
                <path
                  d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151a1 1 0 0 1 0-.696a10.75 10.75 0 0 1 4.446-5.143M2 2l20 20"
                />
              </g>
            </svg>
          </button>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3 mb-4">
          <button
            type="button"
            @click="actions.sendCookie"
            :disabled="uiState.isLoading"
            class="btn btn-primary flex-1"
          >
            <span
              v-if="uiState.isLoading"
              class="loading loading-spinner loading-sm"
            ></span>
            {{ t("sendCookieButton") }}
          </button>
          <button
            type="button"
            @click="actions.receiveCookie"
            :disabled="uiState.isLoading"
            class="btn btn-primary flex-1"
          >
            <span
              v-if="uiState.isLoading"
              class="loading loading-spinner loading-sm"
            ></span>
            {{ t("receiveCookieButton") }}
          </button>
        </div>

        <!-- Clear Button -->
        <button
          type="button"
          @click="actions.clearAllCookies"
          :disabled="uiState.isLoading"
          class="btn btn-error w-full mb-4"
        >
          {{ t("clearAllCookiesButton") }}
        </button>

        <!-- Settings -->
        <SettingsPanel />
      </div>

      <!-- Backdrop -->
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  </Teleport>
</template>

<style scoped>
.input-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.btn-fixed {
  width: 5.5rem;
  flex-shrink: 0;
}

.btn-icon {
  width: 5.5rem;
  flex-shrink: 0;
  padding: 0;
}
</style>
