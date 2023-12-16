package server

import (
	"encoding/json"
	"log"
	"time"
)

var (
	SendMessageAction     = "send-message"
	JoinRoomAction        = "join-room"
	LeaveRoomAction       = "leave-room"
	UserJoinedAction      = "user-join"
	UserLeftAction        = "user-left"
	JoinRoomPrivateAction = "join-room-private"
	RoomJoinedAction      = "room-joined"
)

type Message struct {
	Action    string    `json:"action"`
	Message   string    `json:"message"`
	Sender    *Client   `json:"sender"`
	Timestamp time.Time `json:"timestamp"`
}

func (message *Message) encode() []byte {
	json, err := json.Marshal(message)
	if err != nil {
		log.Println(err)
	}

	return json
}

func InternalError() []byte {
	data, _ := json.Marshal(Message{
		Action:  "Error",
		Message: "Internal server error",
	})
	return data
}
