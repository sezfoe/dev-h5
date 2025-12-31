package main

import (
	"a"
	"fmt"
	"main/b"
	"sync"
	"time"
)

func testChannel() {
	c := make(chan int)

	go func() {
		fmt.Println("main 3")
		c <- 1
		// time.Sleep(1 * time.Second)
		fmt.Println("main 4")
		fmt.Println("main 41")
		fmt.Println("main 42")
		fmt.Println("main 43")
		fmt.Println("main 44")
		fmt.Println("main 45")
		fmt.Println("main 46")
		fmt.Println("main 47")
		fmt.Println("main 48")
		fmt.Println("main 49")
	}()

	<-c
	fmt.Println("main 5")
}

func testTimer() {
	ticker := time.NewTicker(1 * time.Second)

	go func() {
		for t := range ticker.C {
			fmt.Println("Tick at", t)
		}
	}()

	time.Sleep(5 * time.Second)
	ticker.Stop()
	fmt.Println("Ticker Stop")
}

var timer *time.Timer
var wg sync.WaitGroup

func timerFunc1() {
	fmt.Println(time.Now().Format("15:04:05.000000"))
	timer = time.AfterFunc(5*time.Second, timerFunc2)
}

func timerFunc2() {
	fmt.Println(time.Now().Format("15:04:05.000000"))
	timer = time.AfterFunc(5*time.Second, timerFunc3)
}

func timerFunc3() {
	fmt.Println(time.Now().Format("15:04:05.000000"))
	wg.Done()
}

func main() {
	fmt.Println("main 1")
	a.A()
	b.B()
	fmt.Println("main 2")

	wg.Add(1)
	timer = time.AfterFunc(5*time.Second, timerFunc1)
	wg.Wait()
}
