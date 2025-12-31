package main

import (
	"fmt"
	"log"
	"net/http"
)

func handler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello, Docker!")
	log.Println("Received request for:", r.URL.Path)
}

func main() {
	log.Println("start")
	http.HandleFunc("/", handler)
	log.Println("Server is ready: 8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal("ListenAndServe:", err)
	}
	log.Println("end")
}
