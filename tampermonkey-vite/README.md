# Cookie Share - Vite + Vue 3 + TypeScript

A modern rewrite of Cookie Share userscript using:
- **vite-plugin-monkey** - Vite plugin for Tampermonkey userscript development
- **Vue 3** - Progressive JavaScript framework with Composition API
- **TypeScript** - Type-safe JavaScript
- **UnoCSS** - Instant on-demand atomic CSS engine (Tailwind CSS compatible)
- **DaisyUI** - Beautiful UI component library

## Project Structure

```
tampermonkey-vite/
├── src/
│   ├── components/        # Vue UI components
│   │   ├── FloatingButton.vue   # Floating button on page
│   │   ├── MainModal.vue        # Main control panel
│   │   ├── ListModal.vue        # Cookie list modal
│   │   ├── SettingsPanel.vue    # Settings toggles
│   │   └── Notification.vue     # Toast notifications
│   ├── locales/           # i18n translations
│   │   └── index.ts       # English & Chinese translations
│   ├── services/          # Business logic services
│   │   ├── api.ts         # Server API communication
│   │   ├── cookie.ts      # Cookie CRUD operations
│   │   └── storage.ts     # GM storage wrapper
│   ├── store/             # State management
│   │   └── index.ts       # Reactive state & actions
│   ├── styles/            # CSS styles
│   │   └── daisyui.css    # DaisyUI component styles
│   ├── types/             # TypeScript types
│   │   └── cookie.ts      # Cookie type definitions
│   ├── App.vue            # Root component
│   ├── main.ts            # Entry point
│   └── vite-env.d.ts      # TypeScript declarations
├── dist/
│   └── cookie-share.user.js   # Built userscript
├── uno.config.ts          # UnoCSS configuration
├── vite.config.ts         # Vite configuration
├── package.json
└── README.md
```

## Development

```bash
# Install dependencies
pnpm install

# Start development server (with hot reload)
pnpm dev

# Build for production
pnpm build
```

## Features

- 🍪 Send and receive cookies between browsers
- 💾 Save cookies locally or to cloud server
- 🌐 Multi-language support (English & Chinese)
- 🎨 Beautiful modern UI with DaisyUI
- ⌨️ Keyboard shortcuts (Alt+Shift+C, Alt+Shift+L)
- 🔒 Admin password protection for cloud operations
- 📱 Responsive design

## Keyboard Shortcuts

- `Alt + Shift + C` - Toggle Cookie Share panel
- `Alt + Shift + L` - Toggle Cookie List

## Architecture

The codebase is organized with clear separation of concerns:

### Services (Business Logic)
- `cookie.ts` - GM_cookie wrapper for cookie operations
- `api.ts` - Server communication for cloud sync
- `storage.ts` - GM_getValue/setValue wrapper for settings

### Store (State Management)
- Reactive state using Vue 3 `reactive()` and `ref()`
- Actions for UI state, settings, and cookie operations
- Computed properties for derived state

### Components (UI)
- Pure presentation components
- No direct service calls, use store actions
- DaisyUI classes for styling

### Locales (i18n)
- Type-safe translation keys
- Runtime language switching
- Browser language detection

## License

MIT
