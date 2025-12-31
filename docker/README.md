# Docker 專案

這是一個使用 Docker 和 Docker Compose 構建的多服務開發環境專案。

## 專案簡介

本專案整合了多種開發工具和服務，提供一個完整的容器化開發環境，包含：

- **Web 服務**: Nginx、Go 應用程式
- **應用程式**: Python、C/C++ 開發環境
- **資料庫**: MongoDB、Redis
- **訊息佇列**: Kafka (含 Zookeeper)
- **開發工具**: Jenkins CI/CD、SVN 版本控制

## 專案結構

```
.
├── c/                    # C/C++ 應用程式
├── go/                   # Go 應用程式
├── py/                   # Python 應用程式
├── nginx/                # Nginx 配置檔案
├── jenkins/              # Jenkins CI/CD 配置
├── kafka/                # Kafka 配置檔案
├── docker-compose.yaml   # Docker Compose 配置
├── dockerfile1           # Dockerfile 1
├── dockerfile2           # Dockerfile 2
└── *.sh                  # Docker 相關腳本
```

## 快速開始

### 啟動所有服務

```bash
docker-compose up -d
```

### 停止所有服務

```bash
docker-compose down
```

### 查看服務狀態

```bash
docker-compose ps
```

## 服務端口

- **Nginx**: 8080
- **Jenkins**: 8082
- **MongoDB**: 27017
- **Redis**: 6379
- **SVN**: 3690
- **Kafka**: 9092
- **Zookeeper**: 2181

## 使用說明

### Go 應用程式

Go 應用程式會在容器啟動時自動運行，提供 HTTP 服務。

### Python 應用程式

Python 應用程式會在容器啟動時自動執行 `main.py`。

### C/C++ 開發環境

C/C++ 容器會保持運行狀態，可以進入容器進行編譯和測試：

```bash
docker-compose exec jamkao-c bash
```

## 相關腳本

專案包含多個 Docker 相關的腳本檔案，方便進行映像的建置、推送、執行等操作。

## 注意事項

- 首次啟動時，Docker 會自動下載所需的映像檔
- 資料會持久化保存在 Docker volumes 中
- 請確保系統已安裝 Docker 和 Docker Compose


