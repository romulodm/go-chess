import React, { useState, useEffect } from "react";

import generateRandomGameCode from "../scripts/generateGameCode";
import io from 'socket.io-client';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import Modal from '@mui/material/Modal';
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
  transform: 'translate(-50%, -50%)',
  width: 350,
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

const baseURL = 'http://127.0.0.1:800/';

export default function Lobby(props) {

    // Exibir loading (o círculo que fica rodando):
    const [isLoading, setIsLoading] = useState(false);
    //

    // Para fechar o modal:
    const [openAlert, setOpen] = useState(true);
    const handleClose = () => {
        setOpen(false);
        props.setOpenLobby(false);
    }
    //

    // Mensagens de alerta que são mostradas na parte inferior:
    const [showAlertMessage, setShowAlertMessage] = useState(false); // Exibir ou não;
    const [alertMessage, setAlertMessage] = useState(""); // Mensagem;
    const [typeAlertMessage, setTypeAlertMessage] = useState(''); // Tipo da mensagem: success, error, warning ou info;

    const handleAlertMessage = (type, message) => {
        setShowAlertMessage(true);
        setAlertMessage(message);
        setTypeAlertMessage(type);

        setTimeout(() => { setShowAlertMessage(false) }, 7000); // Fechar a mensagem;
    };
    //

    // Código que será inserido pelo usuário:
    const [gamecode, setGamecode] = useState("");
    //

    const handleNewGame = (e) => {
        e.preventDefault;

        var codeGenerated = generateRandomGameCode()
        
        try {
          setIsLoading(true);
          const newSocket = io(`http://localhost:8000/join-room/${codeGenerated}`);
          props.setWebSocket(newSocket);
    
          newSocket.on('connect', () => {
            handleAlertMessage('success','Conectado ao servidor WebSocket');
            setIsLoading(false);
            // Lógica adicional, se necessário
          });

        } catch (error) {
            handleAlertMessage('error','Erro ao conectar ao servidor WebSocket:');
            console.log(error)
          setIsLoading(false);
        }
      };
    
      const handleJoinGame =  (e) => {
        e.preventDefault();

        try {
          setIsLoading(true);
          const newSocket = io(`http://localhost:8000/join-room/${gamecode}`);
          setSocket(newSocket);
    
          newSocket.on('connect', () => {
            handleAlertMessage('success','Conectado ao servidor WebSocket');
            setIsLoading(false);
          });

        } catch (error) {
            handleAlertMessage('error','Erro ao conectar ao servidor WebSocket:');
            console.log(error)
            setIsLoading(false);
        }
      };

    return (
    <Modal
        open={openAlert}
        onClose={handleClose}
        style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(7px)',
        }}
        >
        <>

        <Snackbar
            open={showAlertMessage}
            severity="success"
            TransitionComponent={SlideTransition}
            anchorOrigin={{
            vertical: "bottom",
            horizontal: "center"
            }}>
            <Alert  severity={typeAlertMessage} sx={{ width: '100%' }}>
            {alertMessage}
            </Alert>
        </Snackbar>

        <Box sx={style}>

        <div className="bg-white rounded-xl shadow-lg">
        

            <div className="p-4 sm:p-4">
                <form>
                    <div className="grid gap-y-4">
                        
                        <React.Fragment>
                            <div className="flex flex-col items-center bg-white text-gray-700 py-6 text-center">
                            
                                <button  
                                    onClick={(e) => handleNewGame}
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
                                        value={gamecode.toUpperCase()}
                                        onChange={(e) => setGamecode(e.target.value)}
                                    />
                                    </div>
                                    <button
                                        onClick={(e) => handleJoinGame}
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
        </>      
    </Modal>
  )
}