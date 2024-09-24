import React, { useState, useEffect } from "react";

import generateRandomGameCode from "../scripts/generateGameCode";

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import PlayCircleOutlineOutlinedIcon from '@mui/icons-material/PlayCircleOutlineOutlined';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  border: 1,
  borderColor: "#EFEFEF",
  borderRadius: "8px",
  transform: 'translate(-50%, -50%)',
  width: 350,
};

//var SOCKET_BASE_URL = "ws://localhost:8080"
var SOCKET_BASE_URL = import.meta.env.VITE_BASE_URL_SERVER;

export default function Lobby(props) {
    // Exibir loading (o círculo que fica rodando):
    const [isLoadingNewGame, setIsLoadingNewGame] = useState(false);
    const [isLoadingJoinGame, setIsLoadingJoinGame] = useState(false);
    //

    // Código que será inserido pelo usuário:
    const [gameCode, setGamecode] = useState("");
    //

    // Fazer uma solicitação para criar uma nova sala:
    const handleNewGame = async (e) => {
        e.preventDefault();

        setIsLoadingNewGame(true);

        var codeToSend = generateRandomGameCode();

        const socket = new WebSocket(`${SOCKET_BASE_URL}/create-room?id=${codeToSend}`)
        
        socket.addEventListener("message", (event) => {
            const messageFromServer = JSON.parse(event.data);

            if (messageFromServer.action == "CONNECTED_ON_SERVER") {
                setIsLoadingNewGame(false);
                
                props.setUserName(messageFromServer.sender.Name)
                props.setCodeToShow(messageFromServer.message);
            }
        });

        socket.onopen = function (event) {
            setIsLoadingNewGame(false);
            props.setWebSocket(socket);
        };

        socket.onerror = function (error) {
            setIsLoadingNewGame(false);
            console.log(error)
            props.handleAlertMessage("error", "An error occurred while creating the room.")
        };

    }
    //

    // Fazer uma solicitação para entrar em uma sala existente:
    const handleJoinGame = (e) => {
        e.preventDefault();

        setIsLoadingJoinGame(true);

        const regexGameCode = /^[A-Z0-9]+$/;

        if (gameCode.length < 7 || !regexGameCode.test(gameCode)) {
            setIsLoadingJoinGame(false);
            props.handleAlertMessage("error", "Enter a valid code, please.");
            return
        }

        const socket = new WebSocket(`${SOCKET_BASE_URL}/join-room?id=${gameCode}`)
        
        socket.onopen = function (event) {
            setIsLoadingJoinGame(false);
            props.setWebSocket(socket)
        };

        socket.onerror = function (error) {
            setIsLoadingJoinGame(false);
            props.handleAlertMessage("error", "An error occurred when entering the room.")
        };

        socket.addEventListener("message", (event) => {
            const messageFromServer = JSON.parse(event.data);

            if (messageFromServer.action === "ENTERED_ON_SERVER") {
                setIsLoadingJoinGame(false);

                props.setCodeToShow(messageFromServer.message);
                props.setUserName(messageFromServer.sender.Name)
                socket.send(JSON.stringify({
                    "action": "START_GAME",
                    "message": "Client joined"
                }));
                props.setStartGame(true);
            }
        });
    }
    //

    return (

    <Box sx={style}>

        <div className="bg-white rounded-xl shadow-lg">
            <div className="p-4 sm:p-4">
                <div className="grid gap-y-4">
                    <div className="flex flex-col items-center bg-white text-gray-700 py-6 text-center">
                    
                        <button  
                            onClick={handleNewGame}
                            className="inline-flex w-40 hover:bg-blue-600 justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300"
                        >

                            {(isLoadingNewGame == false) ? (
                                <>
                                <PlayCircleOutlineOutlinedIcon style={{marginRight: "5px"}}/>
                                New game
                                </>
                            ) : (

                                <>
                                <CircularProgress size={20} style={{marginRight: "10px", fontSize: "2px"}} color="secondary" />
                                New game
                                </>
                            )}

                            
                        </button>

                        <p className="text-gray-400 mt-10">-OR-</p>

                        <label className="text-gray-400 mt-2 mb-10">
                            Enter Game Code
                        </label>
                        
                        <div className="flex flex-row w-60 align-center justify-center">
                            <div className="border border-1 rounded-lg border-gray-300 shadow-md bg-white  p-2 flex">
                            <input
                                className="game-code-lobby"
                                maxLength="7"
                                value={gameCode.toUpperCase()}
                                onChange={(e) => setGamecode(e.target.value.toUpperCase())}
                            />
                            </div>
                            <button
                                onClick={handleJoinGame}
                                className="inline-flex ml-3 hover:bg-blue-600 bg-blue-700 justify-center items-center py-3 px-4 text-base font-medium text-center text-white rounded-lg bg-blue-700 focus:ring-4"
                            >   

                                {(isLoadingJoinGame == false) ? (
                                    <>
                                    <LoginOutlinedIcon style={{marginRight: "7px"}}/>
                                    Join
                                    </>
                                ) : (

                                    <>
                                    <CircularProgress size={20} style={{marginRight: "10px", fontSize: "2px"}} color="secondary" />
                                    Join
                                    </>
                                )}
                            </button>
                        </div>

                            
                    </div>
                </div>
            </div>
        </div>
    </Box>
  )
}