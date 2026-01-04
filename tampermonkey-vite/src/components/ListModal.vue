<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { uiState, listState, actions } from "../store";
import { t } from "../locales";
import type { CookieItem } from "../types/cookie";

const dialogRef = ref<HTMLDialogElement | null>(null);
const confirmDialogRef = ref<HTMLDialogElement | null>(null);
const confirmingDelete = ref<CookieItem | null>(null);
const currentHost = computed(() => window.location.hostname);

// Watch for modal state changes
watch(
  () => uiState.showListModal,
  (show) => {
    if (show) {
      dialogRef.value?.showModal();
    } else {
      dialogRef.value?.close();
    }
  }
);

const handleClose = () => {
  actions.closeListModal();
};

const handleReceive = (cookie: CookieItem) => {
  actions.receiveCookieFromList(cookie);
};

const handleDeleteClick = (cookie: CookieItem) => {
  confirmingDelete.value = cookie;
  confirmDialogRef.value?.showModal();
};

const handleConfirmDelete = () => {
  if (confirmingDelete.value) {
    actions.deleteCookieFromList(confirmingDelete.value);
    confirmingDelete.value = null;
    confirmDialogRef.value?.close();
  }
};

const handleCancelDelete = () => {
  confirmingDelete.value = null;
  confirmDialogRef.value?.close();
};
</script>

<template>
  <Teleport to="body">
    <!-- Cookie List Modal -->
    <dialog ref="dialogRef" class="modal" @close="handleClose">
      <div class="modal-box bg-base-100 max-w-xl">
        <!-- Close Button -->
        <form method="dialog">
          <button
            class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            ✕
          </button>
        </form>

        <!-- Title -->
        <h3 class="font-bold text-xl text-center mb-6">
          {{ t("cookiesListTitle") }}
        </h3>

        <!-- Loading State -->
        <div
          v-if="listState.isLoading"
          class="flex items-center justify-center py-8 gap-3"
        >
          <span class="loading loading-spinner loading-md"></span>
          <span class="text-base-content/60">{{ t("loadingCookies") }}</span>
        </div>

        <!-- Error State -->
        <div v-else-if="listState.error" class="alert alert-warning mb-4">
          <svg
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
          <span class="text-sm">{{ listState.error }}</span>
        </div>

        <!-- Cookie List -->
        <div
          v-if="!listState.isLoading"
          class="max-h-80 overflow-y-auto space-y-2"
        >
          <!-- Empty State -->
          <div
            v-if="listState.cookies.length === 0 && !listState.error"
            class="text-center py-8 text-base-content/60"
          >
            {{ t("listEmptyLocalOnly", { host: currentHost }) }}
          </div>

          <!-- Cookie Items -->
          <div
            v-for="cookie in listState.cookies"
            :key="`${cookie.id}-${cookie.source}`"
            class="flex items-center justify-between p-3 bg-base-200 rounded-lg"
          >
            <div class="flex items-center gap-2">
              <span class="font-mono text-sm">{{ cookie.id }}</span>
              <span
                class="badge badge-sm"
                :class="
                  cookie.source === 'local'
                    ? 'badge-secondary'
                    : 'badge-primary'
                "
              >
                {{
                  t(cookie.source === "local" ? "sourceLocal" : "sourceCloud")
                }}
              </span>
            </div>
            <div class="flex gap-2">
              <button
                type="button"
                @click="handleReceive(cookie)"
                class="btn btn-sm btn-primary"
              >
                {{ t("receiveButton") }}
              </button>
              <button
                type="button"
                @click="handleDeleteClick(cookie)"
                class="btn btn-sm btn-error"
              >
                {{ t("deleteButton") }}
              </button>
            </div>
          </div>
        </div>

        <!-- Show Panel Button -->
        <div class="mt-6 flex justify-center">
          <button
            type="button"
            @click="actions.openMainModal"
            class="btn btn-ghost"
          >
            {{ t("showPanelButton") }}
          </button>
        </div>
      </div>

      <!-- Backdrop -->
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>

    <!-- Delete Confirmation Modal -->
    <dialog ref="confirmDialogRef" class="modal">
      <div class="modal-box bg-base-100 max-w-sm">
        <h3 class="font-bold text-lg text-center mb-4">
          {{ t("confirmDeleteTitle") }}
        </h3>
        <p class="text-center text-base-content/70 mb-6">
          {{ t("confirmDeleteMessage") }}
        </p>
        <div class="flex gap-3 justify-center">
          <button
            type="button"
            @click="handleCancelDelete"
            class="btn btn-ghost"
          >
            {{ t("cancelButton") }}
          </button>
          <button
            type="button"
            @click="handleConfirmDelete"
            class="btn btn-error"
          >
            {{ t("deleteButton") }}
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button @click="handleCancelDelete">close</button>
      </form>
    </dialog>
  </Teleport>
</template>
