@echo off
REM GitHub Pages 部署腳本
REM 將 frontend 下的文件複製到 docs 目錄

echo ========================================
echo GitHub Pages 部署腳本
echo ========================================
echo.

REM 設定路徑
set "FRONTEND_DIR=%~dp0"
set "DOCS_DIR=%~dp0..\docs"

REM 檢查 docs 目錄是否存在，不存在則創建
if not exist "%DOCS_DIR%" (
    echo 創建 docs 目錄...
    mkdir "%DOCS_DIR%"
)

REM 清空 docs 目錄（保留 .git 等隱藏文件）
echo 清理 docs 目錄...
for /f "delims=" %%i in ('dir /b /a-d "%DOCS_DIR%" 2^>nul') do del /q "%DOCS_DIR%\%%i"
for /f "delims=" %%i in ('dir /b /ad "%DOCS_DIR%" 2^>nul') do rd /s /q "%DOCS_DIR%\%%i"

REM 複製主文件
echo 複製主文件...
copy "%FRONTEND_DIR%index.html" "%DOCS_DIR%\index.html" >nul
copy "%FRONTEND_DIR%index.js" "%DOCS_DIR%\index.js" >nul

REM 複製有連結的子資料夾
echo 複製子資料夾...
xcopy "%FRONTEND_DIR%teach" "%DOCS_DIR%\teach\" /E /I /Y >nul
xcopy "%FRONTEND_DIR%tool" "%DOCS_DIR%\tool\" /E /I /Y >nul
xcopy "%FRONTEND_DIR%test" "%DOCS_DIR%\test\" /E /I /Y >nul
xcopy "%FRONTEND_DIR%tailwind" "%DOCS_DIR%\tailwind\" /E /I /Y >nul
xcopy "%FRONTEND_DIR%kontra" "%DOCS_DIR%\kontra\" /E /I /Y >nul
xcopy "%FRONTEND_DIR%pixi" "%DOCS_DIR%\pixi\" /E /I /Y >nul
xcopy "%FRONTEND_DIR%phaser" "%DOCS_DIR%\phaser\" /E /I /Y >nul

echo.
echo ========================================
echo 部署完成！
echo ========================================
echo 已複製以下內容到 docs 目錄：
echo   - index.html
echo   - index.js
echo   - teach/
echo   - tool/
echo   - test/
echo   - tailwind/
echo   - kontra/
echo   - pixi/
echo   - phaser/
echo.
echo 現在可以提交到 GitHub 進行 Pages 部署了。
echo.
pause
