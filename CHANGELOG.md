# CHANGELOG

## [v2.0.1] [2025-12-16] Security Update
- Security: Updated Microsoft.Identity.Web from 2.15.3 to 4.1.1 to resolve CVE-2024-38095 (High severity) and CVE-2024-21319 (Medium severity)
- Security: Added explicit System.Formats.Asn1 8.0.7+ reference, resolved to 9.0.0 (fixes CVE-2024-38095)
- Fixed: Transitive dependency System.Formats.Asn1 updated from vulnerable RC version (8.0.0-rc.2.23479.6) to secure version (9.0.0)
- Fixed: All Microsoft.IdentityModel packages updated to 8.15.0 (resolves CVE-2024-21319)

## [v2.0.0] [2025-06-04] Entra ID Authentication Rewrite
- Refactor: Frontend authentication now only supports Microsoft Entra ID, removed all mock/development login code.
- Refactor: Backend (AkaMoney.Functions) enforces Entra ID JWT authentication, removed all anonymous/dev mode.
- Docs: Updated .env.example, implementation plan, and README for new authentication flow.
- Infra: Ensure all configuration parameters (clientId, tenantId, api scope) are consistent across frontend, backend, and infra.
