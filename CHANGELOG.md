# CHANGELOG

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
