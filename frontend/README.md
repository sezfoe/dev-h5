# Frontend 前端專案

前端開發目錄，包含多種 Web 應用、遊戲框架範例和工具頁面。

## 📁 目錄結構

```
frontend/
├── index.html          # 主頁面入口
├── index.js            # 主頁面邏輯
├── build.bat           # 構建腳本
│
├── score/              # 鼓譜編輯器（主要應用）
│   ├── index.html      # 16行播放模式鼓譜編輯器
│   └── build.bat       # 構建腳本
│
├── kontra/             # Kontra.js 遊戲框架範例
│   ├── index.html
│   └── index.js
│
├── phaser/             # Phaser 遊戲框架範例
│   ├── index.html
│   └── index.js
│
├── pixi/               # Pixi.js 遊戲框架範例
│   ├── index.html
│   └── index.js
│
├── tailwind/           # Tailwind CSS 範例
│   ├── index.html
│   └── index.js
│
├── novel/              # 小說閱讀器應用
│   ├── index.html
│   ├── js/main.js
│   └── yaml/           # 劇本資料（YAML 格式）
│
├── rhythm/             # 節奏相關頁面
│   └── index.html
│
├── metronome/          # 節拍器應用
│   └── index.html
│
├── teach/              # 教學頁面
│   └── index.html
│
├── tool/               # 工具頁面
│   ├── index.html
│   └── index.js
│
├── test/               # 測試頁面
│   ├── index.html
│   └── index.js
│
├── ui/                 # UI 元件範例
│   ├── u01.html
│   └── u02.html
│
└── dev/                # 開發環境
    ├── index.html
    └── index.js
```

## 🎯 主要應用

### 鼓譜編輯器 (score/)

功能完整的鼓譜編輯與播放工具，支援：

- **16行編輯模式**：最多 16 行鼓譜同時編輯
- **16拍編輯**：每行支援 16 個拍點（4 個小節，每小節 4 拍）
- **多種節奏模式**：單拍、雙拍、四連音、重音標記
- **即時播放**：使用 Web Audio API 進行音頻播放
- **BPM 調整**：40-220 BPM 可調節
- **音色選擇**：Snap 和 Noise 兩種音色
- **隨機填入**：支援多種節奏系列的隨機生成
- **鍵盤操作**：方向鍵移動、數字鍵切換節奏、Space 播放/停止
- **Canvas 繪圖**：使用 Canvas API 繪製樂譜符號

**技術實現**：
- 純前端實現，無需後端
- Web Audio API 音頻合成
- Canvas 2D 繪圖
- Web Worker 定時器
- 響應式設計

**部署**：已部署至 GitHub Pages（透過 `docs/` 資料夾）

### 小說閱讀器 (novel/)

互動式小說閱讀器，支援 YAML 格式的劇本資料。

## 🎮 遊戲框架範例

### Kontra.js
輕量級 HTML5 Canvas 遊戲引擎範例。

### Phaser
功能強大的 2D 遊戲框架範例。

### Pixi.js
高性能 2D WebGL 渲染引擎範例。

## 🛠️ 其他工具

- **節拍器 (metronome/)**：節拍器應用
- **節奏頁面 (rhythm/)**：節奏相關功能
- **工具頁面 (tool/)**：實用工具集合
- **UI 元件 (ui/)**：UI 元件範例
- **測試頁面 (test/)**：開發測試用頁面

## 🚀 使用方式

### 本地開發

1. 啟動 Go 服務器（根目錄）：
   ```bash
   go run main.go
   ```

2. 訪問前端頁面：
   - 主頁：`http://localhost:8800`
   - 鼓譜編輯器：`http://localhost:8800/score/`
   - 其他頁面：`http://localhost:8800/[子目錄名]/`

### 構建

某些子目錄包含 `build.bat` 構建腳本，可用於打包或處理文件。

## 📚 技術棧

- **HTML5**：結構標記
- **JavaScript (ES6+)**：邏輯實現
- **Canvas API**：2D 繪圖
- **Web Audio API**：音頻處理
- **Web Workers**：後台任務處理
- **遊戲框架**：Kontra、Phaser、Pixi.js
- **CSS 框架**：Tailwind CSS

## 📝 注意事項

- 所有頁面都是純前端實現，無需後端 API
- 部分功能需要現代瀏覽器支援（Web Audio API、Canvas）
- 鼓譜編輯器已配置 GitHub Pages 部署
