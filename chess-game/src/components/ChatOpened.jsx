import React, { useState } from "react";

import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';


import moment from "moment";
import 'moment/dist/locale/pt-br'
moment.locale('pt-br')


export default function ChatOpened(props) {
    // Para fechar o modal:
    const [openAlert, setOpen] = useState(true);
    const handleClose = () => {
        setOpen(false);
        props.setOpenChat(false);
    }
    //

    // Resetando as "novas mensagens" para fazer o ícone de nova mensagem sumir da tela no:
    props.setNewMessagesReceived(0);
    //

    props.webSocket.addEventListener("message", (event) => {
        const messageFromServer = JSON.parse(event.data);

        if (messageFromServer.action == "CHAT_MESSAGE") {
            var message = {
                "sender": messageFromServer.sender.Name,
                "message": messageFromServer.message,
                "time": messageFromServer.timestamp
            };

            const newMessages = [...props.usersMessages, message];
            props.setUsersMessages(newMessages);

            
        }
    })
        

    const [messageToSend, setMessageToSend] = useState("");

    // Quando o botão de enviar mensagem é clicado:
    const handleSendMessage = (e) => {
        e.preventDefault();

        if (messageToSend.length < 1) {
            return false
        }

        props.webSocket.send(JSON.stringify({
            "action": "CHAT_MESSAGE",
            "message": messageToSend
        }));

        setMessageToSend("");

        return
    }
    //

    return (
    <div className="flex flex-col flex-grow w-full h-full max-w-xl bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="relative bg-gray-200 p-4 ">
            <div className="flex justify-between items-center ">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Chat
                </h3>
            </div>
        </div>
        
        <div className="flex flex-col flex-grow h-0 p-4 overflow-auto scroll-stylized">
            {props.usersMessages.map((item, index) => (
                <div key={index}>

                    {item.sender !== props.userName ? (
                            <div className="flex w-full mt-2 mb-2 space-x-3 max-w-xs">
                            <div className="flex items-center justify-center h-8 w-10 rounded-full bg-gray-200">
                                <AccountCircleOutlinedIcon style={{color: "#474747"}}/>
                            </div>

                            <div>
                                <div className="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
                                    <p className="text-sm">{item.message.toString()}</p>
                                </div>
                                <span className="text-xs text-gray-500 leading-none">{moment(item.time).fromNow()}</span>
                            </div>
                        </div>
                        

                    ) : (

                        <div className="flex w-full mt-2 mb-2 space-x-3 max-w-xs ml-auto justify-end">
                            <div>
                                <div className="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
                                    <p className="text-sm">{item.message}</p>
                                </div>
                                <span className="text-xs text-gray-500 leading-none">{moment(item.time).fromNow()}</span>
                            </div>

                            <div className="flex items-center justify-center h-8 w-12 rounded-full bg-gray-200">
                                <AccountCircleOutlinedIcon style={{color: "#474747"}}/>
                            </div>
                        </div>  

                    )}              
                
                </div>
            ))}    
    
        </div>
        

        <form className="flex bg-gray-200 p-4">
        <input 
            className="flex items-center w-full mr-4 rounded px-3 text-sm focus:outline-none focus:ring focus:ring-purple-400" 
            type="text" 
            placeholder="Type your message…"
            onChange={(e) => setMessageToSend(e.target.value)}
            value={messageToSend} 
        />
        
        <button
            onClick={handleSendMessage}
            className="text-white bg-gray-500 hover:bg-purple-700 inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-300"
            type="submit"
        >
            <span className="font-bold">Send</span>
        </button>
        </form>
    </div>
  )
}