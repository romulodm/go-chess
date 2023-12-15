import React, { useState } from 'react';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import Board from '../components/Board';
import Chat from '../components/Chat';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import Lobby from '../components/Lobby';

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

    // ID da sala para exibir na tela (recebido pelo servidor):
    const [codeToShow, setCodeToShow] = useState("");
    //

    // Conexão com o WebSocket:
    const [openChat, setOpenChat] = useState(false);
    const [usersMessages, setUsersMessages] = useState([]);
    //

    return (
    <div className="bg-gray-100 h-screen flex items-center justify-center">

        {webSocket === false ? (
            <Lobby 
                setWebSocket={setWebSocket}
                handleAlertMessage={handleAlertMessage}
                setCodeToShow={setCodeToShow}
            />
        ) : (
            <div className="flex w-full justify-center">
                


                <Board />

                
                <div className="flex items-center">
                    {openChat === true ? (
                        <Chat
                            setOpenChat={setOpenChat}
                            openChat={openChat}
                            usersMessages={usersMessages}
                            setUsersMessages={setUsersMessages}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center w-20 h-full bg-gray-400 text-gray-800 p-10">
                            
                            <button
                                className="p-4 text-gray-500 rounded-lg bg-gray-200 transition duration-300 hover:bg-gray-300 hover:text-black"
                                onClick={() => setOpenChat(true)}
                            >
                                <ChatOutlinedIcon />

                            </button>
                        </div>
                    )}
                </div>
            </div>
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