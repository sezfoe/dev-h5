package main

import (
	"encoding/json"
	"io"
	"net/http"

	"github.com/rs/zerolog/log"
)

func main() {
	// 設置 HTTP 服務器
	mux := http.NewServeMux()

	// 統一路由處理器 - 處理所有請求
	mux.HandleFunc("/", handleAll)

	// 啟動服務器
	port := ":8800"
	log.Info().Str("port", port).Msg("服務器啟動中...")
	log.Info().Msg("訪問 http://localhost:8800 查看前端")

	if err := http.ListenAndServe(port, mux); err != nil {
		log.Fatal().Err(err).Msg("服務器啟動失敗")
	}
}

// handleAll 處理所有路由請求
func handleAll(w http.ResponseWriter, r *http.Request) {
	// 設置 CORS 頭
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	// 處理 OPTIONS 預檢請求
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	// 嘗試服務靜態文件
	if serveStaticFile(w, r) {
		return
	}

	// 否則作為 API 請求處理
	handleRequest(w, r)
}

// serveStaticFile 嘗試服務靜態文件
func serveStaticFile(w http.ResponseWriter, r *http.Request) bool {
	// 如果路徑是根目錄或者是靜態文件請求，嘗試提供文件
	if r.URL.Path == "/" || r.URL.Path == "" {
		r.URL.Path = "/index.html"
	}

	// 使用文件服務器
	fs := http.FileServer(http.Dir("./"))
	// 檢查文件是否存在
	f, err := http.Dir("./").Open(r.URL.Path[1:])
	if err != nil {
		return false
	}
	f.Close()

	fs.ServeHTTP(w, r)
	return true
}

// handleRequest 處理 API 請求
func handleRequest(w http.ResponseWriter, r *http.Request) {
	// 設置 JSON Content-Type
	w.Header().Set("Content-Type", "application/json")

	log.Info().Str("method", r.Method).Str("path", r.URL.Path).Msg("收到請求")

	var result map[string]interface{}

	// 如果是 POST 請求，讀取 body 並原樣返回
	if r.Method == "POST" {
		body, err := io.ReadAll(r.Body)
		if err == nil && len(body) > 0 {
			// 嘗試解析為 JSON
			var jsonData map[string]interface{}
			if err := json.Unmarshal(body, &jsonData); err == nil {
				// 成功解析為 JSON，直接返回
				result = jsonData
			} else {
				// 解析失敗，返回原始字符串
				result = map[string]interface{}{
					"body": string(body),
				}
			}
		} else {
			// 沒有 body
			result = map[string]interface{}{
				"message": "POST 請求成功，但沒有 body 數據",
			}
		}
	}

	// 如果是 GET 請求，將參數轉換成 JSON
	if r.Method == "GET" {
		if len(r.URL.Query()) > 0 {
			result = map[string]interface{}{}
			for key, values := range r.URL.Query() {
				if len(values) == 1 {
					result[key] = values[0]
				} else {
					result[key] = values
				}
			}
		} else {
			// 沒有參數
			result = map[string]interface{}{
				"message": "GET 請求成功，但沒有查詢參數",
			}
		}
	}

	// 如果沒有任何數據，返回默認消息
	if result == nil {
		result = map[string]interface{}{
			"message": "請求成功",
		}
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(result)
}
