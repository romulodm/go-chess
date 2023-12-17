import React, { Component } from "react";
import PropTypes from "prop-types";
import { Chess } from "chess.js";

const game = new Chess();

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
    console.log(game.turn(), this.myColor)
    if ((game.turn() === "w" && this.myColor === "white") || (game.turn() === "b" && this.myColor === "black")) {
      return true
    }
    return false
  };

  componentDidMount() {
    this.setState({ fen: game.fen() });

    this.webSocket.onmessage = (event) => {
      const messageFromServer = JSON.parse(event.data);
    
      if (messageFromServer.action === "GAME_MOVE") {
        game.load(messageFromServer.message);

        this.setState({ fen: game.fen() });
      }
    };
    
  }

  onDrop = ({ sourceSquare, targetSquare }) => {
    
    if (this.isMyTurn()) {
      try {
        const move = game.move({
          from: sourceSquare,
          to: targetSquare,
          promotion: "q"
        });

        if (move === null) return;
      
      } catch (error) {
        return
      }

      this.setState({ fen: game.fen() });

      this.webSocket.send(JSON.stringify({
        "action": "GAME_MOVE",
        "message": game.fen()
      }));
    }
  };

  prepareMove() {
    console.log("Oi")
  }

  render() {
    const { fen } = this.state;
    return this.props.children({ position: fen, onDrop: this.onDrop });
  }
}