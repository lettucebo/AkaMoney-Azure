# Infrastructure Documentation

This folder contains infrastructure and deployment documentation for AkaMoney.

## 📚 Available Documentation

### [Azure Setup Guide (azure-setup.md)](azure-setup.md)
Documentation for Azure infrastructure deployment using Bicep.

**Contents:**
- Azure Service Principal creation guide
- Infrastructure as Code (IaC) with Bicep
- CI/CD setup for Azure
- Security best practices
- Resource deployment

## 🔗 Azure Infrastructure Files

The actual Bicep templates and deployment files are located in:
- **Bicep Templates**: [src/infra/](../../src/infra/)
- **Main Bicep File**: [src/infra/main.bicep](../../src/infra/main.bicep)

## 📝 Note

The current active implementation uses **Cloudflare** infrastructure. The Azure implementation is preserved for reference and legacy support.

For the current Cloudflare deployment, see [docs/cloudflare/](../cloudflare/).

## 🔗 Related Documentation

- [Cloudflare Deployment Guide](../cloudflare/deployment.md)
- [Architecture Decision Records](../adr/)
- [Main README](../README.md)
