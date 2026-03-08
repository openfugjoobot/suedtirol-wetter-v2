# Südtirol Wetter App V2

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/)
[![Svelte](https://img.shields.io/badge/Svelte-5.0+-ff3e00)](https://svelte.dev/)

A modern weather application for South Tyrol (Südtirol), Italy. Built with Svelte 5, Tailwind CSS v4, and powered by Open-Meteo API.

</div>

## ✨ Features

- 🌤️ **Current Weather** - Real-time weather conditions for your location
- 📅 **7-Day Forecast** - Extended weather predictions  
- 🕒 **Hourly Forecast** - Detailed hour-by-hour breakdown
- 📍 **Location Services** - Automatic location detection with geolocation API
- ⭐ **Favorites** - Save your favorite locations
- 🔄 **Offline Support** - Works offline with service worker caching
- 🌗 **Multi-Language** - German, Italian, English, and Ladin support
- 🎨 **Theme Support** - Light, dark, and OLED modes
- 📱 **Responsive** - Mobile-first design for all devices
- 📲 **PWA** - Install as a native app on your device

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/openfugjoobot/suedtirol-wetter-v2.git
cd suedtirol-wetter-v2

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

## 📖 Documentation

| Document | Description |
|----------|-------------|
| [USER_GUIDE.md](docs/USER_GUIDE.md) | Complete user guide with feature explanations |
| [API.md](docs/API.md) | API documentation for developers |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Contribution guidelines |
| [CHANGELOG.md](CHANGELOG.md) | Version history and changes |
| [TECHNICAL.md](TECHNICAL.md) | Technical architecture documentation |

## 🛠️ Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run check` | Type-check with Svelte and TypeScript |
| `npm run check:watch` | Watch mode for type checking |
| `npm run test` | Run unit tests with Vitest |
| `npm run test:watch` | Watch mode for tests |
| `npm run test:e2e` | Run E2E tests with Playwright |
| `npm run lint` | Run ESLint with auto-fix |

### Project Structure

```
src/
├── lib/
│   ├── api/              # API clients (Open-Meteo)
│   ├── components/       # Svelte components
│   │   ├── ui/           # shadcn-svelte primitives
│   │   ├── weather/      # Weather-specific components
│   │   └── location/     # Location components
│   ├── services/         # Business logic services
│   ├── stores/           # Svelte stores
│   ├── types/            # TypeScript definitions
│   ├── hooks/            # Custom Svelte hooks
│   └── i18n/             # Internationalization
├── routes/               # SvelteKit pages
└── static/              # Static assets
```

## 🌐 Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Svelte | 5.x | UI Framework |
| SvelteKit | 2.x | App Framework |
| Tailwind CSS | 4.x | Styling |
| TypeScript | 5.x | Type Safety |
| TanStack Query | 5.x | Data Fetching |
| Vitest | 2.x | Unit Testing |
| Playwright | 1.x | E2E Testing |
| Vite | 6.x | Build Tool |

## 📡 API

The app uses the free [Open-Meteo API](https://open-meteo.com/):

- ✅ No API key required
- ✅ Fair use policy (reasonable request rates)
- ✅ Data provided by various meteorological agencies

## 🌍 Supported Languages

- 🇩🇪 **German (de)** - Default
- 🇮🇹 **Italian (it)**
- 🇬🇧 **English (en)**
- 🇱🇻 **Ladin (ld)**

## 📱 PWA Installation

### Mobile (iOS)
1. Open in Safari → Tap Share → Add to Home Screen

### Mobile (Android)
1. Open in Chrome → Tap Menu → Install App

### Desktop
1. Chrome/Edge: Click install icon in address bar
2. Firefox: Menu → Install

## 🔧 Building for Production

```bash
npm run build
npm run preview
```

## ☁️ Deployment

This app is designed for static hosting:

- **Cloudflare Pages** - Automatic builds from Git
- **Vercel** - Automatic builds from Git
- **Netlify** - Drag & drop or Git integration

No server-side rendering required - fully client-side.

## 🤝 Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) before submitting PRs.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- Weather data by [Open-Meteo](https://open-meteo.com/)
- Icons from [Lucide](https://lucide.dev/)
- UI primitives from [shadcn-svelte](https://www.shadcn-svelte.com/)

---

<div align="center">

*Built with ❤️ for South Tyrol*

</div>
