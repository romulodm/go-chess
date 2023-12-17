import React, { Component } from "react";
import Chessboard from "chessboardjsx";

import ChessApp from "../chess/ChessApp.jsx";

const boardStyle = {
    borderRadius: "5px",
    boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`
};

export default function BoardOneVsOne(props) {
    const boardPerspective = () => {
        if (props.userName) {
          return props.userName == "Player 2" ? "black" : "white"
        }
        return "white"
      }
      
    return (
      <div className="flex justify-around items-center">
        <ChessApp userName={props.userName} webSocket={props.webSocket}>
          {({ position, onDrop }) => (
            <Chessboard
              id="ChessApp"
              position={position}
              calcWidth={({ screenWidth, screenHeight }) => Math.min(screenWidth, screenHeight) * 0.95}
              onDrop={onDrop}
              boardStyle={boardStyle}
              lightSquareStyle={{ backgroundColor: "AliceBlue" }}
              darkSquareStyle={{ backgroundColor: "#b3b3b3" }}
          
              orientation={boardPerspective()}
            />
          )}
        </ChessApp>
      </div>
    );
}
