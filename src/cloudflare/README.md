# AkaMoney Cloudflare Workers API

> **📝 Complete Documentation: [docs/cloudflare/README.md](../../docs/cloudflare/README.md)**

Short URL service built with Cloudflare Workers, KV, and D1.

## Quick Start

### Prerequisites

- Node.js 18+
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
- Cloudflare account (free tier is sufficient)
- Azure Entra ID application (for authentication)

### Local Development

1. **Install dependencies**
   ```bash
   cd src/cloudflare/worker
   npm install
   ```

2. **Configure environment variables**
   ```bash
   cp .dev.vars.example .dev.vars
   # Edit .dev.vars with your Azure Entra ID credentials
   ```

3. **Initialize D1 database**
   ```bash
   npm run db:migrate
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:8787`.

---

## Production Deployment

For complete deployment instructions, see **[DEPLOYMENT.md](DEPLOYMENT.md)** or **[docs/cloudflare/deployment.md](../../docs/cloudflare/deployment.md)**.

---

## Detailed Documentation

For complete information including:
- API endpoints documentation
- Architecture diagrams
- Free tier limits
- Development guidelines

👉 **See [docs/cloudflare/README.md](../../docs/cloudflare/README.md)**
