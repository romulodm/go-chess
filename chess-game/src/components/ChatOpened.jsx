import React, { useState } from "react";

import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

import moment from "moment";
import 'moment/dist/locale/pt-br'
moment.locale('pt-br')


export default function ChatOpened(props) {
    
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
        

    // Mensagem que vai ser digitada pelo usuário:    
    const [messageToSend, setMessageToSend] = useState("");
    const maxLetterLimit = 30;
    //

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
    <div className="flex flex-col flex-grow w-1/3 h-full bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="relative bg-gray-200 p-4">
            <div className="flex justify-between items-center ">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Chat
                </h3>
                <button
                    type="button"
                    className="text-gray-400 bg-transparent hover:bg-gray-300 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover-bg-gray-600 dark:hover-text-white"
                    onClick={() => props.setOpenChatOpened(false)}
                >
                    <CloseOutlinedIcon/>
                </button>
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
                
                <div className="flex flex-col w-full mr-4 rounded px-3 text-sm w-full">
                <input 
                    className="rounded h-10 px-3 text-sm focus:outline-none focus:ring focus:ring-purple-400" 
                    type="text"
                    placeholder="Type your message…"
                    onChange={(e) => setMessageToSend(e.target.value)}
                    value={messageToSend} 
                />
                    <span className={`text-sm mt-1 ${messageToSend.length > maxLetterLimit ? 'text-red-500' : 'text-gray-400'}`}>{messageToSend.length}/{maxLetterLimit} letters</span>
                </div>
            
                <button
                    disabled={messageToSend.length > maxLetterLimit}
                    onClick={handleSendMessage}
                    className={`text-white h-10 bg-gray-500 inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-300 ${messageToSend.length <= maxLetterLimit ? 'hover:bg-purple-700' : ''}`}
                    
                    type="submit"
                >
                <span className="font-bold">Send</span>
                </button>
            </form>
    </div>
  )
}