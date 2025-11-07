# H5 專案

這是一個使用 Go 語言開發的 HTTP 服務器，用於提供前端靜態文件和處理 API 請求。

## 功能特點

- 靜態文件服務：自動提供前端 HTML/JS 文件
- API 請求處理：支援 GET 和 POST 請求
- CORS 支援：已啟用跨域資源共享
- 多種遊戲框架：包含 Kontra、Phaser、Pixi 等遊戲引擎範例

## 專案結構

```
H5/
├── main.go              # Go 服務器主程式
├── frontend/            # 前端文件目錄
│   ├── index.html       # 主頁面
│   ├── kontra/          # Kontra 遊戲框架範例
│   ├── phaser/          # Phaser 遊戲框架範例
│   ├── pixi/            # Pixi.js 遊戲框架範例
│   ├── tailwind/        # Tailwind CSS 範例
│   ├── tool/            # 工具頁面
│   └── test/            # 測試頁面
└── dev/                 # 開發環境文件
```

## 使用方法

### 啟動服務器

```bash
go run main.go
```

服務器將在 `http://localhost:8800` 啟動。

### 訪問前端

在瀏覽器中打開 `http://localhost:8800` 即可查看主頁面。

## API 使用

### GET 請求

```
GET http://localhost:8800/api?key=value
```

### POST 請求

```
POST http://localhost:8800/api
Content-Type: application/json

{
  "key": "value"
}
```

## 技術棧

- **後端**: Go (標準庫 net/http)
- **日誌**: zerolog
- **前端**: HTML5, JavaScript
- **遊戲框架**: Kontra, Phaser, Pixi.js


