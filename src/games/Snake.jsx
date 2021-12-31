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
  // var timeElaspsed = 0;
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
    //console.log(gameBoard);
    gameBoard[38 * 42 + 5] = 'S'; //snake
    gameBoard[37 * 42 + 5] = 'S'; //snake
    gameBoard[36 * 42 + 5] = "H"; //head
    validSquares = [...Array(42*42).keys()];
    console.log(validSquares)
    for (let i = 0; i < (42 * 42); i++){
      if (i % 42 === 0 || i % 42 === 41 || i < 42 || i > (42 * 42 - 42)){
        validSquares.splice(validSquares.indexOf(i),1);
      }
    }
    console.log(validSquares)
    validSquares.splice(validSquares.indexOf(38 * 42 + 5),1);
    validSquares.splice(validSquares.indexOf(37 * 42 + 5),1);
    validSquares.splice(validSquares.indexOf(36 * 42 + 5),1);
    spawnPrize(6 * 42 - 6);
  }
  //inGame
  function spawnPrize(number = -1){
    if (number === -1){
      gameBoard[validSquares[Math.floor(Math.random() * validSquares.length)]] = 'P'
    }else{
      gameBoard[number] = "P";
    }
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
          // console.log(row, " " , col ," ", row * 42 + col);
          toPrint += "<div class='simpleSnake'>"
           // + (row * 42 + col)
           + "</div>"
        }else if (gameBoard[row * 42 + col] === "H"){
                    // console.log(row * 42 + col);
          toPrint += "<div class='simpleSnake'>"
          // + (row * 42 + col)
           + "</div>"
        }
        else if (gameBoard[row * 42 + col] === "P"){
          toPrint += "<div class='simplePrize'>"
          // + (row * 42 + col)
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
