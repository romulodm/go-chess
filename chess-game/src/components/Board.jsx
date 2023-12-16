import React, { useState } from "react";

import Chessboard from "chessboardjsx";
import { Chess } from "chess.js";

export default function Board() {
    const [game, setGame] = useState(new Chess());
    const [fen, setFen] = useState('start');
    console.log(game.ascii())
    
    console.log(game)
    return (

        <Chessboard width={900} calcWidth={({ screenWidth, screenHeight }) => Math.min(screenWidth, screenHeight) * 0.95} />
            
    );
}