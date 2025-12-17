# AkaMoney 🔗

*[English](README.md) | 繁體中文*

AkaMoney 是一個建構在 **Azure** 上的高效能短網址服務，具備 Microsoft Entra ID 身份驗證，提供安全的管理功能。

## 🌐 架構

AkaMoney 運行在 Azure 上：

- **Azure Functions** - API 與轉址服務（.NET 8 isolated worker）
- **Azure Table Storage** - 短網址與點擊追蹤儲存
- **Azure Static Web Apps** - Vue 3 前端託管

## 身份驗證
- 前端：透過 MSAL.js 使用 Microsoft Entra ID
- 後端：在 Azure Functions 中進行 JWT 驗證

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

![AkaMoney Logo](docs/images/logo.png)

## ✨ 功能特色

- 🚀 快速將長網址轉換為短網址
- 📊 追蹤點擊次數與來源
- 🔒 安全的管理後台（需要 Azure Entra ID 登入）
- 📅 支援短網址有效期限設定
- 🖼️ 支援社群媒體分享標題、描述與圖片
- 🔍 自動處理短網址大小寫問題

## 🏗️ 系統架構

```
┌─────────────────────────────────────────────────────────────┐
│                        Azure                                │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐     ┌──────────────────────────────┐  │
│  │  Static Web Apps │     │      Azure Functions         │  │
│  │  (Vue 3 SPA)     │────▶│  - /api/shorturl/*           │  │
│  │                  │     │  - /api/clicks/*             │  │
│  └──────────────────┘     │  - /:code (轉址)              │  │
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

## 🚀 快速開始

### 系統需求

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js](https://nodejs.org/) (>= 16.x)
- [Azure Functions Core Tools](https://docs.microsoft.com/azure/azure-functions/functions-run-local)
- VS Code 搭配 Azurite 擴充套件（用於本地儲存模擬）
- Azure Entra ID 應用程式（用於身份驗證）

### Dev Container

- 建議使用 VS Code + Docker Desktop 以使用現成的 Dev Container
- 選擇 `Dev Containers: Reopen in Container` 來建置工具鏈（.NET 8、Azure Functions Core Tools、Node.js、Azurite）
- 詳細資訊請參閱 `docs/devcontainer.md`

### 本地開發

1. 複製儲存庫
```bash
git clone https://github.com/lettucebo/AkaMoney-Azure.git
cd AkaMoney-Azure
```

2. 啟動 Azurite（VS Code：F1 → "Azurite: Start"）

3. 啟動開發伺服器
```powershell
# 選項 1：使用啟動腳本（推薦）
.\start-akamoney.ps1

# 選項 2：手動啟動
# 終端機 1：Azure Functions API
cd src/AkaMoney.Functions && func start

# 終端機 2：前端
cd src/akamoney-frontend && npm install && npm run serve
```

4. 存取應用程式
   - 前端：http://localhost:8080
   - API：http://localhost:7071

## 🚢 部署至 Azure

### 使用 Azure Bicep

基礎架構定義在 `src/infra/main.bicep`。使用以下命令部署：

```bash
az deployment group create \
  --resource-group <your-resource-group> \
  --template-file src/infra/main.bicep \
  --parameters environmentName=prod
```

詳細的部署說明請參閱 [docs/infrastructure/README.md](docs/infrastructure/README.md)。

## 📦 技術堆疊

### 後端（Azure Functions）
- .NET 8（isolated worker 模式）
- Azure Table Storage
- Microsoft.Identity.Web（JWT 驗證）

### 前端
- Vue 3.3.x
- Vue Router 4.x
- Bootstrap 5.3.x
- Axios 1.x
- @azure/msal-browser 3.6.0
- Font Awesome 6.x

## 📖 文件

[docs/](docs/) 資料夾提供完整的文件：

- **[docs/README.md](docs/README.md)** - 文件索引與導覽指南
- **[docs/infrastructure/](docs/infrastructure/)** - Azure 基礎架構文件
- **[docs/devcontainer.md](docs/devcontainer.md)** - Dev Container 設定指南
- **[docs/adr/](docs/adr/)** - 架構決策記錄
- **[docs/implementation/](docs/implementation/)** - 功能實作細節
- **[docs/project-requirements.md](docs/project-requirements.md)** - 原始專案需求

## 🤝 貢獻

歡迎提交 Issues 和 Pull Requests！

## 📄 授權

本專案採用 MIT 授權條款 - 詳見 [LICENSE](LICENSE) 檔案。

## 📮 聯絡方式

有任何問題嗎？請開啟一個 [Issue](https://github.com/lettucebo/AkaMoney-Azure/issues)。
