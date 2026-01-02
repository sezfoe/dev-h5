# H5 專案

這是一個多語言、多技術棧的學習與開發專案，包含前端應用、後端服務、電子書格式範例和容器化部署配置。

## 📁 專案結構

```
H5/
├── frontend/        # 前端專案（HTML/JS 應用、遊戲框架範例）
├── go/              # Go 語言學習與開發專案
├── docker/          # Docker 部署配置與多服務環境
├── epub/            # EPUB 電子書格式範例
├── docs/            # GitHub Pages 部署資料夾
└── README.md        # 本文件
```

## 🎯 各目錄說明

### frontend/
前端開發目錄，包含：
- **鼓譜編輯器**：16行播放模式的鼓譜編輯與播放工具（已部署至 GitHub Pages）
- **遊戲框架範例**：Kontra、Phaser、Pixi.js 等遊戲引擎範例
- **其他應用**：小說閱讀器、節拍器、工具頁面等

詳細說明請參考 [frontend/README.md](frontend/README.md)

### go/
Go 語言學習與開發專案，包含：
- **教學課程**：基礎語法、結構體與方法、並發編程
- **HTTP 服務器**：提供前端靜態文件和 API 服務
- **模組化開發範例**：本地模組引用與依賴管理

詳細說明請參考 [go/README.md](go/README.md)

### docker/
Docker 部署配置與多服務開發環境，包含：
- **多服務配置**：Go、Python、C/C++ 應用環境
- **基礎設施**：Nginx、MongoDB、Redis、Kafka、Jenkins 等
- **部署腳本**：構建、推送、運行等自動化腳本

詳細說明請參考 [docker/README.md](docker/README.md)

### epub/
EPUB 電子書格式範例，包含：
- **EPUB 結構範例**：完整的 EPUB 2.0/3.0 文件結構
- **核心文件**：mimetype、container.xml、content.opf 等
- **內容範例**：章節文件、樣式文件等

詳細說明請參考 [epub/README.md](epub/README.md)

### docs/
GitHub Pages 部署資料夾，包含：
- **鼓譜編輯器發布版本**：用於 GitHub Pages 靜態部署
- 透過 GitHub Pages 提供線上演示

## 🚀 快速開始

### 啟動 HTTP 服務器

```bash
cd go/server
go run main.go
```

服務器將在 `http://localhost:8800` 啟動，可訪問前端應用。

### 啟動 Docker 環境

```bash
cd docker
docker-compose up -d
```

詳細說明請參考各目錄的 README.md 文件。

## 📚 技術棧

- **後端**: Go (標準庫 net/http, zerolog)
- **前端**: HTML5, JavaScript, Canvas API, Web Audio API
- **遊戲框架**: Kontra, Phaser, Pixi.js
- **容器化**: Docker, Docker Compose
- **部署**: GitHub Pages

## 📝 線上演示

- **鼓譜編輯器**: [GitHub Pages 線上版本](https://[你的GitHub用戶名].github.io/[倉庫名]/)（透過 `docs` 資料夾部署）

---

**注意**：各子目錄都有獨立的 README.md 文件，提供更詳細的說明和使用指南。
