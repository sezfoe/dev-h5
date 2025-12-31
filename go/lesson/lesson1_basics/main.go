package main

import (
	"fmt"
	"math"
)

// 基本函數範例
func greet(name string) string {
	return "Hello, " + name + "!"
}

// 多個返回值的函數
func divide(a, b float64) (float64, error) {
	if b == 0 {
		return 0, fmt.Errorf("除數不能為零")
	}
	return a / b, nil
}

// 命名返回值
func calculateCircle(radius float64) (area, circumference float64) {
	area = math.Pi * radius * radius
	circumference = 2 * math.Pi * radius
	return // 自動返回命名變數
}

// 函數作為參數
func applyOperation(a, b int, operation func(int, int) int) int {
	return operation(a, b)
}

func main() {
	fmt.Println("=== Go基礎語法範例 ===")
	
	// 1. 變數宣告和初始化
	fmt.Println("\n1. 變數宣告:")
	
	// 使用var宣告
	var name string = "Go語言"
	var age int = 10
	var isLearning bool = true
	
	// 短變數宣告
	version := "1.24.0"
	temperature := 25.5
	
	// 多變數宣告
	var (
		width  = 100
		height = 200
	)
	
	fmt.Printf("語言: %s, 年齡: %d, 學習中: %t\n", name, age, isLearning)
	fmt.Printf("版本: %s, 溫度: %.1f°C\n", version, temperature)
	fmt.Printf("尺寸: %dx%d\n", width, height)
	
	// 2. 函數調用
	fmt.Println("\n2. 函數範例:")
	
	greeting := greet("世界")
	fmt.Println(greeting)
	
	// 多返回值處理
	result, err := divide(10, 3)
	if err != nil {
		fmt.Printf("錯誤: %v\n", err)
	} else {
		fmt.Printf("10 ÷ 3 = %.2f\n", result)
	}
	
	// 測試除零錯誤
	_, err = divide(10, 0)
	if err != nil {
		fmt.Printf("錯誤: %v\n", err)
	}
	
	// 命名返回值
	area, circumference := calculateCircle(5)
	fmt.Printf("半徑5的圓 - 面積: %.2f, 周長: %.2f\n", area, circumference)
	
	// 3. 控制結構
	fmt.Println("\n3. 控制結構:")
	
	// if/else
	score := 85
	if score >= 90 {
		fmt.Println("成績: 優秀")
	} else if score >= 80 {
		fmt.Println("成績: 良好")
	} else if score >= 70 {
		fmt.Println("成績: 中等")
	} else {
		fmt.Println("成績: 需要改進")
	}
	
	// for迴圈
	fmt.Println("\nfor迴圈範例:")
	
	// 基本for迴圈
	fmt.Print("計數: ")
	for i := 1; i <= 5; i++ {
		fmt.Printf("%d ", i)
	}
	fmt.Println()
	
	// while風格的for迴圈
	fmt.Print("倒數: ")
	count := 5
	for count > 0 {
		fmt.Printf("%d ", count)
		count--
	}
	fmt.Println()
	
	// range迴圈
	fruits := []string{"蘋果", "香蕉", "橘子"}
	fmt.Print("水果: ")
	for index, fruit := range fruits {
		fmt.Printf("%d:%s ", index, fruit)
	}
	fmt.Println()
	
	// switch語句
	fmt.Println("\nswitch範例:")
	day := "週三"
	switch day {
	case "週一":
		fmt.Println("新的一週開始")
	case "週二", "週三", "週四":
		fmt.Println("工作日")
	case "週五":
		fmt.Println("週末前最後一天")
	case "週六", "週日":
		fmt.Println("週末")
	default:
		fmt.Println("未知的日期")
	}
	
	// 4. 函數作為參數
	fmt.Println("\n4. 函數作為參數:")
	
	add := func(a, b int) int { return a + b }
	multiply := func(a, b int) int { return a * b }
	
	result1 := applyOperation(5, 3, add)
	result2 := applyOperation(5, 3, multiply)
	
	fmt.Printf("5 + 3 = %d\n", result1)
	fmt.Printf("5 × 3 = %d\n", result2)
	
	fmt.Println("\n=== 範例結束 ===")
}

