# :mag_right: Overview
<p align="justify">
This project was created for a university subject called "Programming Languages", with the objective of creating an application in a programming language that we are not very used to using, the language chosen was Go and the idea was to use WebSockets to perform real-time communication between two users in a chess match.
</p>

<br>

<img src ="https://i.imgur.com/mR0sxuA.png">
<p align="center">Figure 1: Home page</p>
<br>

 # 	:seedling: Technologies
 **Front-end:**

 - `React`
 - `Chess.js`
 - `Material UI`
 - `Tailwind CSS`

**Back-end:**
 - `Go`
 - `Gorilla WebSocket`
 - `Gorilla Mux`

<br>

# :newspaper: Description
<div align="justify ">
We have implemented rooms that can have a maximum of two users connected, that is, they are private rooms for a chess game. We use the Gorilla WebSocket framework to create Rooms that have an identification ID, used to enter a room.
</div>

 <br>

<details>
 <summary>Room</summary>
 <br>
  
 ```go
type Room struct {
	ID         string `json:"id"`
	clients    map[*Client]bool
	register   chan *Client
	unregister chan *Client
	broadcast  chan *Message
}
```
</details>

<details>
 <summary>Client</summary>
 <br>
  
 ```go
type Client struct {
	Name string
	conn *websocket.Conn
	send chan []byte
	room *Room
}
```
</details>

<br>

<div align="justify ">
In other words, we have two endpoints that upgrade the connection, the first is to create a room and the other is to enter an existing room. In these two endpoints we receive a front-end ID.  
</div>
<br>

<details>
 <summary>Server config</summary>
 <br>
  
```go
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
```
</details>

<details>
 <summary>Component that makes the requests</summary>
 <br>
  
<div align="center">
  <img src ="https://i.imgur.com/Yx3NaXK.png">
</div>
<p align="center">Figure 2: Lobby component</p>
</details>

<br>

# :electric_plug: WebSocket
<p align="justify">
HTTP is a stateless communication protocol based on request and response transactions. In this model, the client sends a request to the server, which responds with the requested data. Each transaction is independent, and the connection is terminated after each interaction.
</p>
<br>

<div align="center">
<img src ="https://assets-global.website-files.com/5ff66329429d880392f6cba2/617a90ab08641e631353de50_Websocket%20vs%20HTTP.png">
<p>Figure 3: Differences between HTTP and WebSocket</p>
</div>
<br>

<br>

<p align="justify">
In contrast, WebSocket establishes a persistent connection between the client and server, enabling continuous bidirectional communication. This full-duplex protocol allows both parties to send and receive data simultaneously, facilitating efficient real-time message transmission without the need to initiate new transactions for each interaction, as is the case with HTTP.
</p>

<br><br><br>

<div align="center">
  <img src ="https://i.imgur.com/Ru6gEx0.png">
</div>

