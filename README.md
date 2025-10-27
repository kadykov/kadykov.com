# kadykov.com

[![Netlify Status](https://api.netlify.com/api/v1/badges/8148152a-e0b6-47aa-920a-f78abbdd9e69/deploy-status)](https://app.netlify.com/sites/kadykov/deploys)

Personal website made with [Astro](https://astro.build/).

## Deployment

This project uses **GitHub Actions** for building and **Netlify** for hosting.

**Setup guide:** [.github/SETUP_GUIDE.md](.github/SETUP_GUIDE.md)  
**Full documentation:** [.github/DEPLOYMENT.md](.github/DEPLOYMENT.md)

**Quick deploy:**

```bash
git push origin main  # Automatically builds and deploys via GitHub Actions
```

## Development

```bash
npm install           # Install dependencies
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build locally
```

**Photo server configuration:**

- Production: `https://share.kadykov.com` (default)
- Local dev: Set `PHOTO_SERVER_URL` in `.env` to override

See [.env.example](.env.example) for available configuration options.
