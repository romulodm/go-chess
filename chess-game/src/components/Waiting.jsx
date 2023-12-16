import React, { useState, useEffect } from "react";

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  border: 1,
  borderColor: "#EFEFEF",
  borderRadius: "5px",
  transform: 'translate(-50%, -50%)',
  width: 350,
};

var SOCKET_BASE_URL = "ws://localhost:8000"

export default function Waiting(props) {
    
    props.webSocket.addEventListener("message", (event) => {
        const messageFromServer = JSON.parse(event.data);
        if (messageFromServer.action == "START_GAME") {
            props.setStartGame(true);
        }
    });

    return (

    <Box sx={style}>

            <div className="grid gap-y-4 rounded-xl">
                
                <div className="flex flex-col items-center bg-white text-gray-700 py-6 text-center">   

                    <p className="text-gray-400 mt-2 mb-2">
                    Code to enter the room:
                    </p>
                    
                    <div className="bg-purple-300 p-4 rounded-lg">
                        <p className="text-purple-700 font-bold letter-spacing-code">
                            {props.codeToShow}
                        </p>
                    </div>

                    <label className="text-gray-400 mt-10 mb-5">
                        Waiting for players...
                    </label>
                    <CircularProgress color="secondary"/>
                                    
                </div>


            </div>
    </Box>
  )
}