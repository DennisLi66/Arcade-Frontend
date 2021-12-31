import React from "react";
import Button from 'react-bootstrap/Button'
import "./css/Snake.css"
import ReactDOMServer from 'react-dom/server';

//To do
//convert to a react hook
//Draw snake
//write function to spawn targets
function Snake() {
  //IMPORTANT GAME VARIABLES
  var gameBoard = []; //    42 * 42 Board
  var score = 0;
  var gameStarted = false;
  var validSquares = [];
  //var direction;
  //var inMotion;
  //var snakeLength;
  //var snakePositions; //is a stack

  //Pregame
  function fillGameBoard(){
    var borderRow = []
    for (let i = 0; i < 42; i++){
      borderRow.push("X");
    }
    //push top border row
    gameBoard.push(...borderRow);
    //push middle content
    var row = [];
    row.push("X");
    for (let i = 0; i < 40; i++){
      row.push("0");
    }
    row.push("X");
    for (let i = 0; i < 40; i++){
      gameBoard.push(...row);
    }
    //push bottom border row
    gameBoard.push(...borderRow);
    console.log(gameBoard);
    // gameBoard[1][1] = 'S'; //snake
    // console.log(gameBoard[5][39])
    // gameBoard[5][37] = 'S'; //snake
    // gameBoard[5][36] = "H"; //head
    //FIX THIS: ADD VALID SQUARES, THEN SPAWN PRIZE
  }
  //Printers
  function printSnakeBoard(){
    var toPrint = "<h1>Snake</h1><div class='gameBoard' id='gameBoard'>";
    for (let row = 0; row < 42; row++){
      for (let col = 0; col < 42; col++){
        if (gameBoard[row * 42 + col] === '0'){
          toPrint += "<div class='boardSquare'>" // + (row * 42 + col)
           + "</div>"
        }else if (gameBoard[row * 42 + col] === 'X'){
          toPrint += "<div class='borderSquare'>"
          // + (row * 42 + col)
           + "</div>"
        }else if (gameBoard[row * 42 + col] === "S"){
          console.log(row, " " , col ," ", row * 42 + col);
          toPrint += "<div class='simpleSnake'>"
           + (row * 42 + col)
           + "</div>"
        }else if (gameBoard[row * 42 + col] === "H"){
                    console.log(row * 42 + col);
          toPrint += "<div class='simpleSnake'>"
          + (row * 42 + col)
           + "</div>"
        }
      }
      toPrint += "<br></br>"
    }
    toPrint += "</div>";
    toPrint += "<div class='bulletinBoard' id='bulletinBoard'></div>";
    document.getElementById("gameScreen").innerHTML = toPrint;
    printInfoRow();
  } //FIX THIS: can change toReact
  function printInfoRow(){
    var text = (<Button id='returnButton'>Return</Button>);
    var middleText;
    if (gameStarted){
      middleText = " Score: " + score;
    }else{
      middleText = " Press on any of the arrow keys to start."
    }
    document.getElementById("bulletinBoard").innerHTML = ReactDOMServer.renderToStaticMarkup(
      (
        <div>
          {text}
          {middleText}
        </div>
      )
    );
    document.getElementById("returnButton").onclick = function(){getFrontPage()};
  }
  function startSnakeGame(){
    printSnakeBoard();
  }
  //Pages
  function readInstructions(){ //FIX THIS: ADD INSTRUCTIONS
    document.getElementById("gameScreen").innerHTML = ReactDOMServer.renderToStaticMarkup(
      <div>
        <Button id='backButton'>Back</Button>
        <h1> Instructions </h1>
      </div>
    )
    document.getElementById('backButton').onclick = function(){getFrontPage()}
  }
  function getFrontPage(){
    document.getElementById("gameScreen").innerHTML = ReactDOMServer.renderToStaticMarkup(
      (
        <div>
          <h1>Snake</h1>
            <Button id='playSnakeButton'>Play Snake</Button><br></br>
            <Button id='readInstructionsButton'>Read Instructions</Button><br></br><br></br>
        </div>
      )
    )
    document.getElementById('playSnakeButton').onclick = function(){startSnakeGame()};
    document.getElementById('readInstructionsButton').onclick = function(){readInstructions()};
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
