# AkaMoney 🔗

*[English](README.md) | 繁體中文*

AkaMoney 是一個建構在 **Cloudflare 邊緣網路**上的高效能短網址服務，具備 Microsoft Entra ID 身份驗證，提供安全的管理功能。

## 🌐 架構

AkaMoney 完全運行在 Cloudflare 免費方案上：

- **Cloudflare Workers** - API 與轉址服務（每日 10 萬次免費請求）
- **Cloudflare KV** - 短網址儲存（每日 10 萬次免費讀取）
- **Cloudflare D1** - 點擊追蹤資料庫（每日 500 萬行免費讀取）
- **Cloudflare Pages** - Vue 3 前端（無限制免費請求）

## 身份驗證
- 前端：透過 MSAL.js 使用 Microsoft Entra ID
- 後端：在 Workers 中進行 JWT 驗證

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

![AkaMoney Logo](docs/images/logo.png)

## ✨ 功能特色

- 🚀 快速將長網址轉換為短網址
- 📊 追蹤點擊次數與來源
- 🔒 安全的管理後台（需要 Azure Entra ID 登入）
- 📅 支援短網址有效期限設定
- 🖼️ 支援社群媒體分享標題、描述與圖片
- 🔍 自動處理短網址大小寫問題
- ⚡ 全球邊緣部署，超低延遲

## 🏗️ 系統架構

```
┌─────────────────────────────────────────────────────────────┐
│                  Cloudflare 邊緣網路                         │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐     ┌──────────────────────────────┐  │
│  │  Cloudflare Pages│     │    Cloudflare Workers        │  │
│  │  (Vue 3 SPA)     │────▶│  - /api/shorturl/*           │  │
│  │                  │     │  - /api/clicks/*             │  │
│  └──────────────────┘     │  - /:code (轉址)              │  │
│                           └──────────────────────────────┘  │
│                                  │           │              │
│                                  ▼           ▼              │
│                           ┌──────────┐ ┌──────────┐         │
│                           │    KV    │ │    D1    │         │
│                           │(短網址)   │ │(點擊資訊) │         │
│                           └──────────┘ └──────────┘         │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 快速開始

### 系統需求

- [Node.js](https://nodejs.org/) (>= 18.x)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
- Cloudflare 帳號（免費方案即可）
- Azure Entra ID 應用程式（用於身份驗證）

### Dev Container

- 建議使用 VS Code + Docker Desktop 以使用現成的 Dev Container
- 選擇 `Dev Containers: Reopen in Container` 來建置工具鏈（Dotnet 8、Azure Functions Core Tools、Node 18、Wrangler、Azurite）
- 詳細資訊請參閱 `docs/devcontainer.md`

### 本地開發

1. 複製儲存庫
```bash
git clone https://github.com/lettucebo/AkaMoney.git
cd AkaMoney
```

2. 安裝相依套件
```bash
cd src/cloudflare/worker && npm install
cd ../akamoney-frontend && npm install
```

3. 設定環境變數
```bash
# Workers API
cp src/cloudflare/worker/.dev.vars.example src/cloudflare/worker/.dev.vars
# 使用您的 Entra ID 憑證編輯 .dev.vars

# 前端
cp src/akamoney-frontend/.env.example src/akamoney-frontend/.env.local
# 編輯 .env.local 進行設定
```

4. 初始化 D1 資料庫
```bash
cd src/cloudflare/worker
npm run db:migrate
```

5. 啟動開發伺服器
```bash
# 選項 1：使用啟動腳本
cd src/cloudflare
.\start-dev.ps1

# 選項 2：手動啟動
# 終端機 1：Workers API
cd src/cloudflare/worker && npm run dev

# 終端機 2：前端
cd src/akamoney-frontend && npm run serve
```

6. 存取應用程式
   - 前端：http://localhost:8080
   - API：http://localhost:8787

## 🚢 部署至 Cloudflare

### 1. 建立 Cloudflare 資源

```bash
cd src/cloudflare/worker

# 建立 KV 命名空間
wrangler kv:namespace create SHORTURL_KV
wrangler kv:namespace create SHORTURL_KV --preview

# 建立 D1 資料庫
wrangler d1 create akamoney-clicks
```

### 2. 更新設定

使用步驟 1 的資源 ID 編輯 `src/cloudflare/worker/wrangler.toml`。

### 3. 設定機密資訊

```bash
wrangler secret put AZURE_TENANT_ID
wrangler secret put AZURE_CLIENT_ID
```

### 4. 部署

```bash
# 部署 Workers API
cd src/cloudflare/worker
npm run db:migrate:remote
npm run deploy

# 部署前端至 Pages
cd src/akamoney-frontend
npm run pages:deploy
```

詳細的部署說明請參閱 [docs/cloudflare/deployment.md](docs/cloudflare/deployment.md)。

## 📦 技術堆疊

### 後端（Cloudflare Workers）
- TypeScript
- Hono（網頁框架）
- jose（JWT 驗證）
- Cloudflare KV（鍵值儲存）
- Cloudflare D1（SQLite 資料庫）

### 前端
- Vue 3.3.x
- Vue Router 4.x
- Bootstrap 5.3.x
- Axios 1.x
- @azure/msal-browser 3.6.0
- Font Awesome 6.x

## 🆓 免費方案限制

| 服務 | 免費限制 |
|---------|------------|
| Workers 請求 | 100,000 次/天 |
| KV 讀取 | 100,000 次/天 |
| KV 寫入 | 1,000 次/天 |
| KV 儲存空間 | 1 GB |
| D1 讀取行數 | 500 萬/天 |
| D1 寫入行數 | 10 萬/天 |
| D1 儲存空間 | 5 GB |
| Pages | 無限制 |

## 📖 文件

[docs/](docs/) 資料夾提供完整的文件：

- **[docs/README.md](docs/README.md)** - 文件索引與導覽指南
- **[docs/cloudflare/](docs/cloudflare/)** - Cloudflare 部署指南
- **[docs/infrastructure/](docs/infrastructure/)** - Azure 基礎架構文件
- **[docs/devcontainer.md](docs/devcontainer.md)** - Dev Container 設定指南
- **[docs/adr/](docs/adr/)** - 架構決策記錄
- **[docs/implementation/](docs/implementation/)** - 功能實作細節
- **[docs/project-requirements.md](docs/project-requirements.md)** - 原始專案需求

## 🗂️ 舊版 Azure 版本

原始的 Azure 版本實作（Azure Functions + Table Storage）保留在 `src/AkaMoney.Functions` 和 `src/AkaMoney.Services` 目錄中供參考。

## 🤝 貢獻

歡迎提交 Issues 和 Pull Requests！

## 📄 授權

本專案採用 MIT 授權條款 - 詳見 [LICENSE](LICENSE) 檔案。

## 📮 聯絡方式

有任何問題嗎？請開啟一個 [Issue](https://github.com/lettucebo/AkaMoney/issues)。
