import React, { useEffect, useState } from 'react';
import { Badge } from "@mui/material";


import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import Board from '../components/Board';
import Chat from '../components/Chat';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import Lobby from '../components/Lobby';
import Waiting from '../components/Waiting';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
  
function SlideTransition(props) {
    return <Slide {...props} direction="up" />;
}

export default function Game() {
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

    // Conexão com o WebSocket:
    const [webSocket, setWebSocket] = useState(false);
    //

    useEffect(() => {
        if (webSocket !== false) {

            webSocket.onerror = function (error) {
                props.handleAlertMessage("error", "An error occurred when entering the room.")
            };
    
            webSocket.addEventListener("message", (event) => {
                const messageFromServer = JSON.parse(event.data);
                
                if (messageFromServer.action == "START_GAME") {
                    setStartGame(true);
                }

                if (messageFromServer.action == "CHAT_MESSAGE") {
                    var message = {
                        "sender": messageFromServer.sender.Name,
                        "message": messageFromServer.message,
                        "time": messageFromServer.timestamp
                    };
        
                    if (usersMessages.length > 0) {
                        var lastMessage = usersMessages[usersMessages.length -1];
        
                        if ((message.message == lastMessage.message) && (message.sender == lastMessage.sender) && (message.time == lastMessage.time)) {
                            return false
                        }
                    }
                    
                    const newMessages = [...usersMessages, message];
                    setUsersMessages(newMessages);
                    setNewMessagesReceived(newMessagesReceived + 1);
                }

            });
        }
      }, [webSocket]);

    // Condição para iniciar um novo jogo:
    const [startGame, setStartGame] = useState(false);
    //

    // ID da sala para exibir na tela (recebido pelo servidor):
    const [codeToShow, setCodeToShow] = useState("");
    //

    // Username (se criar a sala é Player 1, caso contrário é Player 2):
    const [userName, setUserName] = useState("");
    //

    // Conexão com o WebSocket:
    const [openChat, setOpenChat] = useState(false);
    const [usersMessages, setUsersMessages] = useState([]);
    const [newMessagesReceived, setNewMessagesReceived] = useState(0);
    //

    return (
    <div className="flex justify-center p-3.5">

        {webSocket === false ? (
            <Lobby 
                setWebSocket={setWebSocket}
                handleAlertMessage={handleAlertMessage}
                setCodeToShow={setCodeToShow}
                setStartGame={setStartGame}
                setUserName={setUserName}
            />
        ) : (
            (webSocket !== false && startGame === false) ? (
                <Waiting
                    codeToShow={codeToShow}
                    webSocket={webSocket}
                    setStartGame={setStartGame}
                    setUserName={setUserName}
                />
            ) : (
                
                    <div className="flex">

                        <Board />
           
                        <div className="flex items-center">
                            {openChat === true ? (
                                <Chat
                                    webSocket={webSocket}
                                    setOpenChat={setOpenChat}
                                    openChat={openChat}
                                    usersMessages={usersMessages}
                                    setUsersMessages={setUsersMessages}
                                    userName={userName}
                                    setNewMessagesReceived={setNewMessagesReceived}
                                />
                            ) : (
                                <div className="flex justify-center items-center w-20 h-full mx-2 bg-yellow-700 bg-opacity-60 text-gray-800 rounded-md">
                                    
                                    <button
                                        className="p-4 text-gray-500 rounded-lg bg-gray-200 transition duration-300 hover:bg-gray-300 hover:text-black"
                                        onClick={() => setOpenChat(true)}
                                    >
                                        <Badge badgeContent={newMessagesReceived} overlap="circular" variant="dot" color="secondary">
                                            <ChatOutlinedIcon />
                                        </Badge>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                
            )
        )}


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

    </div>
    )
};