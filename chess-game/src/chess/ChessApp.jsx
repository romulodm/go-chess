import React, { Component } from "react";
import PropTypes from "prop-types";
import { Chess } from "chess.js";

const game = new Chess();

import playMoveSound from "../scripts/moveSound";
import playCaptureSound from "../scripts/capturedSound";

export default class ChessApp extends Component {
  static propTypes = { children: PropTypes.func };

  state = { fen: "start" };

  myColor = "";

  myName = "";
  webSocket = "";

  constructor(props) {
    super(props);
    
    this.myName = props.userName;
    this.webSocket = props.webSocket;

    if (this.myName == "Player 1") {
      this.myColor = "white";
    } else {
      this.myColor = "black";
    }

  }

  isMyTurn() {
    if ((game.turn() === "w" && this.myColor === "white") || (game.turn() === "b" && this.myColor === "black")) {
      return true
    }
    return false
  };

  resetGame() {
    game.reset();
    this.setState({ fen: game.fen() })
  }

  componentDidMount() {
    this.setState({ fen: game.fen() });

    this.webSocket.onmessage = (event) => {
      const messageFromServer = JSON.parse(event.data);
    
      if (messageFromServer.action === "GAME_MOVE") {
        game.load(messageFromServer.message);

        this.setState({ fen: game.fen() });

        this.checkGameStatus();
      }

      if (messageFromServer.action === "USER_LEFT_ROOM") {
        this.resetGame();
      }

      if (messageFromServer.action === "GAME_REMATCH") {
        game.load(messageFromServer.message);

        this.setState({ fen: game.fen() });

        this.checkGameStatus()
      }
    };
    
  }

  onDrop = ({ sourceSquare, targetSquare }) => {
    
    if (this.isMyTurn()) {
      try {
        var move = game.move({
          from: sourceSquare,
          to: targetSquare,
          promotion: "q"
        });

        if (move === null) return;
      
      } catch (error) {
        return
      }

      this.setState({ fen: game.fen() });

      if (move.captured) {
        playCaptureSound();
      } else {
        playMoveSound();
      }
      

      this.webSocket.send(JSON.stringify({
        "action": "GAME_MOVE",
        "message": game.fen()
      }));
    }
  };

  checkGameStatus() {
    if (game.isCheckmate()) {
      var messageToSend = game.turn() === "w" ? "Black pieces win by checkmate!" : "White pieces win by checkmate!";

      this.webSocket.send(JSON.stringify({
        "action": "GAME_CHECKMATE",
        "message" :messageToSend
      }));

      this.resetGame();
      
    } else if (game.isDraw()) {

      this.webSocket.send(JSON.stringify({
        "action": "GAME_DRAW",
        "message": "The match ended in a draw (50 move rule or insufficient material)."
      }))

      this.resetGame();

    } else if (game.isThreefoldRepetition()) {
      this.webSocket.send(JSON.stringify({
        "action": "GAME_DRAW",
        "message": "The match ended in a draw due to the repeat movement rule."
      }));

      this.resetGame();

    } else if (game.isStalemate()) {

      this.webSocket.send(JSON.stringify({
        "action": "GAME_DRAW",
        "message": "The game ended in a draw by the stalemate rule (no moves for the king)."
      }));
      
      this.resetGame();
    }
    return
  }

  render() {
    const { fen } = this.state;
    return this.props.children({ position: fen, onDrop: this.onDrop });
  }
}