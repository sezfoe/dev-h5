#!/bin/bash

# 拷貝app並執行
#docker run -d -p 8080:8080 -v ./app:/app --name jamkao-app jamkao-app:latest /app

# 映像包含app
docker run -d -p 8080:8080 --name jamkao-app jamkao-app:latest
