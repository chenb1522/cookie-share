import { GM_cookie } from "$";
import type { Cookie } from "../types/cookie";

// Cookie manager service
export const cookieService = {
  // Get all cookies for current page
  getAll(): Promise<Cookie[]> {
    return new Promise((resolve) => {
      GM_cookie.list({}, (cookies: any[]) => {
        resolve(
          cookies.map((cookie) => ({
            name: cookie.name,
            value: cookie.value,
            domain: cookie.domain,
            path: cookie.path || "/",
            secure: cookie.secure,
            sameSite: "Lax" as const,
            hostOnly: cookie.hostOnly,
            httpOnly: cookie.httpOnly,
            session: cookie.session,
            expirationDate: cookie.expirationDate,
          }))
        );
      });
    });
  },

  // Set a single cookie
  set(cookie: Cookie): Promise<void> {
    return new Promise((resolve) => {
      GM_cookie.set(
        {
          name: cookie.name,
          value: cookie.value,
          domain: cookie.domain,
          path: cookie.path || "/",
          secure: cookie.secure,
          httpOnly: cookie.httpOnly || false,
          expirationDate: cookie.expirationDate || undefined,
        },
        resolve
      );
    });
  },

  // Import multiple cookies
  async importCookies(cookies: Cookie[]): Promise<number> {
    let importedCount = 0;
    for (const cookie of cookies) {
      if (cookie?.name && cookie?.value) {
        await this.set(cookie);
        importedCount++;
      }
    }
    return importedCount;
  },

  // Clear all cookies for current page
  clearAll(): Promise<void> {
    return new Promise((resolve) => {
      GM_cookie.list({}, (cookies: any[]) => {
        if (cookies.length === 0) {
          resolve();
          return;
        }

        let deletedCount = 0;
        const totalCookies = cookies.length;

        cookies.forEach((cookie) => {
          GM_cookie.delete(
            {
              name: cookie.name,
              url: window.location.href,
            },
            () => {
              deletedCount++;
              if (deletedCount === totalCookies) {
                resolve();
              }
            }
          );
        });
      });
    });
  },
};
