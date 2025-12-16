# CHANGELOG

## [Unreleased] Security Update
- Security: Updated Microsoft.Identity.Web from 2.15.3 to 4.1.1 to resolve CVE-2024-38095 (High severity) and CVE-2024-21319 (Medium severity)
- Fixed: Transitive dependency System.Formats.Asn1 updated from vulnerable RC version (8.0.0-rc.2.23479.6) to stable version (8.0.0)

## [v2.0.0] [2025-06-04] Entra ID Authentication Rewrite
- Refactor: Frontend authentication now only supports Microsoft Entra ID, removed all mock/development login code.
- Refactor: Backend (AkaMoney.Functions) enforces Entra ID JWT authentication, removed all anonymous/dev mode.
- Docs: Updated .env.example, implementation plan, and README for new authentication flow.
- Infra: Ensure all configuration parameters (clientId, tenantId, api scope) are consistent across frontend, backend, and infra.
