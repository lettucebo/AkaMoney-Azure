# AkaMoney Project Guidelines

## Architecture Overview
AkaMoney is a short URL service with three-component architecture:
- **AkaMoney.Functions** (.NET 8 Azure Functions v4) - Combined Management API + Redirect service on port 7071
- **AkaMoney.Services** - Business logic layer with service interfaces and Azure Table Storage integration
- **akamoney-frontend** (Vue 3) - Management SPA on port 8080, Entra ID authentication via MSAL.js

### Data Flow
1. Frontend → API (`/api/shorturl/*`) with Bearer token → ShortUrlService → Azure Table Storage (`shorturls`, `clickinfo` tables)
2. Redirect requests → `/{code}` route → RedirectFunction → ClickTrackingService (async) → 302 redirect

### Key Files
- `src/AkaMoney.Functions/Program.cs` - DI setup, Entra ID auth configuration
- `src/AkaMoney.Services/Services/ShortUrlService.cs` - Core URL operations with Table Storage
- `src/AkaMoney.Services/Models/ShortUrlEntity.cs` - Table entity with PartitionKey="ShortUrl", RowKey=code
- `src/infra/main.bicep` - Azure deployment (FlexConsumption Functions, Static Web App, Storage)

## Local Development
```powershell
# One-click startup (recommended)
.\start-akamoney.ps1

# Manual: Start Azurite first (VS Code: F1 → "Azurite: Start"), then:
cd src/AkaMoney.Functions && func start      # Port 7071
cd src/akamoney-frontend && npm run serve    # Port 8080
```

Required tools: .NET 8 SDK, Node.js 16+, Azure Functions Core Tools, VS Code Azurite extension

## Code Patterns

### Backend (.NET)
- Services implement interfaces in `AkaMoney.Services/Interfaces/`
- Table entities use fixed PartitionKey + meaningful RowKey (e.g., short URL code)
- Support both connection string (local) and Managed Identity (production) for Table Storage
- All XML doc comments in English on classes, methods, and properties

### Frontend (Vue 3)
- Auth via `services/authService.js` - must call `initializeAuth()` at startup
- API calls via `services/apiService.js` - axios with automatic Bearer token injection
- Environment: `VUE_APP_API_URL`, `VUE_APP_CLIENT_ID`, `VUE_APP_TENANT_ID`, `VUE_APP_API_CLIENT_ID`

## Documentation Requirements
- Update `/docs` when modifying features; keep README.md in sync
- Maintain `CHANGELOG.md` entries
- Implementation plans: `/docs/implementation/<date>-<feature-name>.md`
- ADRs for major decisions: `/docs/adr/` (follow `/docs/adr/template.md`)

## Git & Workflow
- Conventional Commits in English: `feat(api): add endpoint`, `fix(frontend): handle null`
- Commit each step separately; reference GitHub issues in messages
- 分階段實作：先在 GitHub 新增 issue 追蹤進度，每步驟完成後更新 issue 並加 comment
- When creating issues, add corresponding labels

## General
- Copilot responses in zh-tw; code/comments in English
- DO NOT BE LAZY. DO NOT OMIT CODE.
- OS: Windows 11