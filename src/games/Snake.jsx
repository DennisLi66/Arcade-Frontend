import React from "react";
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import "./css/Snake.css"
import loginFunctionality from "../loginFunctionality/loginFunctionality"
import ReactDOMServer from 'react-dom/server';
import Cookies from 'universal-cookie';
require('dotenv').config();
//Could Add Difficuly FIX THIS, like faster or constantly increasing
//Add seeing scores FIX THIS
//Add score submission FIX THIS
//FIX THIS ADD instructions

function Snake() {
  const cookies = new Cookies();
  //IMPORTANT GAME VARIABLES
  var gameBoard = []; //    42 * 42 Board FIX THIS: SHOULD PROBABLY CHANGE SIZE
  var score = 0; //snakeLength = score + 3
  var startingTime = 0;
  var intervalID = "";
  var validSquares = [];
  var direction = false; //will also tell us if gamestarted
  var currentDirection = false;
  var snakePositions = []; //is a stack
  var endingTime = 0;
  //Helper Functions
  function moveToSpace(space){
    if (space < 42 || space > (42*42-42) ||  space % 42 === 41 || space % 42 === 0 || snakePositions.slice(1).indexOf(space) !== -1 ){//snake collides onto wall or body part that is not tail
      direction = "end";
      endingTime = Date.now() - startingTime;
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
    startingTime = 0;
    intervalID = "";
    validSquares = [];
    direction = false;
    snakePositions = [];
    gameBoard = [];
    score = 0;
    document.removeEventListener('keydown',detectOnlyRestart);
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
    // console.log(key);
    if ((key === 37 || key === '37') && currentDirection !== "right"){
      if (!direction){
        direction = "left";
        startingTime = Date.now();
        intervalID = setInterval(runGame, 125);
        printInfoRow();
      }
      direction = "left";
    }else if ((key === 38 || key === "38") && currentDirection !== "down"){
      if (!direction){
        direction = "up";
        startingTime = Date.now();
        intervalID = setInterval(runGame, 125);
        printInfoRow();
      }
      direction = "up";
    }else if ((key === 39 || key === "39") && currentDirection !== "left"){
      if (!direction){
        direction = "right";
        startingTime = Date.now();
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
  function detectOnlyRestart(key){
    key = key.keyCode;
    if (key === 82 || key === "82") startSnakeGame();
  }
  function runGame(){ //constantly check state of game
    if (direction === "up"){
      currentDirection = direction;
      moveToSpace(snakePositions[snakePositions.length - 1]- 42)
    }else if (direction === "left"){
      currentDirection = direction;
      moveToSpace(snakePositions[snakePositions.length - 1] - 1)
    }else if (direction === "right"){
      currentDirection = direction;
      moveToSpace(snakePositions[snakePositions.length - 1] + 1)
    }else if (direction === "down"){
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
  function printSnakeBoard(message = ""){
    var toPrint = "";
    if (message !== ""){
      toPrint += "<div class='errMsg'>" + message + "</div>"
    }
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
        <div>
          Snake is a game about controlling a snake trying to eat a dot. The snake must avoid crashing into the walls or crashing into
          itself, and will need your help to do so.

          Use the arrow keys to navigate the snake towards the dot.
          Press R to quickly restart the game if necessary.
        </div>
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
            <Button id='readInstructionsButton'>Read Instructions</Button><br></br>
            <Button id="getScoresButton">Scores</Button><br></br><br></br>
        </div>
      )
    )
    document.getElementById('playSnakeButton').onclick = function(){startSnakeGame()};
    document.getElementById('readInstructionsButton').onclick = function(){readInstructions()};
    document.getElementById('getScoresButton').onclick = function(){getScoresPage()}
  }
  function getScoresPage(message = "", rule = "", results = [], start = 0, end = 10){ //FIX THIS DOES NOT DISPLAY PROPERLY
    var fetchString;
    var scoreTitle;
    if (rule === "" || rule === "best"){//Get the best
      fetchString = "/scoreswithtimes?sortBy=top";
      scoreTitle = "Top Scores";
    }else if (rule === "recent"){
      fetchString = "/scoreswithtimes?sortBy=recent"
      scoreTitle = "Recent Scores";
    }else if (rule === "mybest"){
      fetchString = "/scoreswithtimes?sortBy=top&userID="  + cookies.get("id");
      scoreTitle = "Your Top Scores";
    }else if (rule === "myrecent"){
      fetchString = "scoreswithtimes?sortBy=recent&userID=" + cookies.get("id");
      scoreTitle = "Your Recent Scores";
    }
    if (results.length === 0){
      fetch(process.env.REACT_APP_SERVERLOCATION + fetchString + '&gameID=1')
        .then(response => response.json())
        .then(data => {
          console.log(data.results);
          if (data.status === -1){
            // do nothing... FIX THIS
            console.log(data.message);
          }else{
            scoresHelperFunction(message,rule,data.results,start,end,scoreTitle)
          }
        })
    }else{ //use results instead
      scoresHelperFunction(message,rule,results,start,end,scoreTitle)
    }
  }
  function scoresHelperFunction(message,rule,results,start,end,scoreTitle){
    var listOfElements = [];
    for (let i = start; i < Math.min(results.length,end); i++){
      listOfElements.push(<tr key = {i}><td>{i + 1}</td> <td> {results[i][0]} </td> <td> {results[i][1]} </td> <td> {results[i][2]}</td> <td> {results[i][3]}</td> </tr>)
    }
    var otherMetricButton;
    var personalScoresSwitchButton;
    if (rule === "myrecent"){
      otherMetricButton = (<Button id='otherMetricButton'> My Best Scores </Button>)
      personalScoresSwitchButton = (<Button id='personalScoresSwitch'> All Recent Scores </Button>)
    }else if (rule === "mybest"){
      otherMetricButton = (<Button id='otherMetricButton'> My Recent Scores </Button>)
      personalScoresSwitchButton = (<Button id='personalScoresSwitch'> All Best Scores </Button>)
    }else if (rule === "recent"){
      if (cookies.get("id")){
        personalScoresSwitchButton = (<Button id='personalScoresSwitch'> My Recent Scores </Button>)
      }
      otherMetricButton =  (<Button id='otherMetricButton'> All Best Scores </Button>)
    }else if (rule === "best" || rule === ""){
      if (cookies.get("id")){
        personalScoresSwitchButton = (<Button id='personalScoresSwitch'> My Best Scores </Button>)
      }
      otherMetricButton =  (<Button id='otherMetricButton'> All Recent Scores </Button>)
    }
    var nextButton, prevButton;
    if (end < results.length){
      nextButton = (<Button onClick={getScoresPage("",rule,results,start + 10, end + 10)}> Next </Button>)
    }
    if (start > 0){
      prevButton = (<Button onClick={getScoresPage("",rule,results,Math.min(start - 10), Math.max(end - 10,10))}> Previous </Button>)
    }
    var reactString = (
      <div>
        <h1> {scoreTitle} </h1>
        <div><Button id='backButton'>Main Menu</Button></div>
        <div> {otherMetricButton} {personalScoresSwitchButton} </div>
        <Table>
        <thead> <tr> <th> # </th> <th> Username </th> <th> Score </th> <th> Time </th> <th> Time Submitted </th> </tr> </thead>
        <tbody>
        {listOfElements}
        </tbody>
        </Table>
        <div>{prevButton}{nextButton}</div>
      </div>
    );
    document.getElementById('gameScreen').innerHTML = ReactDOMServer.renderToStaticMarkup(reactString);
    document.getElementById('backButton').onclick = function(){getFrontPage()};
    if (rule === "myrecent"){
      document.getElementById("personalScoresSwitch").onclick = function(){getScoresPage("","recent")};
      document.getElementById("otherMetricButton").onclick = function(){getScoresPage("","mybest")};
    }else if (rule === "mybest"){
      document.getElementById("personalScoresSwitch").onclick = function(){getScoresPage("","best")};
      document.getElementById("otherMetricButton").onclick = function(){getScoresPage("","myrecent")};
    }else if (rule === "recent"){
      if (cookies.get("id")){
        document.getElementById("personalScoresSwitch").onclick = function(){getScoresPage("","myrecent")};
      }
      document.getElementById("otherMetricButton").onclick = function(){getScoresPage("","best")};
    }else if (rule === "best" || rule === ""){
      if (cookies.get("id")){
        document.getElementById("personalScoresSwitch").onclick = function(){getScoresPage("","mybest")};
      }
      document.getElementById("otherMetricButton").onclick = function(){getScoresPage("","recent")};
    }
  }
  //Post GAME
  function submitScore(){
    // console.log(cookies.get("id"));
    // console.log(cookies.get("sessionID"));
    if (cookies.get("id")){
      const requestSetup = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({userID:cookies.get("id"),score:score,gameID:1,
        timeInMilliseconds: endingTime,sessionID:cookies.get("sessionID")}) //FIX THIS: IF I ADD DIFFICULTY, CHANGE GAMEIDS
      }
      fetch(process.env.REACT_APP_SERVERLOCATION + '/scoreswithtimes',requestSetup)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          if (data.status === -1){
            printSnakeBoard(data.message);
          }else{
            getScoresPage("Your score has been submitted.")
          }
        })
    }else{
      document.getElementById('gameScreen').innerHTML = ReactDOMServer(
        loginFunctionality({score: score, timeInMilliseconds: endingTime, gameID: 1})
      )
      //ask that the user logs in FIX THIS
      // pass a dictionary to a new object in a new file
    }
  }
  function displayEndingScreen(){ //Display Score and Time Elapsed, Restart Button, Submit Score Button
    //document.removeEventListener('keydown',detectDirectionalKeyDown);
    document.addEventListener('keydown',detectOnlyRestart)
    var scoreInformation = (" Score: " + score + " Time Elapsed: " + endingTime / 1000 + " seconds ");
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
      <Button onClick={getScoresPage}>Scores</Button><br></br>
    </div>
  )
};

export default Snake;
