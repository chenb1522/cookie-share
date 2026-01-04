<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { GM_registerMenuCommand } from '$'
import { initLanguage, toggleLanguage, t } from './locales'
import { actions } from './store'
import FloatingButton from './components/FloatingButton.vue'
import MainModal from './components/MainModal.vue'
import ListModal from './components/ListModal.vue'
import Notification from './components/Notification.vue'

// Initialize language
initLanguage()

// Keyboard shortcut handler
const handleKeydown = (e: KeyboardEvent) => {
  // Alt + Shift + L for cookie list
  if (e.altKey && e.shiftKey && e.key.toLowerCase() === 'l') {
    e.preventDefault()
    e.stopPropagation()
    actions.toggleListModal()
    return false
  }

  // Alt + Shift + C for cookie share panel
  if (e.altKey && e.shiftKey && e.key.toLowerCase() === 'c') {
    e.preventDefault()
    e.stopPropagation()
    actions.toggleMainModal()
    return false
  }
}

// Fullscreen change handler
const handleFullscreenChange = () => {
  actions.updateFullscreenState()
}

onMounted(() => {
  // Register keyboard shortcuts
  document.addEventListener('keydown', handleKeydown, { capture: true })

  // Register fullscreen handlers
  document.addEventListener('fullscreenchange', handleFullscreenChange)
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange)

  // Register menu commands
  GM_registerMenuCommand(t('menuShowShare'), () => actions.openMainModal())
  GM_registerMenuCommand(t('menuShowList'), () => actions.openListModal())
  GM_registerMenuCommand(t('menuSwitchLanguage'), () => {
    toggleLanguage()
    actions.showNotification(t('menuSwitchLanguage'), 'success')
  })
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
  document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
})
</script>

<template>
  <div data-theme="cookieshare" class="cookie-share-root">
    <FloatingButton />
    <MainModal />
    <ListModal />
    <Notification />
  </div>
</template>

<style>
.cookie-share-root {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
</style>

