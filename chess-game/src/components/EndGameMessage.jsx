import React, { useEffect, useState } from "react";

import SentimentVerySatisfiedOutlinedIcon from '@mui/icons-material/SentimentVerySatisfiedOutlined';
import MoodBadOutlinedIcon from '@mui/icons-material/MoodBadOutlined';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 380,
  outline: 'none'
};

export default function EndGameMessage(props) {
  // Para fechar o modal e mudar o estado do openLogouAlert (definido na SideBar e passado pelo props):
  const [openAlert, setOpen] = useState(true);
  const handleClose = () => {
    setOpen(false);
    props.setOpenEndGameMessage(false);
  }
  //

  const hanldeExitToHomePage = () => {
    window.location.reload()
  }

  return (
    <Modal
      open={openAlert}
      onClose={handleClose}
      style={{
        backdropFilter: 'blur(5px)',
      }}
    >
    
      <Box sx={style}>
        <div className="relative transform overflow-hidden rounded-lg">
            <div className="bg-white sm:p-6 sm:pb-4">

                <div className=" flex flex-col rounded-lg items-center justify-center">

                    <div className="mx-auto m-2 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                        
                        {props.type === "LOSE" ? (

                            <MoodBadOutlinedIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                            
                            ) : props.type === "WIN" ? (
                            
                            <SentimentVerySatisfiedOutlinedIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                            
                            ) : (
                            
                            <HandshakeOutlinedIcon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                        
                        )}
                    
                    </div>

                    {props.type === "LOSE" ? (

                            <h3 className="text-xl font-semibold mb-4 text-gray-900">You lose</h3>

                        ) : props.type === "WIN" ? (

                            <h3 className="text-xl font-semibold mb-4 text-gray-900">You win</h3>

                        ) : (

                            <h3 className="text-xl font-semibold mb-4 text-gray-900">Draw</h3>

                    )}

                    <div className="text-left justify-center">
                        <p className="text-sm ml-3 text-gray-500 text-center">
                        {props.text}
                        </p>
                    </div>
                </div>
            </div>
                            
            <div className="bg-gray-50 py-4 px-4 text-center flex flex-col">

                <button
                    type="button"
                    className="inline-flex text-center justify-center mb-2 rounded-md bg-blue-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600"
                    onClick={handleClose}
                >
                    Return to new match
                </button>

                
                    <button
                    onClick={hanldeExitToHomePage}
                        className="inline-flex w-full text-center justify-center rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-600"
                    >
                        Exit to home page
                    </button>
                
            </div>
        </div>
      
      </Box>      
    </Modal>
  )
}