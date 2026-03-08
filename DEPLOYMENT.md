# Deployment Guide

This guide explains how to deploy the Südtirol Wetter App V2 to production.

## Prerequisites

- GitHub account with access to `openfugjoobot/suedtirol-wetter-v2`
- Cloudflare account (free tier works)

## 1. GitHub Repository Secrets

The following secrets need to be configured in GitHub:

### Required for Deployment

| Secret Name | Description | How to Get |
|-------------|-------------|------------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token with Cloudflare Pages edit permissions | Cloudflare Dashboard → My Profile → API Tokens |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID | Cloudflare Dashboard → Workers & Pages → Select a project → Right side panel |

### How to Set GitHub Secrets

1. Go to your repository on GitHub
2. Click Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add each required secret

## 2. Creating a Cloudflare API Token

1. Go to https://dash.cloudflare.com/profile/api-tokens
2. Click "Create Token"
3. Use the "Edit Cloudflare Workers" template
4. Configure permissions:
   - Account → Cloudflare Pages → Edit
5. Set account resources to "Include → All accounts"
6. Click "Continue to summary" → "Create Token"
7. Copy the token and save it as `CLOUDFLARE_API_TOKEN`

## 3. Getting Cloudflare Account ID

1. Log in to Cloudflare Dashboard
2. Click "Workers & Pages" on the left sidebar
3. If you have existing projects, click one → Account ID is on the right panel
4. If you don't have projects, go to your URL in the browser and find the ID in the URL

## 4. Deployment Options

### Option A: Automatic Deployment (Recommended)

Once GitHub secrets are configured, deployment happens automatically when:
- You push to the `main` branch
- You create a Pull Request (preview deployment)
- You manually trigger the workflow

### Option B: Manual Deployment via GitHub CLI

```bash
gh workflow run deploy.yml
```

### Option C: Local Build and Deploy

1. Build the project:
   ```bash
   npm run build
   ```

2. The output will be in the `build/` directory
3. Upload `build/` contents to Cloudflare Pages manually

## 5. Cloudflare Pages Setup

### Initial Setup (if not using CI/CD)

1. Go to Cloudflare Dashboard → Workers & Pages
2. Click "Create application" → "Pages" → "Upload assets"
3. Project name: `suedtirol-wetter-v2`
4. Upload the contents of the `build/` directory
5. Click "Deploy site"

### Production URL

After deployment, your app will be available at:
- Primary: `https://suedtirol-wetter-v2.pages.dev`
- Custom domain: Configure in Cloudflare Pages settings if desired

## 6. Environment Variables

The following environment variables can be configured:

| Variable | Value | Purpose |
|----------|-------|---------|
| `NODE_ENV` | `production` | Set automatically during build |

## 7. Monitoring

### Health Checks

The monitoring workflow runs 3 times daily and checks:
- Production URL availability
- Open-Meteo API status
- PWA manifest accessibility

View results in:
- GitHub Actions → Monitor workflow
- Repository → Insights → Actions

### Logs

Access deployment logs:
1. Go to Cloudflare Dashboard → Workers & Pages
2. Click `suedtirol-wetter-v2` project
3. Click "Deployments" → Select a deployment → View logs

## 8. Rollback Process

If something goes wrong:

### Via Cloudflare
1. Go to Cloudflare Dashboard → Workers & Pages
2. Click `suedtirol-wetter-v2` project
3. Click "Deployments" → Find the previous good deployment
4. Click "Rollback"

### Via Git
```bash
# Revert the last commit
git revert HEAD
git push origin main

# Or reset to a previous commit
git reset --hard <commit-hash>
git push --force origin main
```

## 9. Performance Optimization

### Build Optimization
- Already optimized by Vite
- Code splitting and tree shaking enabled
- CSS minified with Tailwind CSS

### CDN
- Cloudflare Pages automatically serves via Cloudflare CDN
- Global edge network for fast loading

### Caching
- Static assets cache automatically
- Service worker for offline support
- Browser caching headers configured by Cloudflare

## 10. Release Process

### Creating a New Release

1. Update version in `package.json`:
   ```bash
   npm version patch  # or minor or major
   ```

2. Update `CHANGELOG.md` with changes

3. Commit and push:
   ```bash
   git add .
   git commit -m "chore: release v0.1.1"
   git push origin main
   ```

4. Create and push tag:
   ```bash
   git tag v0.1.1
   git push origin v0.1.1
   ```

The release workflow will automatically:
- Build the project
- Create a GitHub release
- Deploy to Cloudflare Pages

## 11. Troubleshooting

### Build Fails

```bash
# Run locally to debug
npm install
npm run check
npm run test
npm run build
```

### Deployment Fails

1. Check GitHub Actions logs for specific errors
2. Verify GitHub secrets are set correctly
3. Check Cloudflare API token has correct permissions
4. Ensure build directory exists and contains files

### Health Check Fails

1. Check if site is deployed correctly
2. Verify Cloudflare Pages is serving files
3. Check Open-Meteo API status: https://open-meteo.com/en/api

## 12. Security Considerations

- All deployments use HTTPS
- No sensitive data in client-side code
- GitHub secrets are encrypted
- Cloudflare API tokens are scoped to minimum permissions
- Regular dependency updates via Dependabot

## 13. Cost

- Cloudflare Pages: Free tier (unlimited deployments, 500 builds/month)
- Custom domains: Free with Cloudflare
- Bandwidth: Free (up to 100GB/month)
- API: Open-Meteo is free

## Support

For deployment issues:
1. Check GitHub Actions logs
2. Review Cloudflare Pages logs
3. Check the troubleshooting section
4. Open an issue on GitHub

---

**Deployment Status**: ✅ Configured and ready for first deployment (needs Cloudflare secrets)