# AkaMoney Frontend

Vue 3 frontend application for AkaMoney short URL management.

## Quick Start

### Install dependencies
```bash
npm install
```

### Development server
```bash
npm run serve
```
The application will be available at `http://localhost:8080`.

### Build for production
```bash
npm run build
```

### Lint and fix files
```bash
npm run lint
```

## Configuration

Copy `.env.example` to `.env.local` and configure your environment variables:
- `VUE_APP_API_URL` - API endpoint URL
- `VUE_APP_CLIENT_ID` - Azure Entra ID client ID
- `VUE_APP_TENANT_ID` - Azure Entra ID tenant ID
- `VUE_APP_API_CLIENT_ID` - API client ID

## Documentation

For complete project documentation, see the main [README.md](../../README.md) and [docs/](../../docs/) folder.

### Customize configuration
See [Vue CLI Configuration Reference](https://cli.vuejs.org/config/).
