import { ref, computed } from "vue";
import { GM_getValue, GM_setValue } from "$";

// Storage key
const LANGUAGE_KEY = "cookie_share_language_preference";

// Supported languages
export type Language = "en" | "zh";

// Current language state
const currentLanguage = ref<Language>("en");

// Language detection
export const detectLanguage = (): Language => {
  const saved = GM_getValue(LANGUAGE_KEY, null) as Language | null;
  if (saved === "en" || saved === "zh") {
    return saved;
  }

  const browserLang = navigator.language || (navigator as any).userLanguage;
  if (browserLang?.toLowerCase().startsWith("zh")) {
    return "zh";
  }
  return "en";
};

// Initialize language
export const initLanguage = () => {
  currentLanguage.value = detectLanguage();
};

// Set language
export const setLanguage = (lang: Language) => {
  currentLanguage.value = lang;
  GM_setValue(LANGUAGE_KEY, lang);
};

// Toggle language
export const toggleLanguage = () => {
  const newLang = currentLanguage.value === "en" ? "zh" : "en";
  setLanguage(newLang);
  return newLang;
};

// Translations
const translations = {
  en: {
    // General UI
    cookieShareTitle: "Cookie Share",
    cookiesListTitle: "Cookies List",
    confirmDeleteTitle: "Confirm Delete",
    closeButton: "×",
    cancelButton: "Cancel",
    deleteButton: "Delete",
    receiveButton: "Receive",
    showListButton: "Show List",
    showPanelButton: "Show Panel",
    generateIdButton: "Generate ID",
    sendCookieButton: "Send Cookie",
    receiveCookieButton: "Receive Cookie",
    clearAllCookiesButton: "Clear All Cookies",
    sourceLocal: "Local",
    sourceCloud: "Cloud",
    loadingCookies: "Loading cookies...",
    failed: "failed",

    // Placeholders
    placeholderCookieId: "Cookie ID",
    placeholderServerAddress: "Server Address (e.g., https://example.com)",
    placeholderAdminPassword: "Enter admin password",

    // Settings
    settingsShowFloatingButton: "Show Floating Button (Alt+Shift+L)",
    settingsAutoHideFullscreen: "Auto Hide in Fullscreen",
    settingsSaveLocally: "Prefer Local Save",

    // Menu Commands
    menuShowShare: "Show Cookie Share (Alt+Shift+C)",
    menuShowList: "Show Cookie List (Alt+Shift+L)",
    menuSwitchLanguage: "Switch Language (Refresh Required)",

    // Notifications & Messages
    notificationEnterCookieId: "Please enter or generate a Cookie ID",
    notificationNoCookiesToSave: "No cookies to save on the current page",
    notificationSavedLocally: "Cookie saved locally successfully",
    notificationEnterServer: "Please enter the server address",
    notificationSentSuccess: "Sent successfully",
    notificationReceivedSuccess: "Received successfully",
    notificationClearedSuccess:
      "Cookies have been cleared, the page will refresh shortly",
    notificationImportSuccess:
      "Successfully imported {{count}} cookies from local, refreshing soon",
    notificationLocalDataNotFound: "Local cookie data not found",
    notificationLocalDataInvalid: "Local cookie data format invalid",
    notificationLocalImportFailed: "Failed to import any local cookies",
    notificationNeedServerAddress: "Please set the server address first",
    notificationReceiveFailed: "Receive {{source}} cookie failed: {{message}}",
    notificationLocalDeleted: "Local cookie deleted",
    notificationNeedAdminCreds:
      "Deleting cloud cookies requires server address and admin password",
    notificationCloudDeleted: "Cloud cookie deleted",
    notificationDeleteFailed: "Delete {{source}} cookie failed: {{message}}",
    notificationListInitFailed: "Failed to initialize cookie list: {{message}}",
    notificationLoadCloudFailed: "Failed to load cloud cookies: {{message}}",
    notificationLoadLocalFailed: "Failed to load local cookies: {{message}}",
    notificationInvalidPassword: "Invalid admin password",
    notificationAdminPermission:
      "Invalid admin password or insufficient permissions",
    notificationServerDeleteFailed: "Server returned delete failure",
    notificationNetworkError: "Network request failed",
    notificationRequestTimeout: "Request timed out",
    notificationResponseError: "Error processing response: {{message}}",
    confirmDeleteMessage: "Are you sure you want to delete this cookie?",
    listEmpty: "No local or cloud cookies found related to {{host}}",
    listEmptyLocalOnly: "No local cookies found related to {{host}}",

    // API Errors
    apiErrorNoCookiesToSend: "No cookies to send on the current page",
    apiErrorServerReturn: "Server returned error: {{status}} {{text}}",
    apiErrorNetwork: "Network request failed",
    apiErrorTimeout: "Request timeout",
    apiErrorInvalidData: "Invalid data format",
    apiErrorNoImport: "No cookies were successfully imported",
  },
  zh: {
    // General UI
    cookieShareTitle: "Cookie Share",
    cookiesListTitle: "Cookie 列表",
    confirmDeleteTitle: "确认删除",
    closeButton: "×",
    cancelButton: "取消",
    deleteButton: "删除",
    receiveButton: "接收",
    showListButton: "显示列表",
    showPanelButton: "显示面板",
    generateIdButton: "生成 ID",
    sendCookieButton: "发送 Cookie",
    receiveCookieButton: "接收 Cookie",
    clearAllCookiesButton: "清除所有 Cookie",
    sourceLocal: "本地",
    sourceCloud: "云端",
    loadingCookies: "正在加载 Cookie...",
    failed: "失败",

    // Placeholders
    placeholderCookieId: "Cookie ID",
    placeholderServerAddress: "服务器地址 (例如 https://example.com)",
    placeholderAdminPassword: "输入管理密码",

    // Settings
    settingsShowFloatingButton: "显示悬浮按钮 (Alt+Shift+L)",
    settingsAutoHideFullscreen: "全屏时自动隐藏",
    settingsSaveLocally: "优先本地保存",

    // Menu Commands
    menuShowShare: "显示 Cookie 分享面板 (Alt+Shift+C)",
    menuShowList: "显示 Cookie 列表 (Alt+Shift+L)",
    menuSwitchLanguage: "切换语言 (需刷新页面)",

    // Notifications & Messages
    notificationEnterCookieId: "请输入或生成一个 Cookie ID",
    notificationNoCookiesToSave: "当前页面没有可保存的 Cookie",
    notificationSavedLocally: "Cookie 已成功保存到本地",
    notificationEnterServer: "请输入服务器地址",
    notificationSentSuccess: "发送成功",
    notificationReceivedSuccess: "接收成功",
    notificationClearedSuccess: "Cookie 已清除，页面即将刷新",
    notificationImportSuccess: "成功从本地导入 {{count}} 个 Cookie，即将刷新",
    notificationLocalDataNotFound: "本地 Cookie 数据未找到",
    notificationLocalDataInvalid: "本地 Cookie 数据格式无效",
    notificationLocalImportFailed: "未成功导入任何本地 Cookie",
    notificationNeedServerAddress: "请先设置服务器地址",
    notificationReceiveFailed: "接收 {{source}} Cookie 失败: {{message}}",
    notificationLocalDeleted: "本地 Cookie 已删除",
    notificationNeedAdminCreds: "删除云端 Cookie 需要服务器地址和管理密码",
    notificationCloudDeleted: "云端 Cookie 已删除",
    notificationDeleteFailed: "删除 {{source}} Cookie 失败: {{message}}",
    notificationListInitFailed: "初始化 Cookie 列表失败: {{message}}",
    notificationLoadCloudFailed: "加载云端 Cookie 失败: {{message}}",
    notificationLoadLocalFailed: "加载本地 Cookie 失败: {{message}}",
    notificationInvalidPassword: "无效的管理密码",
    notificationAdminPermission: "管理密码无效或权限不足",
    notificationServerDeleteFailed: "服务器返回删除失败",
    notificationNetworkError: "网络请求失败",
    notificationRequestTimeout: "请求超时",
    notificationResponseError: "处理响应时出错: {{message}}",
    confirmDeleteMessage: "您确定要删除此 Cookie 吗？",
    listEmpty: "未找到与 {{host}} 相关的本地或云端 Cookie",
    listEmptyLocalOnly: "未找到与 {{host}} 相关的本地 Cookie",

    // API Errors
    apiErrorNoCookiesToSend: "当前页面无 Cookie 可发送",
    apiErrorServerReturn: "服务器返回错误: {{status}} {{text}}",
    apiErrorNetwork: "网络请求失败",
    apiErrorTimeout: "请求超时",
    apiErrorInvalidData: "无效的数据格式",
    apiErrorNoImport: "未能成功导入任何 Cookie",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

// Translation function
export const t = (
  key: TranslationKey,
  replacements: Record<string, string | number> = {}
): string => {
  const langTranslations = translations[currentLanguage.value];
  let text: string = (langTranslations[key] ||
    translations.en[key] ||
    key) as string;

  for (const [placeholder, value] of Object.entries(replacements)) {
    text = text.replace(
      new RegExp(`{{\\s*${placeholder}\\s*}}`, "g"),
      String(value)
    );
  }

  return text;
};

// Use translation (composable)
export const useI18n = () => {
  return {
    t,
    currentLanguage: computed(() => currentLanguage.value),
    setLanguage,
    toggleLanguage,
  };
};
