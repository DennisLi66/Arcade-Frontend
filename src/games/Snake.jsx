import React from "react";
import Button from 'react-bootstrap/Button'

function Snake() {
  //IMPORTANT GAME VARIABLES
  var gameBoard = []; //    42 * 42 Board
  //var direction;
  //var inMotion;
  //var snakeLength;
  function fillGameBoard(){
    var borderRow = []
    for (let i = 0; i < 42; i++){
      borderRow.push("X");
    }
    //push top border row
    gameBoard.push(borderRow);
    //push middle content
    var row = [];
    row.push("X")
    for (let i = 0; i < 40; i++){
      row.push("0");
    }
    row.push("X");
    for (let i = 0; i < 40; i++){
      gameBoard.push(row);
    }
    //push bottom border row
    gameBoard.push(borderRow);
    console.log(gameBoard);
  }
  function readInstructions(){

  }
  function printSnakeBoard(){
    var toPrint = "";
    for (let row = 0; row < 42; row++){
      for (let col = 0; col < 42; col++){
        toPrint += gameBoard[row][col];
      }
      toPrint += "<br></br>"
    }
    document.getElementById("snakeBoard").innerHTML = toPrint;
  }
  function startSnakeGame(){
    printSnakeBoard();
  }

  fillGameBoard();
  return (
    <div className="snakeBoard" id="snakeBoard">
      <h1>Snake</h1>
      <Button onClick={startSnakeGame}>Play Snake</Button><br></br>
      <Button onClick={readInstructions}>Read Instructions</Button><br></br>
    </div>
  )
};

export default Snake;
