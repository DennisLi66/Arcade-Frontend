import React from "react";
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import cookieSetter from "../helpers/setCookiesForGame.jsx"
import ReactDOMServer from 'react-dom/server';
import Cookies from 'universal-cookie';
import millisecondsToReadableTime from "../helpers/timeConversion.ts";
import $ from 'jquery'
require('dotenv').config();

//Could Add Difficuly FIX THIS, like faster or constantly increasing

function Snake(msg = "") {
  const cookies = new Cookies();
  //IMPORTANT GAME VARIABLES
  var gameBoard = []; //    42 * 42 Board FIX THIS: SHOULD PROBABLY CHANGE SIZE
  var score = 0; //snakeLength = score + 3
  var startingTime = 0;
  var intervalID = "";
  var validSquares = [];
  var direction = false; //will also tell us if gamestarted
  var currentDirection = "up";
  var snakePositions = []; //is a stack
  var totalTime = 0;
  var setTime = 0;
  var paused = false;
  var permit = true;
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
        permit = true;
      }
      printSnakeBoard();
    }
  }
  //Pregame
  function fillGameBoard(){
    clearInterval(intervalID);
    startingTime = 0;
    intervalID = "";
    currentDirection = "up";
    permit = true;
    validSquares = [];
    direction = false;
    setTime = 0;
    totalTime = 0;
    snakePositions = [];
    gameBoard = [];
    score = 0;
    paused = false;
    $('body').off('keydown',detectOnlyRestart);
    //Actual Function
    var borderRow = [];
    for (let i = 0; i < 42; i++) borderRow.push("X");
    //push top border row
    gameBoard.push(...borderRow);
    //push middle content
    var row = [];
    row.push("X");
    for (let i = 0; i < 40; i++) row.push("0");
    row.push("X");
    for (let i = 0; i < 40; i++) gameBoard.push(...row);
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
    key.preventDefault();
    key = key.keyCode;
    if ((key === 37 || key === '37') && currentDirection !== "right"){
      if (!direction){
        direction = "left";
        startingTime = Date.now();
        intervalID = setTimeout(runGame, 75);
        printInfoRow();
      }
      else if (permit) direction = "left";
      permit = false;
    }else if ((key === 38 || key === "38") && currentDirection !== "down"){
      if (!direction){
        direction = "up";
        startingTime = Date.now();
        intervalID = setTimeout(runGame, 75);
        printInfoRow();
      }
      else if (permit) direction = "up";
      permit = false;
    }else if ((key === 39 || key === "39") && currentDirection !== "left"){
      if (!direction){
        direction = "right";
        startingTime = Date.now();
        intervalID = setTimeout(runGame, 75);
        printInfoRow();
      }
      else if (permit) direction = "right";
      permit = false;
    }else if ((key === 40 || key === "40") && currentDirection !== "up"){
      if (direction){
        direction = "down";
      }
      else if (permit) direction = "down"
      permit = false;
    }
    else if ((key === 32 || key === "32")  && direction ){
      pauseGame();
    }else if ((key === 82 || key === "82")){ //R
      startSnakeGame();
    }
  }
  function detectOnlyRestart(key){
    key = key.keyCode;
    if (key === 82 || key === "82") startSnakeGame();
  }
  function detectOnlyPauseOrRestart(key){
    key = key.keyCode;
    if (key === 82 || key === "82") startSnakeGame();
    else if ((key === 32 || key === "32")) pauseGame();
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
    if (!(direction === 'end')){
      setTime = Date.now();
      intervalID = setTimeout(runGame, 75);
    }
  }
  function pauseGame(){
    if (paused){
      startingTime = Date.now();
      var placeholder = paused;
      paused = false;
      setTime = Date.now();
      setTimeout(runGame,placeholder);
      $('body').off('keydown',detectOnlyPauseOrRestart);
      $('body').on('keydown',detectDirectionalKeyDown);
      $("#pauseScreen").css('visibility','hidden');
    }else{
      totalTime += Date.now() - startingTime;
      clearTimeout(intervalID);
      paused = Date.now() - setTime;
      $('body').off('keydown',detectDirectionalKeyDown);
      $('body').on('keydown',detectOnlyPauseOrRestart);
      $("#pauseScreen").css('visibility','visible');
    }
  }
  //Printers
  function printInitialContent(){
    $("#gameScreen").html(ReactDOMServer.renderToStaticMarkup(
      <>
      <h1>Snake</h1>
      <div className = 'snakeScreen' id='snakeScreen'>
        <div className='gameBoard' id='gameBoard'></div>
        <div className='pauseScreen' id='pauseScreen'><div className='pauseText'><h1>PAUSED</h1><br></br><h3>Press Space to Unpause</h3></div></div>
      </div>
      <div className='bulletinBoard' id='bulletinBoard'></div>
      </>
    ));
    printSnakeBoard();
    printInfoRow();
  }
  function printSnakeBoard(message = ""){
    var squareList = [];
    for (let i = 0; i < gameBoard.length; i++){
        if (gameBoard[i] === '0'){
           squareList.push(<div key={i} className='boardSquare'></div>);
        }else if (gameBoard[i] === 'X'){
           squareList.push(<div key={i} className='borderSquare'></div>);
        }else if (gameBoard[i] === "S"){
           squareList.push(<div key={i} className='simpleSnake'></div>);
        }else if (gameBoard[i] === "H"){
           squareList.push(<div key={i} className='simpleSnake'></div>);
        }else if (gameBoard[i] === "P"){
          squareList.push(<div key={i} className='simplePrize'></div>);
      }
    }
    var reactString = (
      <>
        <div className='errMsg'>{message}</div>
        {squareList}
      </>
    )
    $("#gameBoard").html(ReactDOMServer.renderToStaticMarkup(reactString));
  }
  function printInfoRow(){
    var text = (<Button id='returnButton'>Main Menu</Button>);
    var middleText;
    var quickRestartButton;
    if (direction){
      middleText = (" Score: " + score + " ");
      quickRestartButton = (<Button id="quickRestartButton">Restart</Button>)
    }else middleText = ("Press on any of the arrow keys to start.")
    $("#bulletinBoard").html(ReactDOMServer.renderToStaticMarkup(
      (
        <div>
          {text}
          {middleText}
          {quickRestartButton}
        </div>
      )
    ));
    $("#returnButton").click(function(){getFrontPage()});
    if (direction) $("#quickRestartButton").click(function(){startSnakeGame()});
  }
  function startSnakeGame(){
    fillGameBoard();
    printInitialContent();
    $('body').on('keydown',detectDirectionalKeyDown);
  }
  //Pages
  function readInstructions(){
    $("#gameScreen").html(ReactDOMServer.renderToStaticMarkup(
      <div>
        <Button id='backButton'>Back</Button>
        <h1> Instructions </h1>
        <div>
        <p>
          Snake is a game about controlling a snake trying to eat a dot. The snake must avoid crashing into the walls or crashing into
          itself, and will need your help to do so.
        </p>
          <p>Use the arrow keys to navigate the snake towards the dot.</p>
          <p>Press the spacebar to pause the game as needed.</p>
          <p>Press R to quickly restart the game if necessary.</p>
        </div>
      </div>
    ));
    $('#backButton').click(function(){getFrontPage()});
  }
  function getFrontPage(){
    $("#gameScreen").html(ReactDOMServer.renderToStaticMarkup(
      (
        <div>
          <h1>Snake</h1>
            <Button id='playSnakeButton'>Play Snake</Button><br></br>
            <Button id='readInstructionsButton'>Read Instructions</Button><br></br>
            <Button id="getScoresButton">Scores</Button><br></br><br></br>
        </div>
      )
    ));
    $('#playSnakeButton').click(function(){startSnakeGame()});
    $('#readInstructionsButton').click(function(){readInstructions()});
    $('#getScoresButton').click(()=>{getScoresPage()});
  }
  function getScoresPage(message = "", rule = "", results = [], start = 0, end = 10){ //FIX THIS DOES NOT DISPLAY PROPERLY
    console.log(message)
    console.log(rule)
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
      fetchString = "/scoreswithtimes?sortBy=recent&userID=" + cookies.get("id");
      scoreTitle = "Your Recent Scores";
    }
    if (results.length === 0){
      fetch(process.env.REACT_APP_SERVERLOCATION + fetchString + '&gameID=1')
        .then(response => response.json())
        .then(data => {
          console.log(data.results);
          if (data.status === -1){
            // console.log(data.message);
            scoresHelperFunction(data.message,rule,data.results,start,end,scoreTitle);
          }
          else if (!data.results) scoresHelperFunction("Oops! Received Faulty Information From Server...",rule,[],start,end,scoreTitle);
          else scoresHelperFunction(message,rule,data.results,start,end,scoreTitle);
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
      if (cookies.get("id")) personalScoresSwitchButton = (<Button id='personalScoresSwitch'> My Recent Scores </Button>)
      otherMetricButton =  (<Button id='otherMetricButton'> All Best Scores </Button>)
    }else if (rule === "best" || rule === ""){
      if (cookies.get("id")) personalScoresSwitchButton = (<Button id='personalScoresSwitch'> My Best Scores </Button>)
      otherMetricButton =  (<Button id='otherMetricButton'> All Recent Scores </Button>)
    }
    var nextButton, prevButton;
    if (end < results.length) nextButton = (<Button onClick={getScoresPage("",rule,results,start + 10, end + 10)}> Next </Button>)
    if (start > 0) prevButton = (<Button onClick={getScoresPage("",rule,results,Math.min(start - 10), Math.max(end - 10,10))}> Previous </Button>)
    var notif = (<div> </div>);
    if (message && message !== "") {
      if (message === "" || message === "Your score has been submitted.") notif = (<div className="confMsg">{message}</div>)
      else notif = (<div className="errMsg"> {message} </div>)
    }
    var reactString = (
      <div>
        <h1> {scoreTitle} </h1>
        <div><Button id='backButton'>Main Menu</Button></div>
        <div> {otherMetricButton} {personalScoresSwitchButton} </div>
        <div>{notif}</div>
        <Table>
        <thead> <tr> <th> # </th> <th> Username </th> <th> Score </th> <th> Time </th> <th> Time Submitted </th> </tr> </thead>
        <tbody>
        {listOfElements}
        </tbody>
        </Table>
        <div>{prevButton}{nextButton}</div>
      </div>
    );
    $('#gameScreen').html(ReactDOMServer.renderToStaticMarkup(reactString));
    $('#backButton').click(function(){getFrontPage()});
    if (rule === "myrecent"){
      $("#personalScoresSwitch").click(function(){getScoresPage("","recent")});
      $("#otherMetricButton").click(function(){getScoresPage("","mybest")});
    }else if (rule === "mybest"){
      $("#personalScoresSwitch").click(function(){getScoresPage("","best")});
      $("#otherMetricButton").click(function(){getScoresPage("","myrecent")});
    }else if (rule === "recent"){
      if (cookies.get("id")) $("#personalScoresSwitch").click(function(){getScoresPage("","myrecent")});
      $("#otherMetricButton").click(function(){getScoresPage("","best")});
    }else if (rule === "best" || rule === ""){
      if (cookies.get("id")) $("#personalScoresSwitch").click(function(){getScoresPage("","mybest")});
      $("#otherMetricButton").click(function(){getScoresPage("","recent")});
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
        timeInMilliseconds: totalTime,sessionID:cookies.get("sessionID")}) //FIX THIS: IF I ADD DIFFICULTY, CHANGE GAMEIDS
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
      cookieSetter({score: score, timeInMilliseconds: totalTime, gameID: 1});
    }
  }
  function displayEndingScreen(){ //Display Score and Time Elapsed, Restart Button, Submit Score Button
    totalTime += Date.now() - startingTime;
    $('body').off('keydown',detectDirectionalKeyDown);
    $('body').on('keydown',detectOnlyRestart);
    var scoreInformation = (" Score: " + score + " Time Elapsed: " + millisecondsToReadableTime(totalTime));
    var returnButton = (<Button id="returnButton">Main Menu</Button>)
    var quickRestartButton = (<Button id="quickRestartButton">Restart</Button>);
    var submitScoreButton = (<Button id='submitScoreButton'>Submit Score</Button>)
    $('#bulletinBoard').html(ReactDOMServer.renderToStaticMarkup(
      <div>
        {returnButton}
        {scoreInformation}
        {quickRestartButton}
        {submitScoreButton}
      </div>
    ));
    $("#returnButton").click(function(){getFrontPage()});
    $("#quickRestartButton").click(function(){startSnakeGame()});
    $("#submitScoreButton").click(function(){submitScore()});
  }

  return (
    <div className="gameScreen" id="gameScreen">
      <h1>Snake</h1>
      {(msg !== "") ?  <div className='confMsg'>{msg}</div>  : ""}
      <Button onClick={startSnakeGame}>Play Snake</Button><br></br>
      <Button onClick={readInstructions}>Read Instructions</Button><br></br>
      <Button onClick={function(){getScoresPage()}}>Scores</Button><br></br>
    </div>
  )
};

export default Snake;
