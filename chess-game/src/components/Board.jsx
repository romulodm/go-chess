import { useState } from "react";

import Chessboard from "chessboardjsx";
import { Chess } from "chess.js";

export default function Board() {

    const chess = new Chess()
    console.log(chess.ascii())
    
    console.log(chess)
    return (

        <Chessboard width={900} />
            
    );
}