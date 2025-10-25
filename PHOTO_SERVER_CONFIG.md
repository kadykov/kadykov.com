# Photo Server Configuration

## Overview

This website fetches photo manifests and images from a configurable photo server. By default, it uses the production server at `https://share.kadykov.com`, but you can override this for local development.

## Configuration

### Production (Default)

No configuration needed! The production server URL is baked into the code and will be used automatically:

- **Default URL:** `https://share.kadykov.com`
- **Manifest:** `https://share.kadykov.com/image_manifest.json`

### Local Development

To use a local or alternative photo server during development:

1. **Create a `.env` file** in the project root (copy from `.env.example`):

   ```bash
   cp .env.example .env
   ```

2. **Set the `PHOTO_SERVER_URL` environment variable**:

   ```env
   PHOTO_SERVER_URL=http://localhost:8000
   ```

   Or with an IP address:

   ```env
   PHOTO_SERVER_URL=http://192.168.1.100:8000
   ```

3. **Restart the dev server** for changes to take effect:
   ```bash
   npm run dev
   ```

### CI/CD / Cloud Deployment

For deploying to different environments with different photo servers:

1. **Set environment variables** in your deployment platform (Netlify, Vercel, etc.)
2. **Variable name:** `PHOTO_SERVER_URL`
3. **Example value:** `https://cdn.kadykov.com`

## Implementation Details

### Centralized Configuration

All photo server URLs are managed through `/src/config/photoServer.ts`:

```typescript
// Automatically uses PHOTO_SERVER_URL env var or defaults to production
import {
  PHOTO_SERVER_URL,
  MANIFEST_URL,
  getImageUrl,
} from "./config/photoServer"
```

### Files Using Photo Server Config

The following files have been updated to use the centralized configuration:

1. **`src/config/photoServer.ts`** - Central configuration module
2. **`src/utils/photoData.ts`** - Manifest fetching
3. **`src/content.config.ts`** - Photos collection loader
4. **`src/components/PhotoGallery.astro`** - Gallery component
5. **`astro.config.mjs`** - Image domain configuration

### Why This Approach?

✅ **Production-first:** No env var needed for production builds  
✅ **Dev-friendly:** Easy to switch to local server with `.env`  
✅ **Single source of truth:** All URLs managed in one place  
✅ **Type-safe:** TypeScript ensures correct usage  
✅ **Standard practice:** Follows common Node.js/Astro conventions

## Troubleshooting

### Images not loading in development

1. Check that your local photo server is running
2. Verify the `PHOTO_SERVER_URL` in your `.env` file
3. Ensure the manifest URL is accessible: `curl $PHOTO_SERVER_URL/image_manifest.json`
4. Restart the Astro dev server

### Build errors about image domains

The `astro.config.mjs` automatically extracts the domain from `PHOTO_SERVER_URL`. If you use a custom domain:

```env
PHOTO_SERVER_URL=https://my-custom-cdn.example.com
```

The domain `my-custom-cdn.example.com` will be automatically added to Astro's allowed image domains.

## Future Migration to Cloud

When you're ready to move to a cloud server:

1. **Deploy your photo server** to the cloud (e.g., AWS S3 + CloudFront, Google Cloud Storage, etc.)
2. **Update DNS** to point `share.kadykov.com` to the new server, OR
3. **Change the default** in `src/config/photoServer.ts` to the new cloud URL
4. **Keep local development** using `.env` to point to your local server

Example for changing the default to a new cloud server:

```typescript
// src/config/photoServer.ts
const PHOTO_SERVER_BASE =
  import.meta.env.PHOTO_SERVER_URL || "https://cdn.kadykov.com"
```

No other code changes needed!
