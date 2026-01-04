import { createApp } from "vue";
import App from "./App.vue";
import "virtual:uno.css";
import "@unocss/reset/tailwind.css";
import "./styles/daisyui.css";

// Only run in top frame
if (window.self === window.top) {
  // Create container
  const container = document.createElement("div");
  container.id = "cookie-share-container";
  container.style.cssText =
    "position: fixed; z-index: 2147483640; pointer-events: none;";
  document.body.appendChild(container);

  // Mount app
  const app = createApp(App);
  app.mount(container);
}
