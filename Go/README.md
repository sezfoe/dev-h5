# Go 學習專案

這是一個 Go 語言學習與實驗專案，包含基礎語法練習、模組化開發範例以及並發編程實作。

## 📁 專案結構

```
.
├── main.go          # 主程式：示範 Channel、Timer 等並發功能
├── go.mod           # Go 模組定義檔
├── a/               # 本地模組 a
│   ├── a.go
│   └── go.mod
├── b/               # 本地模組 b
│   └── b.go
├── lesson/          # Go 教學課程
│   ├── lesson1_basics/           # 基礎語法
│   ├── lesson2_structs_methods/  # 結構體與方法
│   └── lesson3_concurrency/      # 並發編程
└── vendor/          # 依賴套件快取
```

## 🎯 專案內容

### 主程式 (main.go)
- **Channel 測試**: 示範 Goroutine 與 Channel 的基本使用
- **Timer 測試**: 展示 Ticker 和 AfterFunc 的使用方式
- **模組引用**: 使用本地模組 `a` 和 `b` 進行模組化開發

### 教學課程 (lesson/)
包含三個循序漸進的 Go 語言學習範例：
- **Lesson 1**: Go 基礎語法（變數、函數、控制結構）
- **Lesson 2**: 結構體與方法（物件導向基礎）
- **Lesson 3**: 並發編程（Goroutine、Channel、同步機制）

詳細內容請參考 [lesson/README.md](lesson/README.md)

## 🚀 快速開始

### 執行主程式
```bash
go run main.go
```

### 執行教學範例
```bash
cd lesson/lesson1_basics
go run main.go
```

## 📦 依賴管理

本專案使用 Go Modules 進行依賴管理：
- 本地模組 `a` 透過 `replace` 指令引用
- 模組 `b` 使用完整路徑 `main/b` 引用

## 🛠️ 技術重點

- **Go Modules**: 模組化開發與依賴管理
- **Goroutines**: 輕量級並發執行
- **Channels**: Goroutine 間的通訊機制
- **Timers**: 時間相關的並發控制
- **WaitGroup**: 等待多個 Goroutine 完成

## 📚 學習資源

- 各課程目錄下都有獨立的 README.md 說明文件
- 建議按照 Lesson 1 → 2 → 3 的順序學習
- 每個範例都可以直接執行並觀察結果

---

**Go 版本**: 1.24.0

