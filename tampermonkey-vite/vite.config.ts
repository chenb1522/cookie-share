import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import monkey from "vite-plugin-monkey";
import UnoCSS from "unocss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    UnoCSS(),
    monkey({
      entry: "src/main.ts",
      userscript: {
        name: "Cookie Share",
        namespace: "https://github.com/fangyuan99/cookie-share",
        version: "0.2.3",
        description: "Sends and receives cookies with your friends",
        author: "fangyuan99,aBER",
        icon: "https://raw.githubusercontent.com/fangyuan99/cookie-share/main/chrome/images/icons/icon-48.png",
        match: ["*://*/*"],
        grant: [
          "GM_getValue",
          "GM_setValue",
          "GM_listValues",
          "GM_deleteValue",
          "GM_xmlhttpRequest",
          "GM_addStyle",
          "GM_registerMenuCommand",
          "GM_cookie",
        ],
        connect: ["*"],
        updateURL:
          "https://github.com/fangyuan99/cookie-share/raw/refs/heads/main/tampermonkey-vite/dist/cookie-share.user.js",
      },
      build: {
        fileName: "cookie-share.user.js",
      },
    }),
  ],
});
