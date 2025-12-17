# AkaMoney Cloudflare Deployment

This document provides complete Cloudflare deployment instructions, including deployment steps for Workers API and Pages frontend.

---

## Quick Deploy

```bash
# 1. Install Wrangler and login
npm install -g wrangler
wrangler login

# 2. Create resources (first time only)
cd src/cloudflare/worker
wrangler kv namespace create SHORTURL_KV
wrangler kv namespace create SHORTURL_KV --preview
wrangler d1 create akamoney-clicks

# 3. Update wrangler.toml with resource IDs

# 4. Run migration
wrangler d1 execute akamoney-clicks --file=../migrations/0001_create_clickinfo.sql

# 5. Set secrets
wrangler secret put AZURE_TENANT_ID
wrangler secret put AZURE_CLIENT_ID

# 6. Deploy
npm run deploy
```

---

## Quick Reference Commands

```bash
# Deploy Workers API
cd src/cloudflare/worker && npm run deploy

# Deploy Frontend to Pages
cd src/akamoney-frontend && npm run build && wrangler pages deploy dist --project-name=akamoney-frontend

# View real-time logs
wrangler tail

# List KV namespaces
wrangler kv namespace list

# List KV keys
wrangler kv key list --namespace-id=YOUR_KV_ID

# Query D1 database
wrangler d1 execute akamoney-clicks --command="SELECT * FROM clickinfo LIMIT 10;"

# Check secrets
wrangler secret list
```

---

## Current Resource IDs

| Resource | ID |
|----------|-----|
| KV (Production) | `0de8694fdd794c1893c3f709ecf722d9` |
| KV (Preview) | `118ec6fab2cc4cdfa648fadf68d22cfa` |
| D1 Database | `131d3b75-59f5-41f2-863b-c5743c248349` |

---

## Detailed Documentation

The full deployment guide includes:
- Cloudflare account setup
- KV / D1 resource creation
- Frontend deployment to Cloudflare Pages
- Custom domain configuration
- Entra ID integration
- GitHub Actions CI/CD configuration
- Troubleshooting guide

👉 See the complete documentation in this file for detailed information.
