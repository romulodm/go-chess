package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"

	"github.com/romulodm/go-chess-ws/server"
)

var addr = flag.String("addr", ":8080", "http service address")

func main() {
	flag.Parse()

	http.HandleFunc("/create-room", func(w http.ResponseWriter, r *http.Request) {
		server.CreateRoom(w, r)
	})
	http.HandleFunc("/join-room", func(w http.ResponseWriter, r *http.Request) {
		server.JoinRoom(w, r)
	})

	server := &http.Server{
		Addr: *addr,
	}

	err := server.ListenAndServe()
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}

	fmt.Println("Server running!")
}
