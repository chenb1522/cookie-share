import { GM_xmlhttpRequest } from "$";
import { t } from "../locales";
import { cookieService } from "./cookie";

// URL validation utility
const validateUrl = (url: string): string => {
  try {
    let formatted = url;
    if (!/^https?:\/\//i.test(formatted)) {
      formatted = "https://" + formatted;
    }
    formatted = formatted.replace(/\/+$/, "");
    new URL(formatted);
    return formatted;
  } catch {
    throw new Error("Invalid URL format");
  }
};

// API service
export const apiService = {
  // Send cookies to server
  async sendCookies(
    cookieId: string,
    serverUrl: string
  ): Promise<{ success: boolean; message: string }> {
    const cookies = await cookieService.getAll();
    if (!cookies.length) {
      return {
        success: false,
        message: t("notificationNoCookiesToSave"),
      };
    }

    const formattedUrl = validateUrl(serverUrl);
    const data = {
      id: cookieId,
      url: window.location.href,
      cookies: cookies,
    };

    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "POST",
        url: `${formattedUrl}/send-cookies`,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        data: JSON.stringify(data),
        responseType: "json",
        timeout: 10000,
        onload: (response) => {
          if (response.status >= 200 && response.status < 300) {
            resolve({
              success: true,
              message: t("notificationSentSuccess"),
            });
          } else {
            reject(
              new Error(
                t("apiErrorServerReturn", {
                  status: response.status || "?",
                  text: response.responseText || "",
                })
              )
            );
          }
        },
        onerror: () => reject(new Error(t("apiErrorNetwork"))),
        ontimeout: () => reject(new Error(t("apiErrorTimeout"))),
      });
    });
  },

  // Receive cookies from server
  async receiveCookies(
    cookieId: string,
    serverUrl: string
  ): Promise<{ success: boolean; message: string }> {
    const formattedUrl = validateUrl(serverUrl);

    const response = await new Promise<any>((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: `${formattedUrl}/receive-cookies/${cookieId}`,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        responseType: "json",
        timeout: 10000,
        onload: resolve,
        onerror: () => reject(new Error(t("apiErrorNetwork"))),
        ontimeout: () => reject(new Error(t("apiErrorTimeout"))),
      });
    });

    if (
      !response?.response?.success ||
      !Array.isArray(response.response.cookies)
    ) {
      throw new Error(t("apiErrorInvalidData"));
    }

    await cookieService.clearAll();

    const importedCount = await cookieService.importCookies(
      response.response.cookies
    );

    if (importedCount === 0) {
      throw new Error(t("apiErrorNoImport"));
    }

    return {
      success: true,
      message: t("notificationReceivedSuccess"),
    };
  },

  // List cookies by host from cloud
  async listCookiesByHost(
    serverUrl: string,
    host: string,
    password: string
  ): Promise<{ id: string; url?: string }[]> {
    const formattedUrl = validateUrl(serverUrl);

    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: `${formattedUrl}/admin/list-cookies-by-host/${encodeURIComponent(
          host
        )}`,
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Password": password,
        },
        responseType: "text",
        timeout: 10000,
        onload: (res) => {
          if (res.status >= 200 && res.status < 300) {
            try {
              const data = JSON.parse(res.responseText);
              if (data.success && Array.isArray(data.cookies)) {
                resolve(data.cookies);
              } else {
                reject(new Error(data.message || "Failed to parse response"));
              }
            } catch {
              reject(new Error("Invalid response format"));
            }
          } else if (res.status === 401) {
            reject(new Error(t("notificationInvalidPassword")));
          } else {
            reject(new Error(`Server error: ${res.status}`));
          }
        },
        onerror: () => reject(new Error(t("apiErrorNetwork"))),
        ontimeout: () => reject(new Error(t("apiErrorTimeout"))),
      });
    });
  },

  // Delete cookie from cloud
  async deleteCloudCookie(
    serverUrl: string,
    cookieId: string,
    password: string
  ): Promise<void> {
    const formattedUrl = validateUrl(serverUrl);

    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "DELETE",
        url: `${formattedUrl}/admin/delete?key=${encodeURIComponent(cookieId)}`,
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Password": password,
        },
        responseType: "text",
        timeout: 10000,
        onload: (response) => {
          if (response.status === 200 || response.status === 204) {
            resolve();
          } else if (response.status === 401) {
            reject(new Error(t("notificationAdminPermission")));
          } else {
            reject(new Error(t("notificationServerDeleteFailed")));
          }
        },
        onerror: () => reject(new Error(t("notificationNetworkError"))),
        ontimeout: () => reject(new Error(t("notificationRequestTimeout"))),
      });
    });
  },
};
