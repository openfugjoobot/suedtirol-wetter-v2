# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-03-08

### Added

#### Foundation
- Svelte 5 project setup with SvelteKit 2
- Tailwind CSS v4 configuration
- TypeScript 5 with strict mode
- Vitest for unit testing
- Playwright for E2E testing

#### Weather System
- Open-Meteo API client
- Current weather display
- Hourly forecast (48 hours)
- Daily forecast (7 days)
- Weather data models and types

#### State Management
- Weather state store
- Location state store  
- Theme state store
- Offline connectivity store

#### UI Components
- Current weather component
- Hourly forecast component
- Daily forecast component
- Location selector
- Header with theme toggle
- Footer with navigation links

#### Internationalization
- German (primary)
- Italian
- English
- Ladin

#### PWA
- Service worker setup
- Manifest configuration
- Offline support

#### Documentation
- README.md
- TECHNICAL.md
- API documentation
- User guide
- Contributing guide

### Technical Details

- **Bundle Size**: Target <100KB (JS) + <30KB (CSS)
- **API**: Open-Meteo (no key required)
- **Storage**: localStorage + IndexedDB
- **Build**: Vite 6 with SvelteKit

### Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| svelte | ^5.0.0 | UI Framework |
| @sveltejs/kit | ^2.0.0 | App Framework |
| tailwindcss | ^4.0.0 | Styling |
| typescript | ^5.0.0 | Type Safety |
| vitest | ^2.0.0 | Unit Testing |
| playwright | ^1.40.0 | E2E Testing |

---

## [Unreleased] - Upcoming Features

### Planned Features

#### Location
- [ ] Complete location search functionality
- [ ] Favorites management UI
- [ ] Location history

#### Weather
- [ ] Precipitation radar
- [ ] Mountain weather view
- [ ] Weather alerts system

#### Settings
- [ ] Settings page
- [ ] Temperature unit toggle
- [ ] Wind speed unit toggle
- [ ] Notification preferences

#### UI/UX
- [ ] Component library expansion (Card, Select, etc.)
- [ ] Animated weather icons
- [ ] Enhanced hourly forecast scroll

### Technical

- [ ] Comprehensive test coverage
- [ ] Performance optimization
- [ ] Accessibility audit
- [ ] SEO optimization
- [ ] Analytics integration

### Deployment

- [ ] Cloudflare Pages config
- [ ] Vercel config
- [ ] Netlify config

---

## Version History

| Version | Date | Status |
|---------|------|--------|
| 0.1.0 | 2026-03-08 | Initial Release |

---

## Upgrading

### From 0.0.x to 0.1.0

This is the first major release. Fresh installation recommended:

```bash
git clone https://github.com/openfugjoobot/suedtirol-wetter-v2.git
cd suedtirol-wetter-v2
npm install
```

---

## Breaking Changes

None yet. This is the initial release.

---

## Deprecations

None yet.

---

## Known Issues

- Location search needs improvement
- No favorites UI yet
- Limited offline functionality for new locations
- No weather alerts

---

*For detailed changes, check the commit history: https://github.com/openfugjoobot/suedtirol-wetter-v2/commits*
