# AkaMoney Cloudflare 部署指南

完整的生產環境部署步驟說明。

## Prerequisites

- Node.js 18+
- Cloudflare account (free tier is sufficient)
- Azure Entra ID application (for authentication)

---

## Step 1: Create Cloudflare Account

### 1.1 Register Cloudflare Account

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Click **Sign Up**
3. Enter your email and password
4. Verify your email address

### 1.2 Install Wrangler CLI

```bash
# Install Wrangler globally
npm install -g wrangler

# Verify installation
wrangler --version
```

### 1.3 Login to Cloudflare

```bash
wrangler login
```

This will open your browser for authorization:
1. Click **Allow** to authorize Wrangler
2. You'll see "Successfully logged in" in the terminal

Verify login:
```bash
wrangler whoami
```

---

## Step 2: Create Cloudflare Resources

Navigate to the worker directory:

```bash
cd src/cloudflare/worker
```

### 2.1 Create KV Namespace (for short URLs)

**Via CLI (Recommended):**
```bash
# Create production KV namespace
wrangler kv:namespace create SHORTURL_KV

# Create preview KV namespace (for wrangler dev)
wrangler kv:namespace create SHORTURL_KV --preview
```

**Save the output IDs**, for example:
```
⛅️ Created namespace "akamoney-api-SHORTURL_KV" with ID "xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

**Via Cloudflare Dashboard:**
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select your account
3. Navigate to **Workers & Pages** → **KV**
4. Click **Create a namespace**
5. Enter name: `akamoney-api-SHORTURL_KV`
6. Click **Add**
7. Copy the **Namespace ID**

### 2.2 Create D1 Database (for click tracking)

**Via CLI (Recommended):**
```bash
wrangler d1 create akamoney-clicks
```

**Save the `database_id` from the output:**
```
✅ Successfully created DB 'akamoney-clicks' in region WNAM
Created your new D1 database.

[[d1_databases]]
binding = "DB"
database_name = "akamoney-clicks"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

**Via Cloudflare Dashboard:**
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Workers & Pages** → **D1 SQL Database**
3. Click **Create database**
4. Enter database name: `akamoney-clicks`
5. Select location (default is fine)
6. Click **Create**
7. Copy the **Database ID** from the database details page

### 2.3 Verify Resources Created

**Check KV namespaces:**
```bash
wrangler kv:namespace list
```

**Check D1 databases:**
```bash
wrangler d1 list
```

**Or via Dashboard:**
- KV: Dashboard → Workers & Pages → KV
- D1: Dashboard → Workers & Pages → D1 SQL Database

---

## Step 3: Update wrangler.toml Configuration

Edit `src/cloudflare/worker/wrangler.toml` with the IDs from the previous step:

```toml
name = "akamoney-api"
main = "src/index.ts"
compatibility_date = "2024-12-01"

[vars]
AZURE_TENANT_ID = ""  # Will be set via secrets
AZURE_CLIENT_ID = ""  # Will be set via secrets

# Fill in your KV IDs
[[kv_namespaces]]
binding = "SHORTURL_KV"
id = "your-production-kv-id"
preview_id = "your-preview-kv-id"

# Fill in your D1 ID
[[d1_databases]]
binding = "CLICKS_DB"
database_name = "akamoney-clicks"
database_id = "your-d1-database-id"

[dev]
port = 8787
local_protocol = "http"
```

---

## Step 4: Run D1 Database Migration

```bash
# Execute migration on remote D1
wrangler d1 execute akamoney-clicks --file=../migrations/0001_create_clickinfo.sql
```

Verify the table was created:
```bash
wrangler d1 execute akamoney-clicks --command="SELECT name FROM sqlite_master WHERE type='table';"
```

---

## Step 5: Set Entra ID Secrets

Set sensitive information as secrets (not in wrangler.toml):

**Via CLI:**
```bash
# Set Azure Tenant ID
wrangler secret put AZURE_TENANT_ID
# Enter your Tenant ID when prompted

# Set Azure Client ID (API application's Client ID)
wrangler secret put AZURE_CLIENT_ID
# Enter your Client ID when prompted
```

**Via Cloudflare Dashboard:**
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Workers & Pages** → **akamoney-api** (after first deploy)
3. Click **Settings** → **Variables**
4. Scroll to **Environment Variables**
5. Click **Add variable**
6. Add each variable:
   - Variable name: `AZURE_TENANT_ID`, Value: your tenant ID, Click **Encrypt**
   - Variable name: `AZURE_CLIENT_ID`, Value: your client ID, Click **Encrypt**
7. Click **Save and deploy**

**Verify secrets:**
```bash
wrangler secret list
```

---

## Step 6: Deploy Workers API

```bash
npm run deploy
```

After successful deployment, you'll see the URL:
```
Published akamoney-api (1.23 sec)
  https://akamoney-api.your-account.workers.dev
```

**Save this URL** - the frontend will need it.

**Verify deployment via Dashboard:**
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Workers & Pages**
3. You should see `akamoney-api` listed
4. Click on it to view details, logs, and settings

---

## Step 7: Deploy Frontend to Cloudflare Pages

### 7.1 Configure Frontend Environment Variables

Create `src/akamoney-frontend/.env.production`:

```env
VUE_APP_API_URL=https://akamoney-api.your-account.workers.dev
VUE_APP_CLIENT_ID=your-frontend-app-client-id
VUE_APP_TENANT_ID=your-tenant-id
VUE_APP_API_CLIENT_ID=your-api-app-client-id
```

### 7.2 Build Frontend

```bash
cd src/akamoney-frontend
npm install
npm run build
```

### 7.3 Deploy to Pages

**Option A: Using Wrangler CLI (Quick)**
```bash
wrangler pages deploy dist --project-name=akamoney-frontend
```

First run will prompt to create a project - select **Create a new project**.

**Option B: Via Cloudflare Dashboard (Direct Upload)**

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages**
2. Click **Create** → **Pages** → **Upload assets**
3. Enter project name: `akamoney-frontend`
4. Drag and drop the `dist` folder or click to upload
5. Click **Deploy site**
6. After deploy, go to **Settings** → **Environment variables**
7. Add Production variables:
   - `VUE_APP_API_URL` = Workers API URL
   - `VUE_APP_CLIENT_ID` = Frontend Client ID
   - `VUE_APP_TENANT_ID` = Tenant ID
   - `VUE_APP_API_CLIENT_ID` = API Client ID
8. Redeploy for variables to take effect

**Option C: Connect GitHub (Recommended - enables auto-deploy)**

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create**
2. Select **Pages** → **Connect to Git**
3. Click **Connect GitHub** and authorize Cloudflare
4. Select repository `lettucebo/AkaMoney`
5. Configure build settings:
   - **Project name**: `akamoney-frontend`
   - **Production branch**: `master`
   - **Framework preset**: Vue
   - **Root directory**: `src/akamoney-frontend`
   - **Build command**: `npm install && npm run build`
   - **Build output directory**: `dist`
6. Expand **Environment variables (advanced)**
7. Add variables for **Production**:
   | Variable name | Value |
   |---------------|-------|
   | `VUE_APP_API_URL` | `https://akamoney-api.your-account.workers.dev` |
   | `VUE_APP_CLIENT_ID` | Your frontend app client ID |
   | `VUE_APP_TENANT_ID` | Your Azure tenant ID |
   | `VUE_APP_API_CLIENT_ID` | Your API app client ID |
8. Click **Save and Deploy**
9. Wait for build to complete (usually 1-2 minutes)

**Verify Pages deployment:**
- Your site will be available at `https://akamoney-frontend.pages.dev`
- Check deployment status in Dashboard → Workers & Pages → akamoney-frontend

---

## Step 8: Configure CORS (if needed)

If frontend and API are on different domains, edit `src/cloudflare/worker/src/index.ts` to update CORS origins:

```typescript
app.use('*', cors({
  origin: [
    'http://localhost:8080',
    'https://akamoney-frontend.pages.dev',  // Add your Pages URL
    'https://your-custom-domain.com'        // Add custom domain if any
  ],
  // ...
}));
```

Then redeploy:
```bash
cd src/cloudflare/worker
npm run deploy
```

---

## Step 9: Configure Custom Domain (Optional)

### Prerequisites for Custom Domain
- Domain must be added to your Cloudflare account
- DNS must be managed by Cloudflare (or use CNAME setup)

### Add Domain to Cloudflare (if not already)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Click **Add a Site**
3. Enter your domain name
4. Select **Free** plan
5. Cloudflare will scan DNS records
6. Update your domain's nameservers at your registrar to Cloudflare's nameservers
7. Wait for DNS propagation (can take up to 24 hours)

### Workers API Custom Domain

**Via Dashboard:**
1. Go to **Workers & Pages** → **akamoney-api**
2. Click **Settings** → **Triggers**
3. Under **Custom Domains**, click **Add Custom Domain**
4. Enter domain: `api.yourdomain.com`
5. Click **Add Custom Domain**
6. Cloudflare will automatically configure DNS

**Via CLI:**
```bash
wrangler domains add api.yourdomain.com
```

### Pages Custom Domain

**Via Dashboard:**
1. Go to **Workers & Pages** → **akamoney-frontend**
2. Click **Custom domains** tab
3. Click **Set up a custom domain**
4. Enter domain: `aka.yourdomain.com` or `yourdomain.com`
5. Click **Continue**
6. Cloudflare will configure DNS automatically
7. SSL certificate will be provisioned automatically

### Verify Custom Domain

```bash
# Test API
curl https://api.yourdomain.com/health

# Test frontend
curl -I https://aka.yourdomain.com
```

---

## Step 10: Update Entra ID Redirect URIs

In Azure Portal, update the allowed redirect URIs for your application:

1. Go to [Azure Portal](https://portal.azure.com) → **Microsoft Entra ID**
2. Navigate to **App registrations**
3. Select your frontend application
4. Click **Authentication** in the left menu
5. Under **Single-page application** redirect URIs, click **Add URI**
6. Add all your deployment URLs:
   - `https://akamoney-frontend.pages.dev`
   - `https://aka.yourdomain.com` (if using custom domain)
   - `https://yourdomain.com` (if using apex domain)
7. Click **Save**

**Important:** If you don't update redirect URIs, authentication will fail with "redirect_uri mismatch" error.

---

## Verify Deployment

### Test API Health

```bash
curl https://akamoney-api.your-account.workers.dev/health
```

Expected response:
```json
{"status":"healthy","timestamp":"...","service":"akamoney-api"}
```

### Test Frontend

Open browser and visit `https://akamoney-frontend.pages.dev`

### Test Authentication

Login with Entra ID account - should successfully get token and call API.

---

## Viewing Logs

```bash
# Real-time Workers logs
wrangler tail
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS error | Ensure `src/index.ts` origin includes frontend URL |
| 401 Unauthorized | Check AZURE_TENANT_ID and AZURE_CLIENT_ID secrets |
| KV/D1 error | Verify wrangler.toml IDs are correct |
| Deployment failed | Run `wrangler tail` to view real-time logs |
| Token validation failed | Verify Entra ID app registration and redirect URIs |
| Database empty | Ensure D1 migration was executed on remote |

---

## Updating Deployment

### Update Workers API

```bash
cd src/cloudflare/worker
npm run deploy
```

### Update Frontend

If using GitHub integration, just push to main branch - auto-deploys.

If using CLI:
```bash
cd src/akamoney-frontend
npm run build
wrangler pages deploy dist --project-name=akamoney-frontend
```

### Update D1 Schema

1. Create new migration file in `src/cloudflare/migrations/`
2. Run migration:
   ```bash
   wrangler d1 execute akamoney-clicks --file=../migrations/000X_new_migration.sql
   ```

---

## Free Tier Limits

| Service | Daily Limit |
|---------|-------------|
| Workers Requests | 100,000 |
| KV Reads | 100,000 |
| KV Writes | 1,000 |
| KV Storage | 1 GB |
| D1 Rows Read | 5,000,000 |
| D1 Rows Written | 100,000 |
| D1 Storage | 5 GB |
| Pages Requests | Unlimited |

Limits reset at UTC 00:00 daily.

---

## Quick Reference Commands

```bash
# Deploy Workers
cd src/cloudflare/worker && npm run deploy

# Deploy Pages
cd src/akamoney-frontend && npm run build && wrangler pages deploy dist --project-name=akamoney-frontend

# View logs
wrangler tail

# List KV keys
wrangler kv:key list --namespace-id=YOUR_KV_ID

# Query D1
wrangler d1 execute akamoney-clicks --command="SELECT * FROM clickinfo LIMIT 10;"

# Check secrets
wrangler secret list
```

---

## Appendix: Cloudflare Dashboard Navigation Guide

### Dashboard Overview

After logging into [dash.cloudflare.com](https://dash.cloudflare.com):

```
Cloudflare Dashboard
├── Home (Account overview)
├── Websites (Your domains)
├── Workers & Pages ← Main area for this project
│   ├── Overview (List of Workers and Pages projects)
│   ├── KV (Key-Value storage namespaces)
│   ├── D1 SQL Database (SQLite databases)
│   ├── Durable Objects
│   ├── Queues
│   └── R2 (Object storage)
├── Analytics & Logs
└── Account settings
```

### Workers & Pages Section

| Tab | Description |
|-----|-------------|
| **Overview** | List all Workers and Pages projects |
| **KV** | Create and manage KV namespaces, view/edit keys |
| **D1** | Create databases, run SQL queries, view tables |

### Managing a Worker (akamoney-api)

Click on `akamoney-api` in Workers & Pages → Overview:

| Tab | Description |
|-----|-------------|
| **Deployments** | View deployment history, rollback |
| **Metrics** | Request count, CPU time, errors |
| **Logs** | Real-time and historical logs |
| **Settings** | |
| └ General | Worker name, compatibility date |
| └ Triggers | Routes, custom domains, cron triggers |
| └ Variables | Environment variables and secrets |
| └ Bindings | KV, D1, R2 bindings |

### Managing a Pages Project (akamoney-frontend)

Click on `akamoney-frontend` in Workers & Pages → Overview:

| Tab | Description |
|-----|-------------|
| **Deployments** | View all deployments, preview URLs |
| **Custom domains** | Add/manage custom domains |
| **Settings** | |
| └ General | Project name, production branch |
| └ Builds & deployments | Build settings, environment variables |
| └ Environment variables | Add/edit variables per environment |

### KV Management

In Workers & Pages → KV:

1. Click on a namespace to view keys
2. **Add entry** - Manually add key-value pairs
3. **View** - See existing keys and values
4. **Delete** - Remove keys

### D1 Database Management

In Workers & Pages → D1:

1. Click on a database to view details
2. **Console** - Run SQL queries directly
3. **Tables** - View schema and data
4. **Metrics** - Query statistics
5. **Settings** - Database ID, location

**Useful SQL queries in Console:**
```sql
-- View all tables
SELECT name FROM sqlite_master WHERE type='table';

-- Count records
SELECT COUNT(*) FROM clickinfo;

-- View recent clicks
SELECT * FROM clickinfo ORDER BY timestamp DESC LIMIT 20;

-- Delete old records (careful!)
DELETE FROM clickinfo WHERE timestamp < '2025-01-01';
```

### Monitoring and Analytics

**Workers Analytics:**
- Dashboard → Workers & Pages → akamoney-api → Metrics
- View: Requests, CPU time, Errors, Subrequests

**Real-time Logs:**
```bash
# Via CLI (recommended)
wrangler tail

# Or Dashboard → Workers & Pages → akamoney-api → Logs
```

### Billing and Usage

1. Dashboard → **Account** (bottom left)
2. Click **Billing**
3. View **Usage** tab for current period usage
4. Check against free tier limits

---

## Appendix: Troubleshooting Common Issues

### Issue: "Authentication required" when running wrangler

```bash
# Re-login
wrangler logout
wrangler login
```

### Issue: KV namespace not found

Ensure the ID in `wrangler.toml` matches the actual namespace:
```bash
wrangler kv:namespace list
```

### Issue: D1 migration fails

```bash
# Check if database exists
wrangler d1 list

# View existing tables
wrangler d1 execute akamoney-clicks --command="SELECT name FROM sqlite_master WHERE type='table';"
```

### Issue: CORS errors in browser

1. Check browser console for the exact origin
2. Add the origin to `src/index.ts` CORS config
3. Redeploy Workers

### Issue: 401 Unauthorized from API

1. Verify secrets are set:
   ```bash
   wrangler secret list
   ```
2. Check Entra ID application settings
3. Verify token audience matches `AZURE_CLIENT_ID`

### Issue: Pages deployment fails

1. Check build logs in Dashboard
2. Verify `package.json` scripts are correct
3. Check environment variables are set
4. Try local build first: `npm run build`

### Issue: Custom domain not working

1. Verify domain is active in Cloudflare
2. Check DNS records are correct
3. Wait for SSL certificate provisioning (up to 15 minutes)
4. Clear browser cache

---

## Appendix: GitHub Actions CI/CD Setup

自動化部署設定，推送到 `master` 分支時自動部署。

### Step 1: Create Cloudflare API Token

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Click your profile icon (top right) → **My Profile**
3. Select **API Tokens** tab
4. Click **Create Token**
5. Use template **Edit Cloudflare Workers**
6. Configure permissions:
   - **Account** → Workers KV Storage → Edit
   - **Account** → Workers Scripts → Edit
   - **Account** → D1 → Edit
   - **Account** → Cloudflare Pages → Edit
   - **Zone** → Zone → Read (if using custom domains)
7. Set **Account Resources** → Include → Your account
8. Click **Continue to summary** → **Create Token**
9. **Copy the token immediately** (won't be shown again)

### Step 2: Get Cloudflare Account ID

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Click **Workers & Pages**
3. Your **Account ID** is shown in the right sidebar
4. Copy it

### Step 3: Configure GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add:

| Secret Name | Value |
|-------------|-------|
| `CLOUDFLARE_API_TOKEN` | Your Cloudflare API token from Step 1 |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare Account ID from Step 2 |
| `AZURE_TENANT_ID` | Your Azure Entra ID Tenant ID |
| `AZURE_CLIENT_ID` | Your API application's Client ID |

### Step 4: Configure GitHub Variables

1. In the same page, click **Variables** tab
2. Click **New repository variable** and add:

| Variable Name | Value |
|---------------|-------|
| `VUE_APP_API_URL` | `https://akamoney-api.your-account.workers.dev` |
| `VUE_APP_CLIENT_ID` | Your frontend app Client ID |
| `VUE_APP_TENANT_ID` | Your Azure Tenant ID |
| `VUE_APP_API_CLIENT_ID` | Your API app Client ID |

### Step 5: Workflow File

The workflow file is already created at `.github/workflows/deploy-cloudflare.yml`.

It includes:
- **deploy-workers**: Deploys Workers API (auto on tag push, manual with option)
- **deploy-pages**: Builds and deploys frontend (auto on tag push, manual with option)
- **migrate-d1**: Runs D1 migrations (manual only, to prevent accidental schema changes)

### Step 6: Trigger Deployment

**Automatic (Tag-based Release):**
```bash
# 1. Commit your changes
git add .
git commit -m "feat: update short url feature"
git push origin master

# 2. Create and push a version tag to trigger deployment
git tag v1.0.0
git push origin v1.0.0
```

**Tag naming convention:**
- Format: `v<major>.<minor>.<patch>` (e.g., `v1.0.0`, `v1.2.3`)
- Use semantic versioning for releases

**Manual deployment:** 
1. Go to GitHub repository → **Actions**
2. Select **Deploy to Cloudflare** workflow
3. Click **Run workflow**
4. Select options:
   - **Deploy Workers**: Check to deploy API
   - **Deploy Pages**: Check to deploy frontend
   - **Run D1 Migrations**: Check to run database migrations
5. Click **Run workflow**

### Step 7: Monitor Deployment

1. Go to GitHub repository → **Actions**
2. Click on the running workflow
3. View logs for each job

### Workflow Triggers

| Trigger | Jobs Executed |
|---------|---------------|
| Push tag `v*` | deploy-workers, deploy-pages |
| Manual (workflow_dispatch) | Selected jobs only |

**Note:** D1 migrations are **manual only** to prevent accidental schema changes. Always review migrations before running.

### Troubleshooting CI/CD

**Issue: "Authentication error" in workflow**
- Verify `CLOUDFLARE_API_TOKEN` is correct
- Check token hasn't expired
- Ensure token has required permissions

**Issue: "Account ID not found"**
- Verify `CLOUDFLARE_ACCOUNT_ID` is correct
- Must be the Account ID, not Zone ID

**Issue: "D1 database not found"**
- Ensure database name in workflow matches `wrangler.toml`
- Database must be created first via CLI or Dashboard

**Issue: Build fails**
- Check build logs for specific error
- Ensure all environment variables are set
- Try building locally first: `npm run build`
