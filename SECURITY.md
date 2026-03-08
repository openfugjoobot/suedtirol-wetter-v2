# Security Policy

## Reporting Security Issues

If you discover a security vulnerability, please do not open an issue. Instead, please send an email directly to the maintainers.

All security vulnerabilities will be promptly addressed.

## Supported Versions

| Version | Supported |
|---------|-----------|
| 0.1.x   | ✅ Yes    |

## Security Best Practices

This project follows security best practices:

- **No sensitive data storage**: All data is stored locally on the device
- **HTTPS only**: The app should only be served over HTTPS
- **CORS restrictions**: API calls are properly restricted to trusted origins
- **Content Security Policy**: Proper CSP headers should be configured
- **Regular dependency updates**: Dependencies are kept up to date
- **No server-side secrets**: No secrets are exposed to the client-side

## Dependencies

We use the Open-Meteo API, which:
- Does not require authentication
- Has fair use policies
- Is designed for public use
- Does not store user data

## Data Privacy

This application:
- Does not collect personal information
- Stores all preferences locally (localStorage)
- Uses geolocation only with user permission
- Does not track users
- Does not use third-party analytics or tracking cookies

## License

This project is licensed under the MIT License.