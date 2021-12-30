import React from "react";
import Button from 'react-bootstrap/Button'
import "./css/Snake.css"

//To do
//convert to a react hook
//Draw snake
//write function to spawn targets
function Snake() {
  //IMPORTANT GAME VARIABLES
  var gameBoard = []; //    42 * 42 Board
  var score = 0;
  var gameStarted = false;
  //var direction;
  //var inMotion;
  //var snakeLength;
  //var snakePositions; //is a stack

  function fillGameBoard(){
    var borderRow = []
    for (let i = 0; i < 42; i++){
      borderRow.push("X");
    }
    //push top border row
    gameBoard.push(borderRow);
    //push middle content
    var row = [];
    row.push("X");
    for (let i = 0; i < 40; i++){
      row.push("0");
    }
    row.push("X");
    for (let i = 0; i < 40; i++){
      gameBoard.push(row);
    }
    //push bottom border row
    gameBoard.push(borderRow);
    // console.log(gameBoard);
  }
  function readInstructions(){
    document.getElementById("gameScreen").innerHTML = (
      <div>
        <Button onClick={getFrontPage}>Back</Button>
        <h1> Instructions </h1>
      </div>
    )
  }
  //Printers
  function printSnakeBoard(){
    var toPrint = "<h1>Snake</h1><div class='gameBoard' id='gameBoard'>";
    for (let row = 0; row < 42; row++){
      for (let col = 0; col < 42; col++){
        // toPrint += gameBoard[row][col];
        if (gameBoard[row][col] === '0'){
          toPrint += "<div class='boardSquare'>" // + (row * 42 + col)
           + "</div>"
        }else if (gameBoard[row][col] === 'X'){
          toPrint += "<div class='borderSquare'>" // + (row * 42 + col)
           + "</div>"
        }
      }
      toPrint += "<br></br>"
    }
    toPrint += "</div>";
    toPrint += "<div class='bulletinBoard' id='bulletinBoard'></div>";
    document.getElementById("gameScreen").innerHTML = toPrint;
    printBulletinBoard();
  }
  function printBulletinBoard(){
    var text = "<Button onClick=''>Return</Button>";
    if (gameStarted){
      text += " Score: " + score;
    }else{
      text += " Press on any of the arrow keys to start."
    }
    document.getElementById("bulletinBoard").innerHTML = text;
  }
  function startSnakeGame(){
    printSnakeBoard();
  }
  function getFrontPage(){
    document.getElementById("gameScreen").innerHTML =
    (
      <div>
        <h1>Snake</h1>
        <Button onClick={startSnakeGame}>Play Snake</Button><br></br>
        <Button onClick={readInstructions}>Read Instructions</Button><br></br>
      </div>
    )
  }

  fillGameBoard();
  return (
    <div className="gameScreen" id="gameScreen">
      <h1>Snake</h1>
      <Button onClick={startSnakeGame}>Play Snake</Button><br></br>
      <Button onClick={readInstructions}>Read Instructions</Button><br></br>
    </div>
  )
};

export default Snake;
