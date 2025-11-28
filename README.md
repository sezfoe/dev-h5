# H5 專案

這是一個使用 Go 語言開發的 HTTP 服務器，用於提供前端靜態文件和處理 API 請求。

## 功能特點

- 靜態文件服務：自動提供前端 HTML/JS 文件
- API 請求處理：支援 GET 和 POST 請求
- CORS 支援：已啟用跨域資源共享
- 多種遊戲框架：包含 Kontra、Phaser、Pixi 等遊戲引擎範例
- EPUB 電子書：包含基本的 EPUB 文件結構和範例頁面

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
├── epub/                # EPUB 電子書文件目錄
│   ├── mimetype         # EPUB 文件類型定義
│   ├── META-INF/        # 元數據目錄
│   │   └── container.xml # 容器文件
│   └── OEBPS/           # 內容目錄
│       ├── content.opf  # 內容清單和元數據
│       ├── toc.ncx      # 目錄導航文件
│       ├── nav.xhtml    # EPUB 3.0 導航文件
│       ├── Text/        # 文本內容目錄
│       │   └── chapter1.xhtml # 範例章節
│       └── Styles/      # 樣式文件目錄
│           └── style.css # 基本樣式
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


## 建議架構
```
/js/
 ├─ core/                     ← 系統級邏輯（通用模組）
 │   ├─ scene_system.js       # 場景系統（背景、轉場、動畫）
 │   ├─ input_system.js       # 操作系統（鍵盤、觸控、搖桿）
 │   ├─ physics_system.js     # 碰撞、重力、運動邏輯
 │   ├─ sound_system.js       # 音效、音樂控制
 │   └─ ui_system.js          # 介面顯示、HUD
 │
 ├─ data/                     ← 純設定資料（不含邏輯）
 │   ├─ levels/
 │   │   ├─ level1.js         # 關卡設定（敵人、場景配置）
 │   │   ├─ level2.js
 │   │   └─ ...
 │   ├─ characters/
 │   │   ├─ hero.js           # 角色設定（血量、速度、模型）
 │   │   └─ enemy_slime.js
 │   └─ items/
 │       ├─ potion.js
 │       └─ sword.js
 │
 ├─ flows/                    ← 遊戲流程邏輯
 │   ├─ flow_title.js         # 標題畫面流程
 │   ├─ flow_stage.js         # 關卡流程（會引入 scene + level + character）
 │   ├─ flow_result.js        # 結算畫面流程
 │   └─ ...
 │
 ├─ main.js                   # 主頁面進入點（負責載入流程）
 └─ config.js                 # 全域設定（語言、平台模式）
```
