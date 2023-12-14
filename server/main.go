package main

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"

	"chess/server"
)

func serverConfig() http.Server {
	r := mux.NewRouter()

	r.HandleFunc("/create-room", func(w http.ResponseWriter, r *http.Request) {
		server.CreateRoom(w, r)
	})

	r.HandleFunc("/join-room", func(w http.ResponseWriter, r *http.Request) {
		server.JoinRoom(w, r)
	})

	return http.Server{
		Addr:              "127.0.0.1:8000",
		Handler:           r,
		ReadTimeout:       15 * time.Second,
		ReadHeaderTimeout: 15 * time.Second,
	}
}

func main() {
	server := serverConfig()

	fmt.Println("Server running!")

	log.Fatal(server.ListenAndServe())
}
