import { GM_getValue, GM_setValue, GM_listValues, GM_deleteValue } from "$";
import type { CookieData, CookieItem } from "../types/cookie";

// Storage keys
export const STORAGE_KEYS = {
  CUSTOM_URL: "cookie_share_custom_url",
  ADMIN_PASSWORD: "cookie_share_admin_password",
  SHOW_FLOATING_BUTTON: "cookie_share_show_floating_button",
  AUTO_HIDE_FULLSCREEN: "cookie_share_auto_hide_fullscreen",
  SAVE_LOCALLY: "cookie_share_save_locally",
  LANGUAGE_PREFERENCE: "cookie_share_language_preference",
} as const;

// Local cookie storage prefix
const LOCAL_COOKIE_PREFIX = "cookie_share_local_";

// Storage service
export const storageService = {
  // Get value
  get<T>(key: string, defaultValue: T): T {
    return GM_getValue(key, defaultValue);
  },

  // Set value
  set<T>(key: string, value: T): void {
    GM_setValue(key, value);
  },

  // Settings getters/setters
  getServerUrl(): string {
    return this.get(STORAGE_KEYS.CUSTOM_URL, "");
  },

  setServerUrl(url: string): void {
    this.set(STORAGE_KEYS.CUSTOM_URL, url.replace(/\/+$/, ""));
  },

  getAdminPassword(): string {
    return this.get(STORAGE_KEYS.ADMIN_PASSWORD, "");
  },

  setAdminPassword(password: string): void {
    this.set(STORAGE_KEYS.ADMIN_PASSWORD, password);
  },

  getShowFloatingButton(): boolean {
    return this.get(STORAGE_KEYS.SHOW_FLOATING_BUTTON, true);
  },

  setShowFloatingButton(show: boolean): void {
    this.set(STORAGE_KEYS.SHOW_FLOATING_BUTTON, show);
  },

  getAutoHideFullscreen(): boolean {
    return this.get(STORAGE_KEYS.AUTO_HIDE_FULLSCREEN, true);
  },

  setAutoHideFullscreen(hide: boolean): void {
    this.set(STORAGE_KEYS.AUTO_HIDE_FULLSCREEN, hide);
  },

  getSaveLocally(): boolean {
    return this.get(STORAGE_KEYS.SAVE_LOCALLY, false);
  },

  setSaveLocally(local: boolean): void {
    this.set(STORAGE_KEYS.SAVE_LOCALLY, local);
  },

  // Local cookie storage
  async saveLocalCookie(data: CookieData): Promise<void> {
    const key = `${LOCAL_COOKIE_PREFIX}${data.id}`;
    GM_setValue(key, JSON.stringify(data));
  },

  async getLocalCookie(id: string): Promise<CookieData | null> {
    const key = `${LOCAL_COOKIE_PREFIX}${id}`;
    const raw = GM_getValue(key, null);
    if (!raw) return null;
    try {
      return JSON.parse(raw as string);
    } catch {
      return null;
    }
  },

  async deleteLocalCookie(id: string): Promise<void> {
    const key = `${LOCAL_COOKIE_PREFIX}${id}`;
    GM_deleteValue(key);
  },

  async listLocalCookies(host: string): Promise<CookieItem[]> {
    const allKeys = GM_listValues();
    const localKeys = allKeys.filter((key) =>
      key.startsWith(LOCAL_COOKIE_PREFIX)
    );
    const result: CookieItem[] = [];

    for (const key of localKeys) {
      try {
        const raw = GM_getValue(key, null);
        if (raw) {
          const data = JSON.parse(raw as string) as CookieData;
          let cookieHost = "";
          try {
            cookieHost = new URL(data.url).hostname;
          } catch {
            continue;
          }

          if (cookieHost === host) {
            result.push({
              id: data.id,
              source: "local",
              url: data.url,
              cookies: data.cookies,
            });
          }
        }
      } catch {
        continue;
      }
    }

    return result;
  },
};
