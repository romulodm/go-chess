import React, { useState, useEffect } from "react";

import generateRandomGameCode from "../scripts/generateGameCode";
import io from 'socket.io-client';

import MuiAlert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import PlayCircleOutlineOutlinedIcon from '@mui/icons-material/PlayCircleOutlineOutlined';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

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

var SOCKET_BASE_URL = "ws://localhost:8000"

export default function Lobby(props) {
    // Exibir loading (o círculo que fica rodando):
    const [isLoading, setIsLoading] = useState(false);
    //

    // Código que será inserido pelo usuário:
    const [gameCode, setGamecode] = useState("");
    //

    // Fazer uma solicitação para criar uma nova sala:
    const handleNewGame = async (e) => {
        e.preventDefault();

        var codeToSend = generateRandomGameCode();

        const socket = new WebSocket(`${SOCKET_BASE_URL}/create-room?id=${codeToSend}`)

        socket.addEventListener("message", (event) => {
            const messageFromServer = JSON.parse(event.data);
            console.log(messageFromServer)
            props.setCodeToShow(messageFromServer.message);
        });

        props.setWebSocket(socket);
    }
    //

    // Fazer uma solicitação para entrar em uma sala existente:
    const handleJoinGame = (e) => {
        e.preventDefault();

        const regexGameCode = /^[A-Z0-9]+$/;

        if (gameCode.length < 7 || !regexGameCode.test(gameCode)) {
            props.handleAlertMessage("error", "Enter a valid code, please.");
        }

        const socket = new WebSocket(`${SOCKET_BASE_URL}/join-room?id=${gameCode}`)

        socket.onopen = function (event) {
            console.log('Conexão estabelecida com sucesso!');
        };

        socket.onerror = function (error) {
            props.handleAlertMessage("error", "")
        };

        socket.addEventListener("message", (event) => {
            const messageFromServer = JSON.parse(event.data);
            console.log(messageFromServer)
            props.setCodeToShow(messageFromServer.message);
        });

        //props.setWebSocket(socket);
    }
    //

    return (

    <Box sx={style}>

        <div className="bg-white rounded-xl shadow-lg">
        

            <div className="p-4 sm:p-4">
                <form>
                    <div className="grid gap-y-4">
                        
                        <React.Fragment>
                            <div className="flex flex-col items-center bg-white text-gray-700 py-6 text-center">
                            
                                <button  
                                    onClick={handleNewGame}
                                    className="inline-flex w-40 hover:bg-blue-600 justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300"
                                >
                                    <PlayCircleOutlineOutlinedIcon style={{marginRight: "5px"}}/>
                                    New game
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
                                        onChange={(e) => setGamecode(e.target.value)}
                                    />
                                    </div>
                                    <button
                                        onClick={handleJoinGame}
                                        className="inline-flex ml-3 hover:bg-blue-600 bg-blue-700 justify-center items-center py-3 px-4 text-base font-medium text-center text-white rounded-lg bg-blue-700 focus:ring-4"
                                    >   
                                        <LoginOutlinedIcon style={{marginRight: "7px"}}/>
                                        Join
                                    </button>
                                </div>

                                    
                            </div>
                        </React.Fragment>

                    </div>
                </form>
            </div>


        </div>

        <React.Fragment>
            {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
                <CircularProgress color="primary" />
            </Box>
            )}
        </React.Fragment>

    </Box>
  )
}