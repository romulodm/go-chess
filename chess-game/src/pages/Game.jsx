import React, { useEffect, useState } from 'react';
import { Badge } from "@mui/material";


import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import Chat from '../components/Chat';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import Lobby from '../components/Lobby';
import Waiting from '../components/Waiting';

import BoardOneVsOne from '../components/BoardOneVsOne.';
import ChatOpened from '../components/ChatOpened';
import EndGameMessage from '../components/EndGameMessage';

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

    // Checando o redimensionamento da tela:
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    function checkScreenSize() {
        return setWindowWidth(window.innerWidth);  
    }

    window.addEventListener("load", checkScreenSize);
    window.addEventListener("resize", checkScreenSize);
    //

    // Conexão com o WebSocket:
    const [webSocket, setWebSocket] = useState(false);
    //

    // Condição para iniciar um novo jogo:
    const [startGame, setStartGame] = useState(false);
    //

    // ID da sala para exibir na tela (recebido pelo servidor):
    const [codeToShow, setCodeToShow] = useState("");
    //

    // Username (se criar a sala é Player 1, caso contrário é Player 2):
    const [userName, setUserName] = useState("");
    //

    // O chat que é mostrado para o envio de mesangens:
    const [openChat, setOpenChat] = useState(false);
    const [openChatOpened, setOpenChatOpened] = useState(true);
    const [usersMessages, setUsersMessages] = useState([]);
    const [newMessagesReceived, setNewMessagesReceived] = useState(0);
    //

    // Exibir ou não a mensagem de encerramento de uma partida:
    const [openEndGameMessage, setOpenEndGameMessage] = useState(false);
    const [typeEndGameMessage, setTypeEndGameMessage] = useState("");
    const [textEndGameMessage, setTextEndGameMessage] = useState("");
    //

    const handleWebSocketMessage = (event) => {
        const messageFromServer = JSON.parse(event.data);
    
        if (messageFromServer.action === "START_GAME") {
          setStartGame(true);
        }

        if (messageFromServer.action === "USER_LEFT_ROOM") {
            handleAlertMessage("error", "A player left the room!")
            if (userName === "Player 2") {
                setUserName("Player 1");
            };
            setUsersMessages([]);
            setOpenEndGameMessage(false);
            setStartGame(false);
        }

        if (messageFromServer.action === "GAME_CHECKMATE") {
            if ((messageFromServer.message == "White pieces win by checkmate!" && userName == "Player 1") || (messageFromServer.message == "Black pieces win by checkmate!" && userName == "Player 2")) {
                setTypeEndGameMessage("WIN");
            } else {
                setTypeEndGameMessage("LOSE");
            }

            setTextEndGameMessage(messageFromServer.message)
            setOpenEndGameMessage(true)
        }

        if (messageFromServer.action === "GAME_DRAW") {
            setTextEndGameMessage(messageFromServer.message)
            setOpenEndGameMessage(true)
        }
    
        if (messageFromServer.action === "CHAT_MESSAGE") {
          const message = {
            "sender": messageFromServer.sender.Name,
            "message": messageFromServer.message,
            "time": messageFromServer.timestamp
          };
    
          // Adicione a nova mensagem ao estado local
          const newLocalMessages = [...usersMessages, message];
          setUsersMessages(newLocalMessages);

          if (newMessagesReceived , 1) {
            setNewMessagesReceived(1)
          }
          
          // Atualize o estado global se o componente do chat estiver aberto
          if (openChat) {
            setNewMessagesReceived(newMessagesReceived + 1);
          }
        }
    };

    useEffect(() => {
        if (webSocket !== false) {

            webSocket.onerror = function (error) {
                handleAlertMessage("error", "An error occurred with socket.")
            };
    
            webSocket.addEventListener("message", handleWebSocketMessage);
        }
        
        return () => {
            if (webSocket !== false) {
              webSocket.removeEventListener("message", handleWebSocketMessage);
            }
        };
    }, [webSocket, openChat, usersMessages, newMessagesReceived]);

    return (
    <div className="flex h-screen bg-gray-100 w-full justify-center items-center">

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
                
                <div className="flex flex-col md:flex-row">

                    <BoardOneVsOne
                        userName={userName}
                        webSocket={webSocket}
                    />
                    
                    <div className="flex items-center">
                    {windowWidth >= 1290 ? (
                        openChatOpened === true && openChat === false ? (

                                <div className='flex justify-center items-right h-full ml-4 rounded-md' style={{ width: '380px' }}>
                                    <ChatOpened
                                        webSocket={webSocket}
                                        setOpenChatOpened={setOpenChatOpened}
                                        openChat={openChat}
                                        usersMessages={usersMessages}
                                        setUsersMessages={setUsersMessages}
                                        userName={userName}
                                        setNewMessagesReceived={setNewMessagesReceived}
                                    />
                                </div>

                            ) : (

                                <div className="flex justify-center items-center w-full h-20 my-2 md:h-full md:w-20 md:mx-2 bg-blue-700 rounded-md">
                                    <button
                                        className="p-4 rounded-lg bg-gray-100 text-gray-600 hover:from-blue-300 hover:to-purple-300 hover:bg-gray-300"
                                        onClick={() => setOpenChatOpened(true)}
                                    >
                                        <Badge badgeContent={newMessagesReceived} overlap="circular" variant="dot" color="error">
                                            <ChatOutlinedIcon />
                                        </Badge>
                                    </button>
                                </div>

                            )
                        ) : (

                            <div className="flex justify-center items-center w-full h-20 my-2 md:h-full md:w-20 md:mx-2 bg-blue-700 rounded-md">
                                <button
                                    className="p-4 rounded-lg bg-gray-100 text-gray-600 hover:from-blue-300 hover:to-purple-300 hover:bg-gray-300"
                                    onClick={() => setOpenChat(true)}
                                >
                                    <Badge badgeContent={newMessagesReceived} overlap="circular" variant="dot" color="error">
                                        <ChatOutlinedIcon />
                                    </Badge>
                                </button>
                            </div>

                        )}
                        {openChat === true && 
                            <Chat
                                webSocket={webSocket}
                                setOpenChat={setOpenChat}
                                openChat={openChat}
                                usersMessages={usersMessages}
                                setUsersMessages={setUsersMessages}
                                userName={userName}
                                setNewMessagesReceived={setNewMessagesReceived}
                            />
                        }
                    </div>

                    {openEndGameMessage && <EndGameMessage 
                                                type={typeEndGameMessage} 
                                                text={textEndGameMessage} 
                                                setOpenEndGameMessage={setOpenEndGameMessage}
                                                webSocket={webSocket}
                                                handleAlertMessage={handleAlertMessage}
                                                userName={userName}
                                                setUserName={setUserName}
                                                setStartGame={setStartGame}
                                            />}

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