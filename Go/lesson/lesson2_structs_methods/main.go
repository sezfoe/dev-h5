package main

import (
	"fmt"
	"math"
)

// 基本結構體定義
type Person struct {
	Name string
	Age  int
	City string
}

// 方法：值接收者
func (p Person) Greet() string {
	return fmt.Sprintf("你好，我是%s，今年%d歲，住在%s", p.Name, p.Age, p.City)
}

// 方法：指針接收者（可以修改結構體）
func (p *Person) HaveBirthday() {
	p.Age++
	fmt.Printf("%s過生日了！現在%d歲\n", p.Name, p.Age)
}

// 方法：指針接收者
func (p *Person) MoveTo(newCity string) {
	oldCity := p.City
	p.City = newCity
	fmt.Printf("%s從%s搬到了%s\n", p.Name, oldCity, newCity)
}

// 嵌入結構體（組合）
type Address struct {
	Street string
	Number int
	City   string
}

type Employee struct {
	Person  // 嵌入Person結構體
	Address // 嵌入Address結構體
	Salary  float64
	Job     string
}

// Employee的方法
func (e Employee) GetFullAddress() string {
	return fmt.Sprintf("%s %d號, %s", e.Street, e.Number, e.City)
}

func (e Employee) GetInfo() string {
	return fmt.Sprintf("%s，%s，月薪%.0f元，地址：%s", 
		e.Name, e.Job, e.Salary, e.GetFullAddress())
}

// 介面定義
type Shape interface {
	Area() float64
	Perimeter() float64
	GetName() string
}

// 矩形結構體
type Rectangle struct {
	Width  float64
	Height float64
}

func (r Rectangle) Area() float64 {
	return r.Width * r.Height
}

func (r Rectangle) Perimeter() float64 {
	return 2 * (r.Width + r.Height)
}

func (r Rectangle) GetName() string {
	return "矩形"
}

// 圓形結構體
type Circle struct {
	Radius float64
}

func (c Circle) Area() float64 {
	return math.Pi * c.Radius * c.Radius
}

func (c Circle) Perimeter() float64 {
	return 2 * math.Pi * c.Radius
}

func (c Circle) GetName() string {
	return "圓形"
}

// 三角形結構體
type Triangle struct {
	Base   float64
	Height float64
}

func (t Triangle) Area() float64 {
	return 0.5 * t.Base * t.Height
}

func (t Triangle) Perimeter() float64 {
	// 簡化計算，假設是等腰三角形
	side := math.Sqrt(math.Pow(t.Base/2, 2) + math.Pow(t.Height, 2))
	return t.Base + 2*side
}

func (t Triangle) GetName() string {
	return "三角形"
}

// 計算多個形狀的總面積
func calculateTotalArea(shapes []Shape) float64 {
	total := 0.0
	for _, shape := range shapes {
		total += shape.Area()
	}
	return total
}

// 空介面範例
func printAny(value interface{}) {
	switch v := value.(type) {
	case int:
		fmt.Printf("整數: %d\n", v)
	case string:
		fmt.Printf("字串: %s\n", v)
	case float64:
		fmt.Printf("浮點數: %.2f\n", v)
	case bool:
		fmt.Printf("布林值: %t\n", v)
	default:
		fmt.Printf("未知類型: %v\n", v)
	}
}

func main() {
	fmt.Println("=== Go結構體和方法範例 ===")
	
	// 1. 基本結構體使用
	fmt.Println("\n1. 基本結構體:")
	
	// 結構體初始化方式
	p1 := Person{"張三", 25, "台北"}
	p2 := Person{Name: "李四", Age: 30, City: "高雄"}
	p3 := Person{Name: "王五"} // 其他欄位為零值
	
	fmt.Println(p1.Greet())
	fmt.Println(p2.Greet())
	fmt.Println(p3.Greet())
	
	// 使用指針接收者方法
	fmt.Println("\n指針接收者方法:")
	p1.HaveBirthday()
	p1.MoveTo("台中")
	fmt.Println(p1.Greet())
	
	// 2. 嵌入結構體
	fmt.Println("\n2. 嵌入結構體:")
	
	emp := Employee{
		Person: Person{
			Name: "陳小明",
			Age:  28,
			City: "新竹",
		},
		Address: Address{
			Street: "中正路",
			Number: 123,
			City:   "新竹",
		},
		Salary: 50000,
		Job:    "軟體工程師",
	}
	
	fmt.Println(emp.GetInfo())
	
	// 3. 介面和多態
	fmt.Println("\n3. 介面和多態:")
	
	// 創建不同類型的形狀
	shapes := []Shape{
		Rectangle{Width: 5, Height: 3},
		Circle{Radius: 4},
		Triangle{Base: 6, Height: 4},
	}
	
	// 遍歷所有形狀並顯示資訊
	for _, shape := range shapes {
		fmt.Printf("%s - 面積: %.2f, 周長: %.2f\n", 
			shape.GetName(), shape.Area(), shape.Perimeter())
	}
	
	// 計算總面積
	totalArea := calculateTotalArea(shapes)
	fmt.Printf("\n所有形狀的總面積: %.2f\n", totalArea)
	
	// 4. 空介面
	fmt.Println("\n4. 空介面範例:")
	
	values := []interface{}{
		42,
		"Hello Go",
		3.14,
		true,
		Person{Name: "測試", Age: 20, City: "測試市"},
	}
	
	for _, value := range values {
		printAny(value)
	}
	
	// 5. 結構體比較
	fmt.Println("\n5. 結構體比較:")
	
	person1 := Person{"張三", 25, "台北"}
	person2 := Person{"張三", 25, "台北"}
	person3 := Person{"李四", 25, "台北"}
	
	fmt.Printf("person1 == person2: %t\n", person1 == person2)
	fmt.Printf("person1 == person3: %t\n", person1 == person3)
	
	// 6. 方法集
	fmt.Println("\n6. 方法集範例:")
	
	// 值調用指針接收者方法
	person1.HaveBirthday() // Go會自動取地址
	
	// 指針調用值接收者方法
	personPtr := &person2
	fmt.Println(personPtr.Greet()) // Go會自動解引用
	
	fmt.Println("\n=== 範例結束 ===")
}

