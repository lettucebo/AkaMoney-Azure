# CHANGELOG

## [Unreleased] Remove Cloudflare Content
- **Breaking Change**: Removed all Cloudflare-related code and documentation. The project now exclusively uses Azure for deployment.
- Remove: Deleted `src/cloudflare/` directory (Cloudflare Workers implementation)
- Remove: Deleted `docs/cloudflare/` directory (Cloudflare deployment documentation)
- Remove: Deleted root `package.json` and `package-lock.json` (contained only wrangler dependency)
- Update: Rewrote README.md and README.zh-TW.md for Azure deployment
- Update: Updated docs/README.md to remove Cloudflare references
- Update: Updated docs/devcontainer.md to remove Cloudflare Workers reference
- Update: Updated .devcontainer/devcontainer.json to remove wrangler and Cloudflare Workers port
- Update: Removed wrangler-based deployment scripts from frontend package.json
- **Migration Note**: For existing Cloudflare deployments, follow the Azure deployment guide in docs/infrastructure/README.md

## [Unreleased] Security Vulnerability Fix
- Security: Fix CVE-2024-38095 (CVSS 7.5) in System.Formats.Asn1 by adding explicit reference to 8.0.1
- Security: Fix CVE-2024-21319 (CVSS 6.8) in Microsoft.IdentityModel packages by upgrading Microsoft.Identity.Web from 2.15.3 to 4.1.1
- Security: Fix CVE-2019-0820 (CVSS 7.5) in System.Text.RegularExpressions by upgrading from 4.3.0 to 4.3.1
- Security: Fix CVE-2018-8292 (CVSS 7.5) in System.Net.Http by upgrading from 4.3.0 to 4.3.4
- Update: Upgraded Microsoft.Azure.WebJobs.Extensions.OpenApi from 1.5.1 to 1.6.0
- Added explicit package references to override vulnerable transitive dependencies

## [v2.0.0] [2025-06-04] Entra ID Authentication Rewrite
- Refactor: Frontend authentication now only supports Microsoft Entra ID, removed all mock/development login code.
- Refactor: Backend (AkaMoney.Functions) enforces Entra ID JWT authentication, removed all anonymous/dev mode.
- Docs: Updated .env.example, implementation plan, and README for new authentication flow.
- Infra: Ensure all configuration parameters (clientId, tenantId, api scope) are consistent across frontend, backend, and infra.
