# EPUB 電子書專案

EPUB 格式電子書的結構範例和測試文件。

## 📁 目錄結構

```
epub/
├── mimetype              # EPUB 文件類型定義（必須為純文字，無 BOM）
├── META-INF/             # 元數據目錄
│   └── container.xml     # 容器文件（指向 OPF 文件）
├── OEBPS/                # 內容目錄（OEBPS = Open eBook Publication Structure）
│   ├── content.opf       # 內容清單和元數據（EPUB 核心文件）
│   ├── toc.ncx           # 目錄導航文件（EPUB 2.0）
│   ├── nav.xhtml         # 導航文件（EPUB 3.0）
│   ├── Text/             # 文本內容目錄
│   │   └── chapter1.xhtml # 範例章節
│   └── Styles/           # 樣式文件目錄
│       └── style.css     # 基本樣式
└── test.epub             # 打包後的 EPUB 文件（測試用）
```

## 📖 EPUB 格式說明

EPUB 是一種開放的電子書標準格式，基於 HTML、CSS 和 XML 技術。

### 核心文件

1. **mimetype**
   - 必須是純文字文件，內容為：`application/epub+zip`
   - 必須是 ZIP 文件的第一個文件（無壓縮）

2. **META-INF/container.xml**
   - 指向 OPF 文件的位置
   - EPUB 閱讀器首先讀取此文件

3. **OEBPS/content.opf**
   - 內容清單（manifest）：列出所有資源文件
   - 元數據（metadata）：書籍資訊（標題、作者等）
   - 線性閱讀順序（spine）：章節順序

4. **OEBPS/toc.ncx**（EPUB 2.0）
   - 目錄導航文件
   - 提供章節層級結構

5. **OEBPS/nav.xhtml**（EPUB 3.0）
   - EPUB 3.0 的導航文件
   - 使用 HTML5 格式

### 內容文件

- **Text/**：章節內容（XHTML 格式）
- **Styles/**：CSS 樣式文件
- 可包含圖片、字體等資源

## 🛠️ 使用方式

### 查看 EPUB 結構

直接瀏覽目錄結構，了解 EPUB 文件的組織方式。

### 測試 EPUB 文件

1. 使用 EPUB 閱讀器打開 `test.epub`
2. 或使用線上 EPUB 閱讀器測試

### 創建新的 EPUB

1. 按照現有結構添加新章節到 `OEBPS/Text/`
2. 在 `content.opf` 中註冊新文件
3. 更新 `toc.ncx` 和 `nav.xhtml` 的目錄結構
4. 使用 ZIP 工具打包（注意 `mimetype` 必須是第一個文件且無壓縮）

## 📝 EPUB 打包步驟

1. 確保 `mimetype` 文件存在且內容正確
2. 使用 ZIP 工具打包所有文件
3. **重要**：`mimetype` 必須是 ZIP 文件的第一個條目，且使用存儲模式（無壓縮）
4. 將 `.zip` 文件重命名為 `.epub`

### 使用命令行打包（Linux/Mac）

```bash
# 進入 epub 目錄
cd epub

# 創建 EPUB 文件（注意 mimetype 必須無壓縮且第一個）
zip -0Xq test.epub mimetype
zip -Xr test.epub META-INF OEBPS
```

### 使用命令行打包（Windows PowerShell）

```powershell
# 進入 epub 目錄
cd epub

# 創建 EPUB 文件
Compress-Archive -Path mimetype -DestinationPath temp.zip -CompressionLevel NoCompression
# 然後手動添加其他文件...
```

## 📚 參考資源

- [EPUB 3 規範](https://www.w3.org/publishing/epub3/)
- [EPUB 2 規範](https://idpf.org/epub/20/spec/)
- EPUB 閱讀器：Calibre、Adobe Digital Editions、Apple Books

## ⚠️ 注意事項

- `mimetype` 文件必須是純文字，無 BOM，無換行
- `mimetype` 在 ZIP 文件中必須是第一個條目且無壓縮
- 所有文件路徑使用正斜線 `/`
- XHTML 文件必須符合 XML 規範（標籤必須正確閉合）
- CSS 和圖片等資源需要在 `content.opf` 的 manifest 中註冊
