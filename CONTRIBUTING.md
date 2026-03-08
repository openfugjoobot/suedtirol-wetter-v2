# Contributing to Südtirol Wetter App V2

Thank you for your interest in contributing to this project!

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates.

When creating a bug report, include:
- A descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Browser and device information
- Any relevant error messages from the console

### Suggesting Enhancements

Enhancement suggestions are welcome! When suggesting an enhancement:
- Use a clear and descriptive title
- Provide a detailed explanation of the feature
- Explain why this enhancement would be useful
- Provide examples of how the feature would work

### Development Setup

1. Fork the repository
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/suedtirol-wetter-v2.git
   cd suedtirol-wetter-v2
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Make your changes and test them

### Code Style

This project uses:
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety

Please run `npm run lint` before submitting your PR.

### Testing

- Unit tests: `npm run test`
- E2E tests: `npm run test:e2e`
- Type checking: `npm run check`

Ensure all tests pass before submitting your PR.

### Commit Messages

Follow conventional commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Test additions or changes
- `chore:` - Maintenance tasks

Example: `feat: add hourly weather forecast chart`

### Pull Request Process

1. Update documentation if needed
2. Add tests for new features or bug fixes
3. Ensure all tests pass
4. Update the CHANGELOG.md
5. Submit a clear PR description

### Project Structure

```
src/
├── lib/
│   ├── api/              # API clients
│   ├── components/       # Reusable components
│   ├── services/         # Business logic
│   ├── stores/           # State management
│   └── types/            # TypeScript definitions
└── routes/               # SvelteKit pages
```

### Adding a New Language

1. Create a new locale file in `src/lib/i18n/locales/`
2. Add translations for all keys
3. Update `src/lib/i18n/index.ts` to include the new language
4. Add a language flag icon if needed

### Adding a New Weather Data Field

1. Update the TypeScript types in `src/lib/types/weather.types.ts`
2. Add the API call in `src/lib/api/open-meteo.client.ts`
3. Create or update the service layer in `src/lib/services/weather.service.ts`
4. Add or update the component to display the data

## Code of Conduct

Be respectful and constructive. We're all here to build something great together.

## Questions?

Feel free to open an issue with the "question" label.

---

Thank you for contributing! 🙏