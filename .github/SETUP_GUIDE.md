# GitHub Actions Deployment - Quick Setup

## Step 1: Get Netlify Credentials (2 minutes)

### Netlify Auth Token

1. Go to: https://app.netlify.com/user/applications
2. Click "New access token"
3. Name it: "GitHub Actions Deploy"
4. Copy the token (save it temporarily)

### Netlify Site ID

Run in terminal:

```bash
cd /workspaces/kadykov.com
netlify status
```

Or find it in Netlify dashboard: **Site Settings → General → Site details**

## Step 2: Add GitHub Secrets (2 minutes)

1. Go to: https://github.com/kadykov/kadykov.com/settings/secrets/actions
2. Click **"New repository secret"**

Add secret #1:

- **Name:** `NETLIFY_AUTH_TOKEN`
- **Value:** [paste the token from Step 1]
- Click **"Add secret"**

Add secret #2:

- **Name:** `NETLIFY_SITE_ID`
- **Value:** [paste the site ID from Step 1]
- Click **"Add secret"**

## Step 3: Disable Netlify Auto-Build (1 minute)

**Option A: Via Netlify Dashboard**

1. Go to: https://app.netlify.com
2. Select your site
3. **Site Settings → Build & Deploy → Build settings**
4. Click **"Edit settings"**
5. Set **"Build command"** to empty (or click "Stop builds")
6. Save

**Option B: Already done!**
The `netlify.toml` has been updated to remove the build command.
Netlify will now only host files deployed by GitHub Actions.

## Step 4: Test the Deployment

**Method 1: Commit this setup**

```bash
git add .github/ netlify.toml
git commit -m "Setup GitHub Actions deployment"
git push origin deployment-optimization
```

Then merge to `main` and watch the build at:
https://github.com/kadykov/kadykov.com/actions

**Method 2: Manual trigger (for testing)**

1. Go to: https://github.com/kadykov/kadykov.com/actions
2. Click **"Build and Deploy to Netlify"** workflow
3. Click **"Run workflow"** → Select branch → **"Run workflow"**

## Monitoring

**GitHub Actions:** https://github.com/kadykov/kadykov.com/actions

- Shows build progress and logs
- Up to 6 hours build time
- 2000 minutes/month free

**Netlify:** https://app.netlify.com

- Shows deploy history
- Serves pre-built files from GitHub Actions

## Troubleshooting

**"Secret not found" error:**

- Double-check secret names: `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID`
- Make sure they're added to the correct repository

**Build takes too long:**

- Current cache should make subsequent builds much faster
- Only new/changed images are processed

**Wrong image URLs in production:**

- This should NOT happen - production uses default `https://share.kadykov.com`
- Your local `.env` doesn't affect GitHub Actions builds

## Next Steps

After successful setup:

- Future deployments: just `git push origin main`
- Build time: First build may be slow, subsequent builds use cache
- No more 15-minute Netlify limit!

---

Full documentation: `.github/DEPLOYMENT.md`
