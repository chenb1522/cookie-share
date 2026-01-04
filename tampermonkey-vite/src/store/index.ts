import { reactive, ref, computed } from 'vue'
import { storageService } from '../services/storage'
import { cookieService } from '../services/cookie'
import { apiService } from '../services/api'
import type { CookieItem } from '../types/cookie'
import { t } from '../locales'

// UI State
export const uiState = reactive({
  showMainModal: false,
  showListModal: false,
  showConfirmModal: false,
  isLoading: false,
  isFullscreen: false,
})

// Settings State
export const settingsState = reactive({
  serverUrl: storageService.getServerUrl(),
  adminPassword: storageService.getAdminPassword(),
  showFloatingButton: storageService.getShowFloatingButton(),
  autoHideFullscreen: storageService.getAutoHideFullscreen(),
  saveLocally: storageService.getSaveLocally(),
})

// Form State
export const formState = reactive({
  cookieId: '',
  serverUrl: storageService.getServerUrl(),
  adminPassword: storageService.getAdminPassword(),
})

// Cookie List State
export const listState = reactive({
  cookies: [] as CookieItem[],
  isLoading: false,
  error: '',
})

// Notification State
export interface Notification {
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  id: number
}

export const notifications = ref<Notification[]>([])
let notificationId = 0

// Actions
export const actions = {
  // UI Actions
  openMainModal() {
    uiState.showListModal = false
    uiState.showMainModal = true
  },

  closeMainModal() {
    uiState.showMainModal = false
  },

  openListModal() {
    uiState.showMainModal = false
    uiState.showListModal = true
    this.loadCookieList()
  },

  closeListModal() {
    uiState.showListModal = false
  },

  toggleMainModal() {
    if (uiState.showMainModal) {
      this.closeMainModal()
    } else {
      this.openMainModal()
    }
  },

  toggleListModal() {
    if (uiState.showListModal) {
      this.closeListModal()
    } else {
      this.openListModal()
    }
  },

  // Notification Actions
  showNotification(message: string, type: Notification['type'] = 'info') {
    const id = ++notificationId
    notifications.value.push({ message, type, id })

    setTimeout(() => {
      notifications.value = notifications.value.filter((n) => n.id !== id)
    }, 3000)
  },

  // Settings Actions
  updateServerUrl(url: string) {
    const formatted = url.replace(/\/+$/, '')
    formState.serverUrl = formatted
    settingsState.serverUrl = formatted
    storageService.setServerUrl(formatted)
  },

  updateAdminPassword(password: string) {
    formState.adminPassword = password
    settingsState.adminPassword = password
    storageService.setAdminPassword(password)
  },

  toggleShowFloatingButton() {
    settingsState.showFloatingButton = !settingsState.showFloatingButton
    storageService.setShowFloatingButton(settingsState.showFloatingButton)
  },

  toggleAutoHideFullscreen() {
    settingsState.autoHideFullscreen = !settingsState.autoHideFullscreen
    storageService.setAutoHideFullscreen(settingsState.autoHideFullscreen)
  },

  toggleSaveLocally() {
    settingsState.saveLocally = !settingsState.saveLocally
    storageService.setSaveLocally(settingsState.saveLocally)
  },

  // Generate random ID
  generateId(length = 10): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const id = Array.from({ length }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('')
    formState.cookieId = id
    return id
  },

  // Cookie Actions
  async sendCookie() {
    if (!formState.cookieId.trim()) {
      this.showNotification(t('notificationEnterCookieId'), 'error')
      return
    }

    uiState.isLoading = true

    try {
      if (settingsState.saveLocally) {
        // Save locally
        const cookies = await cookieService.getAll()
        if (!cookies.length) {
          this.showNotification(t('notificationNoCookiesToSave'), 'error')
          return
        }

        await storageService.saveLocalCookie({
          id: formState.cookieId,
          url: window.location.href,
          cookies,
        })
        this.showNotification(t('notificationSavedLocally'), 'success')
      } else {
        // Send to server
        if (!formState.serverUrl.trim()) {
          this.showNotification(t('notificationEnterServer'), 'error')
          return
        }

        const result = await apiService.sendCookies(
          formState.cookieId,
          formState.serverUrl
        )
        this.showNotification(result.message, result.success ? 'success' : 'error')
      }
    } catch (error: any) {
      this.showNotification(error.message || t('failed'), 'error')
    } finally {
      uiState.isLoading = false
    }
  },

  async receiveCookie() {
    if (!formState.cookieId.trim()) {
      this.showNotification(t('notificationEnterCookieId'), 'error')
      return
    }

    if (!formState.serverUrl.trim()) {
      this.showNotification(t('notificationEnterServer'), 'error')
      return
    }

    uiState.isLoading = true

    try {
      const result = await apiService.receiveCookies(
        formState.cookieId,
        formState.serverUrl
      )
      this.showNotification(result.message, 'success')
      setTimeout(() => window.location.reload(), 500)
    } catch (error: any) {
      this.showNotification(
        t('notificationReceiveFailed', {
          source: t('sourceCloud'),
          message: error.message,
        }),
        'error'
      )
    } finally {
      uiState.isLoading = false
    }
  },

  async clearAllCookies() {
    uiState.isLoading = true
    try {
      await cookieService.clearAll()
      this.showNotification(t('notificationClearedSuccess'), 'success')
      setTimeout(() => window.location.reload(), 500)
    } catch (error: any) {
      this.showNotification(error.message || t('failed'), 'error')
    } finally {
      uiState.isLoading = false
    }
  },

  // Cookie List Actions
  async loadCookieList() {
    listState.isLoading = true
    listState.error = ''
    listState.cookies = []

    const currentHost = window.location.hostname

    try {
      // Load local cookies
      const localCookies = await storageService.listLocalCookies(currentHost)
      listState.cookies = [...localCookies]

      // Load cloud cookies if server is configured
      if (settingsState.serverUrl && settingsState.adminPassword) {
        try {
          const cloudCookies = await apiService.listCookiesByHost(
            settingsState.serverUrl,
            currentHost,
            settingsState.adminPassword
          )

          for (const cookie of cloudCookies) {
            // Avoid duplicates
            if (!listState.cookies.some((c) => c.id === cookie.id && c.source === 'cloud')) {
              listState.cookies.push({
                id: cookie.id,
                source: 'cloud',
                url: cookie.url,
              })
            }
          }
        } catch (error: any) {
          listState.error = t('notificationLoadCloudFailed', { message: error.message })
        }
      }
    } catch (error: any) {
      listState.error = t('notificationLoadLocalFailed', { message: error.message })
    } finally {
      listState.isLoading = false
    }
  },

  async receiveCookieFromList(cookie: CookieItem) {
    try {
      if (cookie.source === 'local') {
        const data = await storageService.getLocalCookie(cookie.id)
        if (!data) {
          throw new Error(t('notificationLocalDataNotFound'))
        }
        if (!Array.isArray(data.cookies)) {
          throw new Error(t('notificationLocalDataInvalid'))
        }

        await cookieService.clearAll()
        const importedCount = await cookieService.importCookies(data.cookies)

        if (importedCount === 0) {
          throw new Error(t('notificationLocalImportFailed'))
        }

        this.showNotification(
          t('notificationImportSuccess', { count: importedCount }),
          'success'
        )
        setTimeout(() => window.location.reload(), 500)
      } else {
        if (!settingsState.serverUrl) {
          this.showNotification(t('notificationNeedServerAddress'), 'error')
          return
        }

        const result = await apiService.receiveCookies(
          cookie.id,
          settingsState.serverUrl
        )
        this.showNotification(result.message, 'success')
        setTimeout(() => window.location.reload(), 500)
      }

      this.closeListModal()
    } catch (error: any) {
      this.showNotification(
        t('notificationReceiveFailed', {
          source: t(cookie.source === 'local' ? 'sourceLocal' : 'sourceCloud'),
          message: error.message,
        }),
        'error'
      )
    }
  },

  async deleteCookieFromList(cookie: CookieItem) {
    try {
      if (cookie.source === 'local') {
        await storageService.deleteLocalCookie(cookie.id)
        this.showNotification(t('notificationLocalDeleted'), 'success')
      } else {
        if (!settingsState.serverUrl || !settingsState.adminPassword) {
          this.showNotification(t('notificationNeedAdminCreds'), 'error')
          return
        }

        await apiService.deleteCloudCookie(
          settingsState.serverUrl,
          cookie.id,
          settingsState.adminPassword
        )
        this.showNotification(t('notificationCloudDeleted'), 'success')
      }

      // Reload list
      await this.loadCookieList()
    } catch (error: any) {
      this.showNotification(
        t('notificationDeleteFailed', {
          source: t(cookie.source === 'local' ? 'sourceLocal' : 'sourceCloud'),
          message: error.message,
        }),
        'error'
      )
    }
  },

  // Fullscreen handling
  updateFullscreenState() {
    uiState.isFullscreen = !!(
      document.fullscreenElement || (document as any).webkitFullscreenElement
    )
  },
}

// Computed
export const showFloatingButton = computed(() => {
  if (!settingsState.showFloatingButton) return false
  if (uiState.isFullscreen && settingsState.autoHideFullscreen) return false
  return true
})

