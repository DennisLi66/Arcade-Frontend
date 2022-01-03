import React from "react";
import Button from 'react-bootstrap/Button'
import "./css/Snake.css"
import ReactDOMServer from 'react-dom/server';

//Could Add Difficuly FIX THIS, like faster or constantly increasing
//Add seeing scores FIX THIS
//Add score submission FIX THIS

function Snake() {
  //IMPORTANT GAME VARIABLES
  var gameBoard = []; //    42 * 42 Board FIX THIS: SHOULD PROBABLY CHANGE SIZE
  var score = 0; //snakeLength = score + 3
  var timeElaspsed = 0;
  var intervalID = "";
  var validSquares = [];
  var direction = false; //will also tell us if gamestarted
  var currentDirection = false;
  var snakePositions = []; //is a stack
  //Helper Functions
  function moveToSpace(space){
    if (space < 42 || space > (42*42-42) ||  space % 42 === 41 || space % 42 === 0 || snakePositions.slice(1).indexOf(space) !== -1 ){//snake collides onto wall or body part that is not tail
      direction = "end";
      clearInterval(intervalID);
      displayEndingScreen();
    }else{
      if (gameBoard[space] === 'P'){
        gameBoard[snakePositions[snakePositions.length - 1]] = 'S';//change previous head to snake body
        gameBoard[space] = 'H';
        snakePositions.push(space);
        validSquares.splice(validSquares.indexOf(space),1)//change prize slot to head
        score++;
        spawnPrize(); //add new prize
        printInfoRow();
      }else{
        //Make new space head
        gameBoard[snakePositions[snakePositions.length - 1]] = 'S';
        gameBoard[space] = 'H';
        validSquares.splice(validSquares.indexOf(space),1)
        snakePositions.push(space);
        //Make old tail valid
        var tail = snakePositions.shift(); //pop stack snake
        gameBoard[tail] = "0";//change previous tail to empty space
        validSquares.push(space);//make tail validsquare
      }
      printSnakeBoard();
    }
  }
  //Pregame
  function fillGameBoard(){
    if (intervalID !== ""){
      clearInterval(intervalID);
    }
    timeElaspsed = 0;
    intervalID = "";
    validSquares = [];
    direction = false;
    snakePositions = [];
    gameBoard = [];
    score = 0;
    //Actual Function
    var borderRow = [];
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
    if ((key === 37 || key === '37') && currentDirection !== "right"){
      if (!direction){
        direction = "left";
        intervalID = setInterval(runGame, 125);
        printInfoRow();
      }
      direction = "left";
    }else if ((key === 38 || key === "38") && currentDirection !== "down"){
      if (!direction){
        direction = "up";
        intervalID = setInterval(runGame, 125);
        printInfoRow();
      }
      direction = "up";
    }else if ((key === 39 || key === "39") && currentDirection !== "left"){
      if (!direction){
        direction = "right";
        intervalID = setInterval(runGame, 125);
        printInfoRow();
      }
      direction = "right";
    }else if ((key === 40 || key === "40") && currentDirection !== "up"){
      if (direction){
        direction = "down";
      }
    }
    else if ((key === 82 || key === "82")){ //R
      startSnakeGame();
    }
  }
  function runGame(){ //constantly check state of game
    if (direction === "up"){
      timeElaspsed = Date.now();
      currentDirection = direction;
      moveToSpace(snakePositions[snakePositions.length - 1]- 42)
    }else if (direction === "left"){
      timeElaspsed = Date.now();
      currentDirection = direction;
      moveToSpace(snakePositions[snakePositions.length - 1] - 1)
    }else if (direction === "right"){
      timeElaspsed = Date.now();
      currentDirection = direction;
      moveToSpace(snakePositions[snakePositions.length - 1] + 1)
    }else if (direction === "down"){
      timeElaspsed = Date.now();
      currentDirection = direction;
      moveToSpace(snakePositions[snakePositions.length - 1] + 42)
    }
  }
  //Printers
  function printInitialContent(){
    var toPrint = "<h1>Snake</h1><div class='gameBoard' id='gameBoard'>";
    toPrint += "</div>";
    toPrint += "<div class='bulletinBoard' id='bulletinBoard'></div>";
    document.getElementById("gameScreen").innerHTML = toPrint;
    printSnakeBoard();
    printInfoRow();
  }
  function printSnakeBoard(){
    var toPrint = "";
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
    document.getElementById("gameBoard").innerHTML = toPrint;
  }
  function printInfoRow(){
    var text = (<Button id='returnButton'>Main Menu</Button>);
    var middleText;
    var quickRestartButton;
    if (direction){
      middleText = (" Score: " + score + " ");
      quickRestartButton = (<Button id="quickRestartButton">Restart</Button>)
    }else{
      middleText = ("Press on any of the arrow keys to start.")
    }
    document.getElementById("bulletinBoard").innerHTML = ReactDOMServer.renderToStaticMarkup(
      (
        <div>
          {text}
          {middleText}
          {quickRestartButton}
        </div>
      )
    );
    document.getElementById("returnButton").onclick = function(){getFrontPage()};
    if (direction) document.getElementById("quickRestartButton").onclick = function(){startSnakeGame()};
  }
  function startSnakeGame(){
    fillGameBoard();
    printInitialContent();
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
  //Post GAME
  function submitScore(){

  }
  function displayEndingScreen(){ //Display Score and Time Elapsed, Restart Button, Submit Score Button
    //document.removeEventListener('keydown',detectDirectionalKeyDown);
    var scoreInformation = (" Score: " + score + " Time Elasped: " + Date.now() - timeElaspsed);
    var returnButton = (<Button id="returnButton">Main Menu</Button>)
    var quickRestartButton = (<Button id="quickRestartButton">Restart</Button>);
    var submitScoreButton = (<Button id='submitScoreButton'>Submit Score</Button>)
    document.getElementById('bulletinBoard').innerHTML = ReactDOMServer.renderToStaticMarkup(
      <div>
        {returnButton}
        {scoreInformation}
        {quickRestartButton}
        {submitScoreButton}
      </div>
    );
    document.getElementById("returnButton").onclick = function(){getFrontPage()};
    document.getElementById("quickRestartButton").onclick = function(){startSnakeGame()};
    document.getElementById("submitScoreButton").onclick = function(){submitScore()}
  }

  return (
    <div className="gameScreen" id="gameScreen">
      <h1>Snake</h1>
      <Button onClick={startSnakeGame}>Play Snake</Button><br></br>
      <Button onClick={readInstructions}>Read Instructions</Button><br></br>
    </div>
  )
};

export default Snake;
