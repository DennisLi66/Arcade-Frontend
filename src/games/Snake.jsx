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
  var gameBoard = []; //    42 * 42 Board FIX THIS: SHOULD PROBABLY CHANGE SIZE
  var score = 0; //snakeLength = score + 3
  // var timeElaspsed = 0;
  var intervalID;
  var validSquares = [];
  var direction = false; //will also tell us if gamestarted
  var snakePositions; //is a stack

  //Helper Functions
  function moveToSpace(space){
    if (space < 42 || space > (42*42-42) ||  space % 42 === 41 || space % 42 === 0 || snakePositions.slice(1).indexOf(space) !== -1 ){//snake collides onto wall or body part that is not tail //FIX THIS
      clearInterval(intervalID);
      displayEndingScreen();
    }else{
      //add snake head to location above previous head
      //change snake stack
      //change validSquares
      // if (gameBoard[space] === 'P'){
      //   //change previous head to snake body
      //   //change prize slot to head
      //   spawnPrize(); //add new prize
      // }else{
      //   //move head to new slot
      //   //change previous tail to empty space
      // }
      //if snake on prize, change that position to head and previous position to snake
      //move snake
        //check if lost
          //also add a stopping condition
    }
  }
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
    snakePositions.push(...[38*42+5,37*42+5,36*42+5])
    validSquares = [...Array(42*42).keys()];
    for (let i = 0; i < (42 * 42); i++){
      if (i % 42 === 0 || i % 42 === 41 || i < 42 || i > (42 * 42 - 42)){
        validSquares.splice(validSquares.indexOf(i),1);
      }
    }
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
  function detectDirectionalKeyDown(key){
    //left: 37, up: 38, right: 39, down: 40
    key = key.keyCode;
    console.log(key);
    if (key === 37 || key === '37'){
      if (!direction){
        direction = "left";
        intervalID = setInterval(runGame, 1000);
      }
      direction = "left";
    }else if (key === 38 || key === "38"){
      if (!direction){
        direction = "up";
        intervalID = setInterval(runGame, 1000);
      }
      direction = "up";
    }else if (key === 39 || key === "39"){
      if (!direction){
        direction = "right";
        intervalID = setInterval(runGame, 1000);
      }
      direction = "right";
    }else if (key === 40 || key === "40"){
      if (!direction){
        direction = "down";
        intervalID = setInterval(runGame, 1000);
      }
      direction = "down";
    }
  }
  function runGame(){ //constantly check state of game
    console.log(direction);
    if (direction === "up"){
      moveToSpace(snakePositions[snakePositions.length - 1]- 42)
    }else if (direction === "left"){
      moveToSpace(snakePositions[snakePositions.length - 1] - 1)
    }else if (direction === "right"){
      moveToSpace(snakePositions[snakePositions.length - 1] + 1)
    }else if (direction === "down"){
      moveToSpace(snakePositions[snakePositions.length - 1] + 42)
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
  }
  function printInfoRow(){
    var text = (<Button id='returnButton'>Return</Button>);
    var middleText;
    if (direction){
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
    printInfoRow();
    document.addEventListener('keydown',detectDirectionalKeyDown);
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
  function displayEndingScreen(){
    //FIX THIS ADD LOSING SCREEN
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
