# H5 專案

這是一個使用 Go 語言開發的 HTTP 服務器，用於提供前端靜態文件和處理 API 請求。

## 功能特點

- 靜態文件服務：自動提供前端 HTML/JS 文件
- API 請求處理：支援 GET 和 POST 請求
- CORS 支援：已啟用跨域資源共享
- 多種遊戲框架：包含 Kontra、Phaser、Pixi 等遊戲引擎範例
- EPUB 電子書：包含基本的 EPUB 文件結構和範例頁面
- **鼓譜編輯器**：16行播放模式的鼓譜編輯與播放工具（已部署至 GitHub Pages）

## 線上演示

- **鼓譜編輯器**: [GitHub Pages 線上版本](https://[你的GitHub用戶名].github.io/[倉庫名]/)（透過 `docs` 資料夾部署）

## GitHub Pages 部署

本專案的鼓譜編輯器已配置為透過 GitHub Pages 發布：

- **部署資料夾**: `docs/` - 包含鼓譜編輯器的發布版本
- **原始碼位置**: `frontend/score/score.html`
- **部署方式**: 在 GitHub 倉庫設定中，將 Pages 來源設為 `docs` 資料夾

### 部署步驟

1. 將 `frontend/score/score.html` 複製到 `docs/index.html`
2. 在 GitHub 倉庫設定中：
   - 前往 Settings → Pages
   - Source 選擇 "Deploy from a branch"
   - Branch 選擇主分支（如 `main`）
   - Folder 選擇 `/docs`
3. 儲存後，GitHub Pages 會自動部署

## 專案結構

```
H5/
├── main.go              # Go 服務器主程式
├── docs/                # GitHub Pages 部署資料夾
│   └── index.html       # 鼓譜編輯器發布版本
├── frontend/            # 前端文件目錄
│   ├── index.html       # 主頁面
│   ├── score/           # 鼓譜編輯器（原始碼）
│   │   └── score.html   # 16行播放模式鼓譜編輯器
│   ├── kontra/          # Kontra 遊戲框架範例
│   ├── phaser/          # Phaser 遊戲框架範例
│   ├── pixi/            # Pixi.js 遊戲框架範例
│   ├── tailwind/        # Tailwind CSS 範例
│   ├── rhythm/          # 節奏相關頁面
│   ├── metronome/       # 節拍器頁面
│   ├── tool/            # 工具頁面
│   ├── test/            # 測試頁面
│   └── ui/              # UI 元件範例
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

## 鼓譜編輯器功能

鼓譜編輯器（`frontend/score/score.html`）是一個功能完整的鼓譜編輯與播放工具：

### 主要功能

- **16行編輯模式**: 支援最多 16 行鼓譜同時編輯
- **16拍編輯**: 每行支援 16 個拍點（4 個小節，每小節 4 拍）
- **多種節奏模式**: 
  - 單拍（1/4）
  - 雙拍（2/8）
  - 四連音（4/16）
  - 重音標記
- **即時播放**: 使用 Web Audio API 進行音頻播放
- **BPM 調整**: 40-220 BPM 可調節
- **音色選擇**: Snap 和 Noise 兩種音色
- **隨機填入**: 支援多種節奏系列的隨機生成
- **鍵盤操作**: 
  - 方向鍵移動焦點
  - 數字鍵 1-8 切換節奏類型
  - Space 播放/停止
- **Canvas 繪圖**: 使用 Canvas API 繪製樂譜符號

### 技術實現

- 純前端實現，無需後端
- Web Audio API 音頻合成
- Canvas 2D 繪圖
- Web Worker 定時器
- 響應式設計

## 技術棧

- **後端**: Go (標準庫 net/http)
- **日誌**: zerolog
- **前端**: HTML5, JavaScript, Canvas API, Web Audio API
- **遊戲框架**: Kontra, Phaser, Pixi.js
- **部署**: GitHub Pages


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
