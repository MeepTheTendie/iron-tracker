# GitHub Actions Secrets Configuration

To enable automatic deployments via GitHub Actions, you need to configure the following secrets in your GitHub repository.

## Required Secrets

### Vercel Deployment

1. **Create a Vercel Account**
   - Go to [vercel.com](https://vercel.com) and sign up
   - Connect your GitHub account

2. **Get Your Vercel Token**
   - Go to [Vercel Account Settings](https://vercel.com/account/tokens)
   - Click "Create Token" and give it a name (e.g., "GitHub Actions")
   - Copy the token value

3. **Get Your Organization ID**

   ```bash
   npx vercel whoami --token YOUR_TOKEN
   ```

4. **Get Your Project ID**

   ```bash
   npx vercel projects --token YOUR_TOKEN
   ```

5. **Add Secrets to GitHub**
   - Go to your repository → Settings → Secrets and variables → Actions
   - Add the following secrets:
     - `VERCEL_TOKEN`: Your Vercel access token
     - `ORG_ID`: Your Vercel organization ID
     - `PROJECT_ID`: Your Vercel project ID

### Supabase (Iron Tracker Only)

If using Supabase in production:

- Go to [Supabase Dashboard](https://supabase.com/dashboard)
- Navigate to Settings → API
- Add these secrets:
  - `SUPABASE_URL`: Your project URL
  - `SUPABASE_ANON_KEY`: Your anon key

### Google Analytics (Optional)

To enable analytics tracking:

- Go to [Google Analytics](https://analytics.google.com)
- Create a GA4 property
- Add the secret:
  - `VITE_GA_ID`: Your GA4 measurement ID (format: G-XXXXXXXXXX)

## Setting Up Secrets via CLI

You can also add secrets using the GitHub CLI:

```bash
# Vercel secrets
gh secret set VERCEL_TOKEN -b"your-vercel-token"
gh secret set ORG_ID -b"your-org-id"
gh secret set PROJECT_ID -b"your-project-id"

# Supabase secrets (Iron Tracker only)
gh secret set SUPABASE_URL -b"https://your-project.supabase.co"
gh secret set SUPABASE_ANON_KEY -b"your-anon-key"

# Analytics (optional)
gh secret set VITE_GA_ID -b"G-XXXXXXXXXX"
```

## Testing the CI/CD Pipeline

After adding secrets, push a commit to trigger the workflow:

- The workflow will run tests, lint, and build
- If successful, it will deploy to Vercel

## Troubleshooting

### Deployment Failed

- Check the Actions tab for error logs
- Ensure all required secrets are set
- Verify Vercel project settings

### Tests Failed

- Run `npm test` locally to see errors
- Check for missing dependencies

### Build Failed

- Run `npm run build` locally to see errors
- Check environment variables are set correctly
