import { defineConfig, presetWind3 } from "unocss";

export default defineConfig({
  presets: [presetWind3()],
  // Safelist commonly used classes
  safelist: [
    // Layout
    "fixed",
    "absolute",
    "relative",
    "flex",
    "flex-col",
    "flex-1",
    "items-center",
    "justify-center",
    "justify-between",
    "gap-2",
    "gap-3",
    // Spacing
    "p-3",
    "p-4",
    "py-8",
    "px-4",
    "mb-4",
    "mb-6",
    "mt-6",
    // Sizing
    "w-5",
    "h-5",
    "w-full",
    "max-w-lg",
    "max-w-xl",
    "max-w-sm",
    "max-w-96",
    "min-w-72",
    "max-h-80",
    "overflow-y-auto",
    // Typography
    "text-sm",
    "text-xl",
    "text-lg",
    "text-center",
    "font-bold",
    "font-mono",
    // Visual
    "rounded-lg",
    "shadow-lg",
    "opacity-60",
    // Spacing utilities
    "space-y-2",
    "space-y-3",
  ],
});
