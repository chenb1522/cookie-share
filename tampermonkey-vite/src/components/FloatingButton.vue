<script setup lang="ts">
import { showFloatingButton, actions } from "../store";
</script>

<template>
  <Transition name="float">
    <button
      v-if="showFloatingButton"
      @click="actions.openListModal"
      class="fixed bottom-5 left-5 z-[2147483645] btn btn-circle btn-sm bg-base-100/95 hover:bg-base-200 border-none shadow-lg backdrop-blur-sm transition-transform hover:scale-110"
      style="pointer-events: auto"
      title="Cookie Share"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        class="w-5 h-5"
      >
        <path
          fill="#91B3A7"
          d="M21.598 13.789c-1.646-.583-2.76-2.145-2.76-3.891 0-.284-.1-.516-.316-.715-.184-.15-.466-.217-.699-.183-1.397.2-2.728-.2-3.743-1.015-1.015-.816-1.73-2.045-1.847-3.476-.017-.25-.167-.483-.383-.633-.217-.133-.483-.167-.732-.067-2.262.815-4.391-.616-5.239-2.562-.167-.366-.549-.566-.949-.482C2.737 1.48-.14 3.485-2.101 6.013c-3.804 4.647-3.354 12.807 2.667 19.527 5.538 5.53 14.48 5.53 20.002 0 2.562-2.562 4.257-6.22 4.257-10.11-.033-.55-.05-.915-.566-1.098z"
        />
        <circle fill="#4A5567" cx="10" cy="12" r="1.5" />
        <circle fill="#4A5567" cx="16" cy="9" r="1.5" />
        <circle fill="#4A5567" cx="14" cy="15" r="1.5" />
      </svg>
    </button>
  </Transition>
</template>

<style scoped>
.float-enter-active,
.float-leave-active {
  transition: all 0.3s ease;
}

.float-enter-from,
.float-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
