# AkaMoney Cloudflare Workers API

Short URL service built with Cloudflare Workers, KV, and D1.

## Prerequisites

- Node.js 18+
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
- Cloudflare account (free tier is sufficient)
- Azure Entra ID application (for authentication)

## Local Development

### 1. Install dependencies

```bash
cd src/cloudflare/worker
npm install
```

### 2. Configure environment variables

Copy `.dev.vars.example` to `.dev.vars` and fill in your Azure Entra ID credentials:

```bash
cp .dev.vars.example .dev.vars
```

Edit `.dev.vars`:
```
AZURE_TENANT_ID=your-tenant-id
AZURE_CLIENT_ID=your-api-client-id
```

### 3. Initialize D1 database

```bash
npm run db:migrate
```

### 4. Start development server

```bash
npm run dev
```

The API will be available at `http://localhost:8787`.

---

## Production Deployment

For complete deployment instructions, see **[deployment.md](deployment.md)**.

Quick deploy:
```bash
# 1. Create resources (first time only)
wrangler kv:namespace create SHORTURL_KV
wrangler d1 create akamoney-clicks

# 2. Update wrangler.toml with resource IDs

# 3. Set secrets
wrangler secret put AZURE_TENANT_ID
wrangler secret put AZURE_CLIENT_ID

# 4. Run migration
wrangler d1 execute CLICKS_DB --remote --file=../migrations/0001_create_clickinfo.sql

# 5. Deploy
npm run deploy
```

---

## API Endpoints

### Short URL Management (requires authentication)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/shorturl` | List all short URLs |
| GET | `/api/shorturl/generate` | Generate a random code |
| GET | `/api/shorturl/:code` | Get a short URL |
| POST | `/api/shorturl` | Create a short URL |
| PUT | `/api/shorturl/:code` | Update a short URL |
| DELETE | `/api/shorturl/:code` | Archive a short URL |

### Click Tracking (requires authentication)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/clicks/:code` | Get click records |
| GET | `/api/clicks/:code/count` | Get click count |
| GET | `/api/clicks/stats` | Get all statistics |

### Redirect (public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/:code` | Redirect to target URL |

## Free Tier Limits

| Service | Limit |
|---------|-------|
| Workers | 100,000 requests/day |
| KV Reads | 100,000/day |
| KV Writes | 1,000/day |
| D1 Rows Read | 5M/day |
| D1 Rows Written | 100K/day |

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  Cloudflare Edge Network                    │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐     ┌──────────────────────────────┐  │
│  │  Cloudflare Pages│     │    Cloudflare Workers        │  │
│  │  (Vue 3 SPA)     │────▶│  - /api/shorturl/*           │  │
│  │                  │     │  - /api/clicks/*             │  │
│  └──────────────────┘     │  - /:code (redirect)         │  │
│                           └──────────────────────────────┘  │
│                                  │           │              │
│                                  ▼           ▼              │
│                           ┌──────────┐ ┌──────────┐         │
│                           │    KV    │ │    D1    │         │
│                           │(shorturls)│ │(clickinfo)│        │
│                           └──────────┘ └──────────┘         │
└─────────────────────────────────────────────────────────────┘
```
