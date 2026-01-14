package main

import (
	pp2 "app/p1"
	pp3 "app/p2"
	"fmt"
)

func main() {
	fmt.Println("Hello, World!")
	fmt.Println(pp2.P())
	fmt.Println(pp3.P())

	a := [5]int{1, 2, 3, 4, 5}
	s := a[1:3]
	s[0] = 100
	fmt.Printf("%v\n", a)
}
