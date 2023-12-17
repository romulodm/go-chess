package server

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

const welcomeMessage = "%s joined the room."

type Room struct {
	ID         string `json:"id"`
	clients    map[*Client]bool
	register   chan *Client
	unregister chan *Client
	broadcast  chan *Message
}

var rooms = make(map[string]*Room)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  4096,
	WriteBufferSize: 4096,
}

func NewRoom(id string) *Room {
	/*
		NewRoom creates a new Room.
		Returns:

		- *Room: The newly created Room.
	*/
	return &Room{
		ID:         id,
		clients:    make(map[*Client]bool),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		broadcast:  make(chan *Message),
	}
}

func (room *Room) RunRoom() {
	/*
		RunRoom runs the room's main loop, which listens for client registration, unregistration, and message broadcasting.
	*/
	for {
		select {

		case client := <-room.register:
			room.registerClientInRoom(client)

		case client := <-room.unregister:
			room.unregisterClientInRoom(client)

		case message := <-room.broadcast:
			room.broadcastToClientsInRoom(message.encode())
		}
	}
}

func (room *Room) hasTwoClients() bool {
	/*
		hasTwoClients checks if the room already has two clients.

		Returns:
		- bool: true if the room has two clients, false otherwise.
	*/
	clientCount := 0
	for range room.clients {
		clientCount++
	}

	if clientCount < 2 {
		return false
	}
	return true
}

func (room *Room) registerClientInRoom(client *Client) bool {
	/*
		registerClientInRoom registers a new client in the room if there is only one client in the room.

		Parameters:
		- client (*Client): The client to register.
	*/
	if room.hasTwoClients() {
		return false
	}

	room.clients[client] = true
	return true
}

func (room *Room) unregisterClientInRoom(client *Client) {
	/*
		unregisterClientInRoom removes a client from the room.

		Parameters:
		- client (*Client): The client to unregister.
	*/
	if _, ok := room.clients[client]; ok {
		delete(room.clients, client)
	}
}

func (room *Room) notifyClientJoined(client *Client) {
	/*
		notifyClientJoined notifies all clients in the room that a new client has joined.

		Parameters:
		- client (*Client): The client that joined the room.
	*/
	message := &Message{
		Action:  SendMessageAction,
		Message: fmt.Sprintf(welcomeMessage, client.GetName()),
	}

	room.broadcastToClientsInRoom(message.encode())
}

func (room *Room) broadcastToClientsInRoom(message []byte) {
	/*
		broadcastToClientsInRoom sends a message to all clients in the room.

		Parameters:
		- message ([]byte): The message to broadcast.
	*/
	for client := range room.clients {
		client.send <- message
	}
}

func (room *Room) GetId() string {
	/*
		GetId returns the ID of the room.

		Returns:
		- string: The ID of the room.
	*/
	return room.ID
}

// findRoomById procura uma sala pelo ID.
func findRoomById(id string) *Room {
	room, ok := rooms[id]
	if !ok {
		return nil
	}

	return room
}

func CreateRoom(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Query().Get("id")

	room := NewRoom(id)
	rooms[id] = room

	upgrader.CheckOrigin = func(r *http.Request) bool { return true }
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	client := NewClient(conn, "Player 1", room)

	go client.writePump()
	go client.readPump()

	room.registerClientInRoom(client)

	go room.RunRoom()

	message := Message{
		Action:  "CONNECTED_ON_SERVER",
		Message: id,
		Sender:  client,
	}

	jsonMessage, err := json.Marshal(message)
	if err != nil {
		fmt.Println("Error to convert to JSON:", err)
		return
	}

	client.send <- jsonMessage
}

func JoinRoom(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Query().Get("id")

	room := findRoomById(id)
	if room == nil {
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte("Sala não encontrada"))
		return
	}

	if !room.hasTwoClients() {

		upgrader.CheckOrigin = func(r *http.Request) bool { return true }
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println(err)
			return
		}

		for client := range room.clients {
			if client.Name == "Player 2" {
				client.Name = "Player 1"
			}
		}

		client := NewClient(conn, "Player 2", room)

		go client.writePump()
		go client.readPump()

		room.registerClientInRoom(client)

		message := Message{
			Action:  "ENTERED_ON_SERVER",
			Message: id,
			Sender:  client,
		}

		jsonMessage, err := json.Marshal(message)
		if err != nil {
			fmt.Println("Error to convert to JSON:", err)
			return
		}

		client.send <- jsonMessage

	} else {
		w.WriteHeader(http.StatusMethodNotAllowed)
		w.Write([]byte("Sala cheia!"))
		return
	}
}
