# AkaMoney Documentation

Welcome to the AkaMoney documentation! This folder contains all project documentation organized by topic.

## 📚 Documentation Structure

### Project Information
- **[project-requirements.md](project-requirements.md)** - Original project requirements and specifications (PROMPT.md)

### Development Guides
- **[devcontainer.md](devcontainer.md)** - Dev Container setup for consistent development environment

### Deployment & Infrastructure
- **[cloudflare/](cloudflare/)** - Cloudflare Workers, KV, D1, and Pages deployment
  - [README.md](cloudflare/README.md) - Cloudflare API architecture and endpoints
  - [deployment.md](cloudflare/deployment.md) - Complete Cloudflare deployment guide
- **[infrastructure/](infrastructure/)** - Azure infrastructure (legacy/alternative deployment)
  - [README.md](infrastructure/README.md) - Azure Bicep deployment and Service Principal setup

### Architecture Decision Records (ADR)
- **[adr/](adr/)** - Architecture decisions and rationale
  - [template.md](adr/template.md) - ADR template for new decisions
  - [2025-05-25-three-component-architecture.md](adr/2025-05-25-three-component-architecture.md) - Three-component architecture
  - [2025-05-25-azure-table-storage.md](adr/2025-05-25-azure-table-storage.md) - Azure Table Storage decision

### Implementation Plans
- **[implementation/](implementation/)** - Detailed implementation documentation
  - Various dated implementation plans for features and improvements

## 🚀 Quick Links

### Getting Started
1. Read the main [README.md](../README.md) for project overview
2. Check [devcontainer.md](devcontainer.md) for setting up your development environment
3. For Cloudflare deployment, see [cloudflare/deployment.md](cloudflare/deployment.md)
4. For Azure deployment, see [infrastructure/README.md](infrastructure/README.md)

### For Contributors
- Review [ADR](adr/) documents to understand architectural decisions
- Check [implementation/](implementation/) folder for feature implementation details
- Follow the patterns and conventions documented in ADRs

## 📝 Adding New Documentation

When adding new documentation:
1. Place it in the appropriate subfolder (cloudflare/, infrastructure/, adr/, implementation/)
2. Create a new folder if the topic doesn't fit existing categories
3. Update this README.md with a link to the new document
4. Use meaningful filenames with dates for time-sensitive content (e.g., YYYY-MM-DD-feature-name.md)
5. Keep the main project README.md in sync with major documentation changes

## 🔗 External References

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Vue 3 Documentation](https://vuejs.org/)
- [Azure Bicep Documentation](https://docs.microsoft.com/azure/azure-resource-manager/bicep/)
- [Microsoft Entra ID Documentation](https://docs.microsoft.com/azure/active-directory/)
