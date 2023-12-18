import React, { useState, useEffect } from "react";

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

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

export default function Waiting(props) {
    
    props.webSocket.addEventListener("message", (event) => {
        const messageFromServer = JSON.parse(event.data);
        if (messageFromServer.action == "START_GAME") {
            props.setStartGame(true);
        }
    });

    return (

    <Box sx={style}>

        <div className="bg-white rounded-xl shadow-lg">
            <div className="p-4 sm:p-4">
                <div className="flex flex-col items-center bg-white text-gray-700 py-6 text-center">   
                    
                    <p className="text-gray-400 mb-2">
                    Code to enter the room:
                    </p>
                    
                    <div className="bg-blue-200 p-4 rounded-lg mb-5">
                        <p className="text-blue-700 font-bold letter-spacing-code">
                            {props.codeToShow}
                        </p>
                    </div>
                    
                    <CircularProgress color="primary"/>
                    
                    <p className="text-gray-400 mt-4 mb-4">
                    Waiting for players...
                    </p>        
                </div>
            </div>
        </div>
    </Box>
  )
}