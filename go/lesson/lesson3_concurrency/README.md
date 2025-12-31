# Lesson 3: Go並發編程

## 學習目標
- 理解Goroutine的概念和使用
- 學習Channel的創建和使用
- 掌握同步機制（WaitGroup, Mutex）
- 了解select語句的使用
- 學習並發模式（Worker Pool, Pipeline）

## 範例說明

### 1. Goroutine基礎
- 創建和啟動goroutine
- goroutine與主程式的同步

### 2. Channel通信
- 無緩衝channel
- 有緩衝channel
- channel的方向性

### 3. 同步機制
- WaitGroup的使用
- Mutex互斥鎖
- select語句

### 4. 並發模式
- Worker Pool模式
- Pipeline模式
- Fan-in/Fan-out模式

## 執行方式
```bash
cd lesson3_concurrency
go run main.go
```

## 預期輸出
程式會展示各種並發編程概念，包括goroutine的執行、channel通信、以及同步機制的使用。





