# AkaMoney Cloudflare 部署指南

> **📝 完整文件已移至：[docs/cloudflare-deployment.md](../docs/cloudflare-deployment.md)**

此文件提供快速參考。完整的生產環境部署步驟說明請參閱上方連結。

## Quick Deploy

```bash
# 1. Install Wrangler and login
npm install -g wrangler
wrangler login

# 2. Create resources (first time only)
cd src/cloudflare/worker
wrangler kv namespace create SHORTURL_KV
wrangler d1 create akamoney-clicks

# 3. Update wrangler.toml with resource IDs

# 4. Set secrets
wrangler secret put AZURE_TENANT_ID
wrangler secret put AZURE_CLIENT_ID

# 5. Run migration
wrangler d1 execute akamoney-clicks --file=../migrations/0001_create_clickinfo.sql

# 6. Deploy
npm run deploy
```

## Quick Reference Commands

```bash
# Deploy Workers
cd src/cloudflare/worker && npm run deploy

# Deploy Pages
cd src/akamoney-frontend && npm run build && wrangler pages deploy dist --project-name=akamoney-frontend

# View logs
wrangler tail

# List KV keys
wrangler kv key list --namespace-id=YOUR_KV_ID

# Query D1
wrangler d1 execute akamoney-clicks --command="SELECT * FROM clickinfo LIMIT 10;"

# Check secrets
wrangler secret list
```

## Detailed Documentation

For complete deployment instructions including:
- Step-by-step account setup
- Resource creation (KV, D1)
- Frontend deployment to Cloudflare Pages
- Custom domain configuration
- Entra ID integration
- GitHub Actions CI/CD setup
- Troubleshooting guide
- Dashboard navigation guide

👉 **See [docs/cloudflare-deployment.md](../docs/cloudflare-deployment.md)**
