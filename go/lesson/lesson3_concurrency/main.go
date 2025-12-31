package main

import (
	"fmt"
	"math/rand"
	"sync"
	"time"
)

// 基本goroutine範例
func sayHello(name string, wg *sync.WaitGroup) {
	defer wg.Done() // 完成時通知WaitGroup
	fmt.Printf("Hello from %s!\n", name)
	time.Sleep(time.Duration(rand.Intn(1000)) * time.Millisecond)
}

// Channel通信範例
func producer(ch chan<- int, wg *sync.WaitGroup) {
	defer wg.Done()
	defer close(ch)
	
	for i := 1; i <= 5; i++ {
		fmt.Printf("生產者發送: %d\n", i)
		ch <- i
		time.Sleep(500 * time.Millisecond)
	}
}

func consumer(ch <-chan int, wg *sync.WaitGroup) {
	defer wg.Done()
	
	for value := range ch {
		fmt.Printf("消費者接收: %d\n", value)
		time.Sleep(300 * time.Millisecond)
	}
}

// Worker Pool模式
type Job struct {
	ID   int
	Data string
}

type Result struct {
	Job    Job
	Output string
	Error  error
}

func worker(id int, jobs <-chan Job, results chan<- Result, wg *sync.WaitGroup) {
	defer wg.Done()
	
	for job := range jobs {
		fmt.Printf("Worker %d 處理 Job %d: %s\n", id, job.ID, job.Data)
		
		// 模擬工作處理時間
		time.Sleep(time.Duration(rand.Intn(1000)) * time.Millisecond)
		
		// 模擬處理結果
		result := Result{
			Job:    job,
			Output: fmt.Sprintf("處理完成: %s (Worker %d)", job.Data, id),
			Error:  nil,
		}
		
		results <- result
	}
}

// Pipeline模式
func stage1(input <-chan int, output chan<- int, wg *sync.WaitGroup) {
	defer wg.Done()
	defer close(output)
	
	for value := range input {
		result := value * 2
		fmt.Printf("Stage1: %d -> %d\n", value, result)
		output <- result
		time.Sleep(200 * time.Millisecond)
	}
}

func stage2(input <-chan int, output chan<- int, wg *sync.WaitGroup) {
	defer wg.Done()
	defer close(output)
	
	for value := range input {
		result := value + 10
		fmt.Printf("Stage2: %d -> %d\n", value, result)
		output <- result
		time.Sleep(200 * time.Millisecond)
	}
}

// Fan-out/Fan-in模式
func fanOut(input <-chan int, outputs []chan<- int, wg *sync.WaitGroup) {
	defer wg.Done()
	defer func() {
		for _, output := range outputs {
			close(output)
		}
	}()
	
	for value := range input {
		// 隨機選擇一個輸出channel
		outputIndex := rand.Intn(len(outputs))
		fmt.Printf("Fan-out: %d -> Worker %d\n", value, outputIndex)
		outputs[outputIndex] <- value
	}
}

func fanIn(inputs []<-chan int, output chan<- int, wg *sync.WaitGroup) {
	defer wg.Done()
	defer close(output)
	
	var inputWg sync.WaitGroup
	
	for i, input := range inputs {
		inputWg.Add(1)
		go func(ch <-chan int, workerID int) {
			defer inputWg.Done()
			for value := range ch {
				fmt.Printf("Fan-in: Worker %d -> %d\n", workerID, value)
				output <- value
			}
		}(input, i)
	}
	
	inputWg.Wait()
}

// Select語句範例
func selectExample() {
	ch1 := make(chan string)
	ch2 := make(chan string)
	
	go func() {
		time.Sleep(1 * time.Second)
		ch1 <- "來自channel 1"
	}()
	
	go func() {
		time.Sleep(2 * time.Second)
		ch2 <- "來自channel 2"
	}()
	
	for i := 0; i < 2; i++ {
		select {
		case msg1 := <-ch1:
			fmt.Printf("Select收到: %s\n", msg1)
		case msg2 := <-ch2:
			fmt.Printf("Select收到: %s\n", msg2)
		case <-time.After(3 * time.Second):
			fmt.Println("Select超時")
		}
	}
}

// 互斥鎖範例
type Counter struct {
	mu    sync.Mutex
	value int
}

func (c *Counter) Increment() {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.value++
}

func (c *Counter) Value() int {
	c.mu.Lock()
	defer c.mu.Unlock()
	return c.value
}

func main() {
	fmt.Println("=== Go並發編程範例 ===")
	
	// 1. 基本Goroutine
	fmt.Println("\n1. 基本Goroutine:")
	var wg sync.WaitGroup
	
	names := []string{"Alice", "Bob", "Charlie", "David"}
	
	for _, name := range names {
		wg.Add(1)
		go sayHello(name, &wg)
	}
	
	wg.Wait()
	fmt.Println("所有goroutine完成")
	
	// 2. Channel通信
	fmt.Println("\n2. Channel通信:")
	wg.Add(2)
	
	ch := make(chan int, 3) // 有緩衝的channel
	
	go producer(ch, &wg)
	go consumer(ch, &wg)
	
	wg.Wait()
	
	// 3. Worker Pool模式
	fmt.Println("\n3. Worker Pool模式:")
	
	numWorkers := 3
	numJobs := 10
	
	jobs := make(chan Job, numJobs)
	results := make(chan Result, numJobs)
	
	// 啟動workers
	for i := 1; i <= numWorkers; i++ {
		wg.Add(1)
		go worker(i, jobs, results, &wg)
	}
	
	// 發送jobs
	for i := 1; i <= numJobs; i++ {
		jobs <- Job{
			ID:   i,
			Data: fmt.Sprintf("任務%d", i),
		}
	}
	close(jobs)
	
	// 收集結果
	go func() {
		wg.Wait()
		close(results)
	}()
	
	fmt.Println("收集結果:")
	for result := range results {
		if result.Error != nil {
			fmt.Printf("錯誤: %v\n", result.Error)
		} else {
			fmt.Printf("結果: %s\n", result.Output)
		}
	}
	
	// 4. Pipeline模式
	fmt.Println("\n4. Pipeline模式:")
	
	wg.Add(2)
	
	input := make(chan int)
	stage1Output := make(chan int)
	stage2Output := make(chan int)
	
	go stage1(input, stage1Output, &wg)
	go stage2(stage1Output, stage2Output, &wg)
	
	// 發送數據到pipeline
	go func() {
		defer close(input)
		for i := 1; i <= 5; i++ {
			fmt.Printf("Pipeline輸入: %d\n", i)
			input <- i
		}
	}()
	
	// 收集pipeline輸出
	for result := range stage2Output {
		fmt.Printf("Pipeline最終輸出: %d\n", result)
	}
	
	wg.Wait()
	
	// 5. Fan-out/Fan-in模式
	fmt.Println("\n5. Fan-out/Fan-in模式:")
	
	wg.Add(2)
	
	input2 := make(chan int)
	numWorkers2 := 3
	
	// 創建多個worker channels
	workerChannels := make([]chan int, numWorkers2)
	for i := range workerChannels {
		workerChannels[i] = make(chan int)
	}
	
	output2 := make(chan int)
	
	go fanOut(input2, workerChannels, &wg)
	go fanIn(workerChannels, output2, &wg)
	
	// 發送數據
	go func() {
		defer close(input2)
		for i := 1; i <= 6; i++ {
			input2 <- i
		}
	}()
	
	// 收集結果
	for result := range output2 {
		fmt.Printf("Fan-in最終結果: %d\n", result)
	}
	
	wg.Wait()
	
	// 6. Select語句
	fmt.Println("\n6. Select語句:")
	selectExample()
	
	// 7. 互斥鎖
	fmt.Println("\n7. 互斥鎖:")
	counter := &Counter{}
	
	// 啟動多個goroutine同時修改counter
	for i := 0; i < 10; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for j := 0; j < 100; j++ {
				counter.Increment()
			}
		}()
	}
	
	wg.Wait()
	fmt.Printf("Counter最終值: %d\n", counter.Value())
	
	fmt.Println("\n=== 範例結束 ===")
}





