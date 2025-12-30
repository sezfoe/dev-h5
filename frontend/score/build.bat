@echo off
REM GitHub Pages 部署腳本
REM 將 score 目錄下的文件複製到 docs 目錄

echo ========================================
echo Score 頁面 GitHub Pages 部署腳本
echo ========================================
echo.

REM 設定路徑
set "SCORE_DIR=%~dp0"
set "DOCS_DIR=%~dp0..\..\docs"

REM 檢查 docs 目錄是否存在，不存在則創建
if not exist "%DOCS_DIR%" (
    echo 創建 docs 目錄...
    mkdir "%DOCS_DIR%"
)

REM 清空 docs 目錄（保留 .git 等隱藏文件）
echo 清理 docs 目錄...
for /f "delims=" %%i in ('dir /b /a-d "%DOCS_DIR%" 2^>nul') do del /q "%DOCS_DIR%\%%i"
for /f "delims=" %%i in ('dir /b /ad "%DOCS_DIR%" 2^>nul') do rd /s /q "%DOCS_DIR%\%%i"

REM 複製 score 頁面
echo 複製 score 頁面...
copy "%SCORE_DIR%index.html" "%DOCS_DIR%\index.html" >nul

echo.
echo ========================================
echo 部署完成！
echo ========================================
echo 已複製以下內容到 docs 目錄：
echo   - index.html (來自 score 目錄)
echo.
echo 現在可以提交到 GitHub 進行 Pages 部署了。
echo.
pause
