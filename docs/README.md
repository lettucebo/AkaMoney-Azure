# AkaMoney Documentation

Welcome to the AkaMoney documentation! This folder contains all project documentation organized by topic.

## 📚 Table of Contents

### Getting Started
- [Dev Container Setup](devcontainer.md) - VS Code Dev Container configuration guide

### Project Information
- [Project Requirements](project-requirements.md) - Original project requirements and specifications (Chinese)

### Deployment & Infrastructure

#### Cloudflare (Current Implementation)
- [Cloudflare Setup Guide](cloudflare/setup.md) - Local development and quick start
- [Cloudflare Deployment Guide](cloudflare/deployment.md) - Complete production deployment steps

#### Azure (Legacy)
- [Azure Infrastructure Setup](infrastructure/azure-setup.md) - Azure Bicep and Service Principal guide

### Architecture & Design
- [Architecture Decision Records (ADRs)](adr/) - Technical decisions and rationale
  - [Template](adr/template.md) - ADR template for new decisions
  - [Three-Component Architecture](adr/2025-05-25-three-component-architecture.md)
  - [Azure Table Storage](adr/2025-05-25-azure-table-storage.md)

### Implementation Details
See [implementation/](implementation/) folder for detailed implementation plans:
- [Entra ID Authentication Rewrite](implementation/2025-06-04-entra-id-auth-rewrite.md)
- [Azure Functions Flex Consumption Deployment](implementation/2025-06-10-azure-functions-flex-consumption-deployment.md)
- [Merge Redirect Functions](implementation/2025-05-25-merge-redirect-functions.md)
- [One-Click Startup Script](implementation/2025-05-25-one-click-startup-script.md)
- And more...

## 📂 Documentation Structure

```
docs/
├── README.md                    # This file - documentation index
├── project-requirements.md      # Original project requirements
├── devcontainer.md             # Dev container setup
│
├── cloudflare/                 # Cloudflare implementation docs
│   ├── setup.md               # Local development guide
│   └── deployment.md          # Production deployment guide
│
├── infrastructure/             # Infrastructure as Code
│   └── azure-setup.md         # Azure resources and service principal
│
├── adr/                        # Architecture Decision Records
│   ├── template.md
│   └── ...
│
└── implementation/             # Implementation plans
    └── ...
```

## 🔗 External Documentation

### Component-Specific Documentation
- **Frontend**: See [src/akamoney-frontend/README.md](../src/akamoney-frontend/README.md) for Vue.js setup
- **Cloudflare Worker**: See [src/cloudflare/README.md](../src/cloudflare/README.md) for worker-specific details
- **Infrastructure**: See [src/infra/README.md](../src/infra/README.md) for Bicep templates

### Main Repository Documentation
- [Main README](../README.md) - Project overview and quick start
- [CHANGELOG](../CHANGELOG.md) - Version history and changes

## 📝 Contributing to Documentation

When adding new documentation:

1. **Implementation Plans**: Place in `implementation/` with format `YYYY-MM-DD-feature-name.md`
2. **Architecture Decisions**: Use the [ADR template](adr/template.md) and place in `adr/`
3. **General Guides**: Choose the appropriate subfolder or create a new one
4. **Update This Index**: Add links to new documents in this README

## 🌐 Documentation Language

- Code and technical documentation: English
- User-facing content: English with occasional Chinese notes
- ADRs and implementation plans: Flexible based on team preference
