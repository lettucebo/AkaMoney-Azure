# Dev Container

This repository includes a VS Code Dev Container for a consistent local setup.

## What's inside
- .NET 8 SDK with Azure Functions Core Tools v4
- Node.js 18 (with build tools)
- Global CLI tools: `wrangler@3`, `azurite@3`
- Pre-opened ports: 7071 (Functions), 8080 (frontend), 8787 (Workers), 10000-10002 (Azurite)
- Azurite auto-starts after the container boots and stores data under `.azurite`

## How to use
1. Install Docker Desktop and the VS Code Dev Containers extension.
2. Open this folder in VS Code and run `Dev Containers: Reopen in Container`.
3. After the container builds, tools are available globally. Use the usual scripts, for example:
   - `cd src/AkaMoney.Functions && func start --port 7071`
   - `cd src/akamoney-frontend && npm install && npm run serve`
   - `cd src/cloudflare/worker && npm install && npm run dev`
4. Storage emulator: Azurite runs automatically. To stop it, kill the `azurite` process inside the container.

## Notes
- Environment variables are not provisioned automatically. Copy local `.env` files (e.g., `.env.local`, `.dev.vars`) before starting services.
- If you prefer not to auto-start Azurite, remove `postStartCommand` from `.devcontainer/devcontainer.json`.
