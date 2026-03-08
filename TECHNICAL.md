# Südtirol Wetter App V2 - Technical Documentation

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                       │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌──────────┐ │
│  │   Pages     │ │ Components  │ │   Layouts   │ │  Themes  │ │
│  │  (Routes)   │ │  (UI/UX)    │ │ (Structure) │ │  (CSS)   │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └──────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       APPLICATION LAYER                          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌──────────┐ │
│  │   State     │ │  Business   │ │  Services   │ │  Hooks   │ │
│  │  (Runes)    │ │   Logic     │ │  (Coord)    │ │(Utilities)│
│  └─────────────┘ └─────────────┘ └─────────────┘ └──────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                          DATA LAYER                              │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌──────────┐ │
│  │ API Clients │ │   Cache     │ │  Storage    │ │Transforms│ │
│  │ (Fetch)     │ │ (TanStack)  │ │ (IDB/LS)    │ │ (Data)   │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └──────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      INFRASTRUCTURE LAYER                        │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌──────────┐ │
│  │  Service    │ │   PWA       │ │   Build     │ │  i18n    │ │
│  │  Worker     │ │  Manifest   │ │   Config    │ │ (Lang)   │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └──────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Key Files

### Configuration

| File | Purpose |
|------|---------|
| `package.json` | Project dependencies and scripts |
| `svelte.config.js` | SvelteKit configuration |
| `tailwind.config.js` | Tailwind CSS configuration |
| `vite.config.ts` | Vite build configuration |
| `tsconfig.json` | TypeScript configuration |
| `vite.config.ts` | Vitest test configuration |

### Source Files

| Directory | Purpose |
|-----------|---------|
| `src/lib/components/ui/` | shadcn-svelte UI primitives |
| `src/lib/components/weather/` | Weather-specific components |
| `src/lib/components/location/` | Location management components |
| `src/lib/api/` | API clients (Open-Meteo) |
| `src/lib/services/` | Business logic services |
| `src/lib/stores/` | Svelte state stores |
| `src/lib/queries/` | TanStack Query definitions |
| `src/lib/types/` | TypeScript type definitions |
| `src/lib/hooks/` | Custom Svelte hooks |
| `src/lib/i18n/` | Internationalization |

### Data Flow

1. **UserAction** → **Route** → **Component**
2. **Component** → **Store** → **Service** → **API Client**
3. **API Client** → **Open-Meteo API** → **Data Transform** → **Store**
4. **Store** → **Component** → **UI**

## State Management

### Svelte 5 Runes

```typescript
// Local component state
let count = $state(0);
let isLoading = $state(false);

// Derived state
let doubled = $derived(count * 2);

// Side effects
$effect(() => {
  console.log('Count changed:', count);
});
```

### Stores

| Store | Purpose |
|-------|---------|
| `weatherStore` | Weather data state |
| `locationStore` | Location management |
| `offlineStore` | Network connectivity |
| `themeStore` | Theme preferences |

## API Integration

### Open-Meteo Client

```typescript
import { weatherClient } from '$lib/api/weather.client';

// Get weather bundle for coordinates
const coords = { latitude: 46.4983, longitude: 11.3548 };
const bundle = await weatherClient.getWeatherBundle(coords);

// Bundle contains:
// - current: CurrentWeather
// - hourly: HourlyForecast (48 hours)
// - daily: DailyForecast (7 days)
```

### Query Parameters

```typescript
// Current weather endpoint
GET /v1/forecast
  ?latitude={lat}&longitude={lon}
  &current={params}
  &hourly={params}
  &daily={params}
  &timezone=Europe/Rome
  &forecast_days={days}
```

## Testing

### Unit Tests

```bash
npm run test
npm run test:watch
```

### E2E Tests

```bash
npm run test:e2e
```

### Coverage Report

Run tests with coverage:

```bash
npm run test -- --coverage
```

## Performance Optimization

### Bundle Size Target

- **Initial JS**: <100KB gzip
- **Initial CSS**: <30KB gzip
- **Total Bundle**: <150KB gzipped

### Lazy Loading

```typescript
// Route-based code splitting
const route = loadable(() => import('./Route.svelte'));
```

### Caching Strategy

| Resource | Strategy | TTL |
|----------|----------|-----|
| API Responses | Network-first | 5-30 min |
| Static Assets | Cache-first | 24 hours |
| Images | Cache-first | 7 days |

## Accessibility

- AA compliance目标
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader support

## Browser Support

| Browser | Version |
|---------|---------|
| Chrome/Edge | Last 2 versions |
| Safari | Last 2 versions |
| Firefox | Last 2 versions |
| Mobile Safari | iOS 14+ |
| Chrome Android | Last 2 versions |

## Troubleshooting

### Common Issues

**Problem**: `Failed to fetch weather data`

**Solution**: 
- Check internet connection
- Verify API is accessible
- Check rate limits

**Problem**: `Theme not updating`

**Solution**:
- Clear localStorage
- Check `themeStore.setTheme()`

**Problem**: `PWA not installing`

**Solution**:
- Verify `manifest.json` is accessible
- Check service worker registration
- Ensure HTTPS (or localhost)

## Next Steps

### Phase 1: Complete Core Features
- [ ] Add search functionality for locations
- [ ] Implement favorites persistence
- [ ] Add daily forecast details page

### Phase 2: Enhancements
- [ ] Implement precipitation radar
- [ ] Add mountain weather view
- [ ] Implement weather alerts

### Phase 3: Polish
- [ ] Performance optimization
- [ ] Accessibility audit
- [ ] Cross-browser testing

### Phase 4: Launch
- [ ] Deployment configuration
- [ ] Analytics setup
- [ ] Documentation completion

---

*For questions or issues, please open a GitHub issue.*
