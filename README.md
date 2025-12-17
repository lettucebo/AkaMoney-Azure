# AkaMoney 🔗

*English | [繁體中文](README.zh-TW.md)*

AkaMoney is a high-performance short URL service built on **Azure**. Features Microsoft Entra ID authentication for secure management.

## 🌐 Architecture

AkaMoney runs on Azure:

- **Azure Functions** - API & redirect service (.NET 8 isolated worker)
- **Azure Table Storage** - Short URL and click tracking storage
- **Azure Static Web Apps** - Vue 3 frontend hosting

## Authentication
- Frontend: Microsoft Entra ID via MSAL.js
- Backend: JWT verification in Azure Functions

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

![AkaMoney Logo](docs/images/logo.png)

## ✨ Features

- 🚀 Quickly convert long URLs to short URLs
- 📊 Track click counts and sources
- 🔒 Secure management dashboard (requires Azure Entra ID login)
- 📅 Support for short URL expiration settings
- 🖼️ Support for social media sharing titles, descriptions, and images
- 🔍 Automatic management of short URL case sensitivity issues

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Azure                                │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐     ┌──────────────────────────────┐  │
│  │  Static Web Apps │     │      Azure Functions         │  │
│  │  (Vue 3 SPA)     │────▶│  - /api/shorturl/*           │  │
│  │                  │     │  - /api/clicks/*             │  │
│  └──────────────────┘     │  - /:code (redirect)         │  │
│                           └──────────────────────────────┘  │
│                                       │                     │
│                                       ▼                     │
│                           ┌──────────────────────┐          │
│                           │  Azure Table Storage │          │
│                           │  - shorturls         │          │
│                           │  - clickinfo         │          │
│                           └──────────────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js](https://nodejs.org/) (>= 16.x)
- [Azure Functions Core Tools](https://docs.microsoft.com/azure/azure-functions/functions-run-local)
- VS Code with Azurite extension (for local storage emulation)
- Azure Entra ID application (for authentication)

### Dev Container

- VS Code + Docker Desktop recommended for a ready-to-use Dev Container
- Select `Dev Containers: Reopen in Container` to build the toolchain (.NET 8, Azure Functions Core Tools, Node.js, Azurite)
- See `docs/devcontainer.md` for details

### Local Development

1. Clone the repository
```bash
git clone https://github.com/lettucebo/AkaMoney-Azure.git
cd AkaMoney-Azure
```

2. Start Azurite (VS Code: F1 → "Azurite: Start")

3. Start development servers
```powershell
# Option 1: Use the startup script (recommended)
.\start-akamoney.ps1

# Option 2: Start manually
# Terminal 1: Azure Functions API
cd src/AkaMoney.Functions && func start

# Terminal 2: Frontend
cd src/akamoney-frontend && npm install && npm run serve
```

4. Access the application
   - Frontend: http://localhost:8080
   - API: http://localhost:7071

## 🚢 Deployment to Azure

### Using Azure Bicep

The infrastructure is defined in `src/infra/main.bicep`. Deploy using:

```bash
az deployment group create \
  --resource-group <your-resource-group> \
  --template-file src/infra/main.bicep \
  --parameters environmentName=prod
```

For detailed deployment instructions, see [docs/infrastructure/README.md](docs/infrastructure/README.md).

## 📦 Tech Stack

### Backend (Azure Functions)
- .NET 8 (isolated worker model)
- Azure Table Storage
- Microsoft.Identity.Web (JWT verification)

### Frontend
- Vue 3.3.x
- Vue Router 4.x
- Bootstrap 5.3.x
- Axios 1.x
- @azure/msal-browser 3.6.0
- Font Awesome 6.x

## 📖 Documentation

Comprehensive documentation is available in the [docs/](docs/) folder:

- **[docs/README.md](docs/README.md)** - Documentation index and navigation guide
- **[docs/infrastructure/](docs/infrastructure/)** - Azure infrastructure documentation
- **[docs/devcontainer.md](docs/devcontainer.md)** - Dev Container setup guide
- **[docs/adr/](docs/adr/)** - Architecture Decision Records
- **[docs/implementation/](docs/implementation/)** - Feature implementation details
- **[docs/project-requirements.md](docs/project-requirements.md)** - Original project requirements

## 🤝 Contributing

Issues and Pull Requests are welcome!

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📮 Contact

Have any questions? Please open an [Issue](https://github.com/lettucebo/AkaMoney-Azure/issues).
