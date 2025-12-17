# AkaMoney Cloudflare Deployment

> **📝 Complete Documentation: [docs/cloudflare/deployment.md](../../docs/cloudflare/deployment.md)**

This file provides a quick reference. For complete production deployment steps, please refer to the link above.

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

# 4. Run migration (use binding name CLICKS_DB)
wrangler d1 execute CLICKS_DB --remote --file=../migrations/0001_create_clickinfo.sql

# 5. Set secrets
wrangler secret put AZURE_TENANT_ID
wrangler secret put AZURE_CLIENT_ID

# 6. Deploy
npm run deploy
```

---

For detailed deployment instructions including:
- Cloudflare account setup
- KV / D1 resource creation
- Frontend deployment to Cloudflare Pages
- Custom Domain configuration
- Entra ID integration
- GitHub Actions CI/CD setup
- Troubleshooting guide

👉 **See [docs/cloudflare/deployment.md](../../docs/cloudflare/deployment.md)**
