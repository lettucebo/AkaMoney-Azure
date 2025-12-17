# AkaMoney 🔗

AkaMoney is a high-performance short URL service built on **Cloudflare's edge network**. Features Microsoft Entra ID authentication for secure management.

## 🌐 Architecture

AkaMoney runs entirely on Cloudflare's free tier:

- **Cloudflare Workers** - API & redirect service (100K requests/day free)
- **Cloudflare KV** - Short URL storage (100K reads/day free)
- **Cloudflare D1** - Click tracking database (5M rows read/day free)
- **Cloudflare Pages** - Vue 3 frontend (unlimited requests free)

## Authentication
- Frontend: Microsoft Entra ID via MSAL.js
- Backend: JWT verification in Workers

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

![AkaMoney Logo](docs/images/logo.png)

## ✨ Features

- 🚀 Quickly convert long URLs to short URLs
- 📊 Track click counts and sources
- 🔒 Secure management dashboard (requires Azure Entra ID login)
- 📅 Support for short URL expiration settings
- 🖼️ Support for social media sharing titles, descriptions, and images
- 🔍 Automatic management of short URL case sensitivity issues
- ⚡ Global edge deployment with ultra-low latency

## 🏗️ System Architecture

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

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (>= 18.x)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
- Cloudflare account (free tier is sufficient)
- Azure Entra ID application (for authentication)

### Dev Container

- VS Code + Docker Desktop recommended for a ready-to-use Dev Container
- Select `Dev Containers: Reopen in Container` to build the toolchain (Dotnet 8, Azure Functions Core Tools, Node 18, Wrangler, Azurite)
- See `docs/devcontainer.md` for details

### Local Development

1. Clone the repository
```bash
git clone https://github.com/lettucebo/AkaMoney.git
cd AkaMoney
```

2. Install dependencies
```bash
cd src/cloudflare/worker && npm install
cd ../akamoney-frontend && npm install
```

3. Configure environment variables
```bash
# Workers API
cp src/cloudflare/worker/.dev.vars.example src/cloudflare/worker/.dev.vars
# Edit .dev.vars with your Entra ID credentials

# Frontend
cp src/akamoney-frontend/.env.example src/akamoney-frontend/.env.local
# Edit .env.local with your settings
```

4. Initialize D1 database
```bash
cd src/cloudflare/worker
npm run db:migrate
```

5. Start development servers
```bash
# Option 1: Use the startup script
cd src/cloudflare
.\start-dev.ps1

# Option 2: Start manually
# Terminal 1: Workers API
cd src/cloudflare/worker && npm run dev

# Terminal 2: Frontend
cd src/akamoney-frontend && npm run serve
```

6. Access the application
   - Frontend: http://localhost:8080
   - API: http://localhost:8787

## 🚢 Deployment to Cloudflare

### 1. Create Cloudflare Resources

```bash
cd src/cloudflare/worker

# Create KV namespace
wrangler kv:namespace create SHORTURL_KV
wrangler kv:namespace create SHORTURL_KV --preview

# Create D1 database
wrangler d1 create akamoney-clicks
```

### 2. Update Configuration

Edit `src/cloudflare/worker/wrangler.toml` with the resource IDs from step 1.

### 3. Set Secrets

```bash
wrangler secret put AZURE_TENANT_ID
wrangler secret put AZURE_CLIENT_ID
```

### 4. Deploy

```bash
# Deploy Workers API
cd src/cloudflare/worker
npm run db:migrate:remote
npm run deploy

# Deploy Frontend to Pages
cd src/akamoney-frontend
npm run pages:deploy
```

For detailed deployment instructions, see [docs/cloudflare/deployment.md](docs/cloudflare/deployment.md).

## 📦 Tech Stack

### Backend (Cloudflare Workers)
- TypeScript
- Hono (web framework)
- jose (JWT verification)
- Cloudflare KV (key-value storage)
- Cloudflare D1 (SQLite database)

### Frontend
- Vue 3.3.x
- Vue Router 4.x
- Bootstrap 5.3.x
- Axios 1.x
- @azure/msal-browser 3.6.0
- Font Awesome 6.x

## 🆓 Free Tier Limits

| Service | Free Limit |
|---------|------------|
| Workers Requests | 100,000/day |
| KV Reads | 100,000/day |
| KV Writes | 1,000/day |
| KV Storage | 1 GB |
| D1 Rows Read | 5M/day |
| D1 Rows Written | 100K/day |
| D1 Storage | 5 GB |
| Pages | Unlimited |

## 🗂️ Legacy Azure Version

The original Azure-based implementation (Azure Functions + Table Storage) is preserved in the `src/AkaMoney.Functions` and `src/AkaMoney.Services` directories for reference.

## 📖 Documentation

Comprehensive documentation is available in the [docs](docs/) folder:

- **[Documentation Index](docs/README.md)** - Complete documentation overview
- **Getting Started**
  - [Dev Container Setup](docs/devcontainer.md)
  - [Cloudflare Setup Guide](docs/cloudflare/setup.md)
- **Deployment**
  - [Cloudflare Deployment Guide](docs/cloudflare/deployment.md)
  - [Azure Infrastructure Setup](docs/infrastructure/azure-setup.md)
- **Architecture & Design**
  - [Architecture Decision Records (ADRs)](docs/adr/)
  - [Implementation Plans](docs/implementation/)
- **Project Info**
  - [Project Requirements](docs/project-requirements.md)
  - [Changelog](CHANGELOG.md)

## 🤝 Contributing

Issues and Pull Requests are welcome!

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📮 Contact

Have any questions? Please open an [Issue](https://github.com/lettucebo/AkaMoney/issues).
