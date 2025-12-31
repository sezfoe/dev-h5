#!/bin/bash

# 模擬一個程式碼拉取操作
echo "Step 1: 拉取程式碼..."
echo "正在從 Git 倉庫拉取最新程式碼... (假裝)"
sleep 1
echo "程式碼拉取完成。"

# 模擬一個建置操作
echo "Step 2: 執行建置..."
GO_VERSION=$(go version 2>&1 || echo "Go 未安裝") # 檢查 Go 是否安裝
echo "Go 版本: ${GO_VERSION}"
echo "正在編譯 Go 應用程式... (假裝)"
sleep 2
echo "Go 應用程式編譯完成。產生可執行檔：my_app_executable"

# 模擬一個測試操作 (可能成功可能失敗)
echo "Step 3: 執行測試..."
RANDOM_FAIL=$(( RANDOM % 10 ))
if [ "$RANDOM_FAIL" -lt 3 ]; then # 30% 機率失敗
  echo "測試失敗！" >&2 # 輸出到標準錯誤
  exit 1
else
  echo "所有測試通過。"
fi

# 模擬一個部署操作
echo "Step 4: 部署應用程式..."
echo "正在將 my_app_executable 部署到生產環境... (假裝)"
sleep 1
echo "應用程式部署完成。"

echo "=== CICD 流程成功完成！ ==="
exit 0 # 確保腳本在成功時退出碼為0