# Deployment Guide

This project uses **GitHub Actions** to build and deploy to Netlify.

## Why GitHub Actions?

- ✅ **No time limits**: 6-hour build limit (vs Netlify's 15 minutes)
- ✅ **Better caching**: Persistent cache between builds for image optimization
- ✅ **Consistent environment**: Production URLs always used (no accidental localhost)
- ✅ **Free tier**: 2000 minutes/month (sufficient for this project)

## Setup Instructions

### 1. Get Netlify Credentials

You'll need two values from Netlify:

**Netlify Auth Token:**

```bash
# Go to: https://app.netlify.com/user/applications
# Create a new personal access token
# Copy the token
```

**Netlify Site ID:**

```bash
# Go to your site dashboard on Netlify
# Site Settings → General → Site details → Site ID
# Or run: netlify sites:list
```

### 2. Add GitHub Secrets

Go to your GitHub repository:

```
Settings → Secrets and variables → Actions → New repository secret
```

Add these two secrets:

1. **Name:** `NETLIFY_AUTH_TOKEN`  
   **Value:** Your Netlify personal access token

2. **Name:** `NETLIFY_SITE_ID`  
   **Value:** Your Netlify site ID

### 3. Disable Netlify Auto-Deploy

In Netlify dashboard:

```
Site Settings → Build & Deploy → Build settings → Stop builds
```

Or ensure `netlify.toml` has no build command (already configured).

### 4. Deploy

**Automatic deployment:**

```bash
git push origin main
```

**Manual deployment** (from GitHub):

- Go to: Actions → Build and Deploy to Netlify → Run workflow

## How It Works

1. **Push to `main` branch** triggers the workflow
2. **GitHub Actions runner**:
   - Checks out code
   - Caches dependencies and Astro build artifacts
   - Installs dependencies (`npm ci`)
   - Builds website (`npm run build`)
     - Uses production `PHOTO_SERVER_URL` (default: https://share.kadykov.com)
     - Optimizes images (cached between builds)
   - Deploys `dist/` folder to Netlify
3. **Netlify serves** the pre-built static files

## Environment Variables

**Production (GitHub Actions):**

- `PHOTO_SERVER_URL` not set → defaults to `https://share.kadykov.com` ✅

**Local Development:**

- Can use `.env` to override: `PHOTO_SERVER_URL=http://localhost:8000`
- This NEVER affects production builds (safe!)

## Build Time Optimization

**Current optimizations:**

- Image optimization cache persisted between builds
- Only changed images are re-processed
- Node modules cached

**If builds are still slow, consider:**

1. Reduce generated image sizes (fewer widths in `imageOptimization.ts`)
2. Skip lightbox image optimization (serve originals)
3. Add photos incrementally (10-20 at a time)

## Troubleshooting

**Build fails with "Error: Build exceeded maximum time limit":**

- GitHub Actions limit is 6 hours (should be plenty)
- Check workflow logs for actual error

**Deployed site has broken image links:**

- Check that `PHOTO_SERVER_URL` is NOT set in GitHub Actions secrets
- Should use default: `https://share.kadykov.com`

**Want to test build locally before pushing:**

```bash
npm run build
npm run preview  # Test the built site locally
```

Note: Local build uses your `.env` file, so verify `PHOTO_SERVER_URL` is correct or unset.

## Monitoring

**GitHub Actions:**

- View builds: Repository → Actions tab
- Each push shows build status
- Can download logs if needed

**Netlify:**

- View deploys: Netlify dashboard → Deploys tab
- Shows deployment history from GitHub Actions
