# Contributing to Südtirol Wetter App V2

Thank you for your interest in contributing! This guide will help you get started with development.

## Table of Contents

1. [Development Setup](#development-setup)
2. [Code Style](#code-style)
3. [Project Structure](#project-structure)
4. [Making Changes](#making-changes)
5. [Testing](#testing)
6. [Submitting Changes](#submitting-changes)
7. [Common Tasks](#common-tasks)

---

## Development Setup

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** or **pnpm** for package management
- **Git** for version control
- A modern code editor (VS Code recommended)

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/openfugjoobot/suedtirol-wetter-v2.git
cd suedtirol-wetter-v2

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Recommended VS Code Extensions

- Svelte for VS Code
- Tailwind CSS IntelliSense
- ESLint
- Prettier
- TypeScript Vue Plugin (Volar)

---

## Code Style

### General Guidelines

- Use **TypeScript** for all new code
- Follow existing patterns in the codebase
- Write meaningful variable and function names
- Keep functions small and focused
- Comment complex logic

### Svelte 5 Best Practices

Use Svelte 5 runes for reactivity:

```typescript
// ✅ Use runes
let count = $state(0);
let doubled = $derived(count * 2);

$effect(() => {
  console.log('Count changed:', count);
});

// ❌ Avoid old reactive syntax
let count = 0;
$: doubled = count * 2;
```

### TypeScript Guidelines

```typescript
// ✅ Use interfaces for objects
interface WeatherData {
  temperature: number;
  condition: string;
}

// ✅ Use proper types for unions
type Theme = 'light' | 'dark' | 'oled';

// ✅ Avoid 'any' type
// ❌ bad: const data: any = response;
// ✅ good: const data: WeatherData = response;
```

### CSS & Tailwind

- Use Tailwind CSS utility classes
- Keep custom CSS to a minimum
- Use CSS variables for theme colors

```svelte
<!-- ✅ Good -->
<div class="flex items-center gap-4 p-4">

<!-- ❌ Avoid -->
<div style="display: flex; padding: 16px;">
```

---

## Project Structure

```
src/
├── lib/
│   ├── api/           # API clients (Open-Meteo)
│   ├── components/    # Svelte components
│   │   ├── ui/        # Base UI primitives
│   │   ├── weather/  # Weather-specific components
│   │   └── location/ # Location components
│   ├── hooks/         # Custom Svelte hooks
│   ├── i18n/          # Translations
│   ├── services/      # Business logic
│   ├── stores/        # State management
│   ├── types/         # TypeScript definitions
│   └── utils/         # Helper functions
├── routes/            # SvelteKit pages
└── static/            # Static assets
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `WeatherCard.svelte` |
| Services | camelCase + .service | `weather.service.ts` |
| Types | PascalCase | `WeatherData` |
| Hooks | camelCase + .hook | `useGeolocation.ts` |
| Stores | .store.ts suffix | `weather.store.ts` |

---

## Making Changes

### 1. Create a Branch

```bash
# Create and switch to a new branch
git checkout -b feature/my-new-feature

# Or for bug fixes
git checkout -b fix/issue-description
```

### 2. Make Your Changes

- Follow the code style guidelines
- Add tests if applicable
- Update documentation if needed

### 3. Commit Your Changes

```bash
# Stage your changes
git add .

# Commit with a descriptive message
git commit -m "Add feature: new weather display component"
```

**Commit Message Format**:
```
type(scope): description

[optional body]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### 4. Push and Create PR

```bash
# Push to your fork
git push origin feature/my-new-feature

# Create Pull Request on GitHub
```

---

## Testing

### Running Tests

```bash
# Unit tests
npm run test

# Unit tests with watch mode
npm run test:watch

# E2E tests
npm run test:e2e

# Type checking
npm run check
```

### Writing Tests

#### Unit Test Example

```typescript
// src/lib/utils.test.ts
import { describe, it, expect } from 'vitest';
import { formatTemperature } from './utils';

describe('formatTemperature', () => {
  it('formats celsius correctly', () => {
    expect(formatTemperature(25, 'celsius')).toBe('25°C');
  });
  
  it('formats fahrenheit correctly', () => {
    expect(formatTemperature(77, 'fahrenheit')).toBe('77°F');
  });
});
```

#### Component Test Example

```typescript
// src/lib/components/weather/WeatherCard.test.ts
import { render, screen } from '@testing-library/svelte';
import WeatherCard from './WeatherCard.svelte';

it('displays temperature', () => {
  render(WeatherCard, { temperature: 20 });
  expect(screen.getByText('20°C')).toBeInTheDocument();
});
```

---

## Submitting Changes

### Pull Request Guidelines

1. **Keep PRs small and focused** - One feature or fix per PR
2. **Describe your changes** - Explain what and why
3. **Link issues** - Reference related GitHub issues
4. **Update docs** - Keep documentation in sync

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Testing
Describe testing done

## Checklist
- [ ] Code follows style guidelines
- [ ] Tests pass
- [ ] Documentation updated
```

---

## Common Tasks

### Adding a New Translation

1. Open `src/lib/i18n/locales/`
2. Edit the relevant locale file (de.json, it.json, en.json, ld.json)
3. Add missing keys
4. Test in the app

```json
// Example: Adding a new translation key
{
  "weather": {
    "humidity": "Humidity / Luftfeuchtigkeit"
  }
}
```

### Adding a New Component

1. Create component in appropriate folder
2. Export from index.ts
3. Use in routes

```svelte
<!-- src/lib/components/weather/NewComponent.svelte -->
<script lang="ts">
  interface Props {
    title: string;
  }
  
  let { title }: Props = $props();
</script>

<div class="new-component">
  <h2>{title}</h2>
</div>
```

### Adding a New API Endpoint

1. Add types in `src/lib/types/`
2. Update API client in `src/lib/api/`
3. Add service method in `src/lib/services/`
4. Create store if needed

---

## Questions?

- Open an issue on GitHub
- Check existing issues and discussions
- Review the technical documentation

---

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Help others learn and grow
- Focus on what's best for the project

---

*Thank you for contributing! 🎉*
