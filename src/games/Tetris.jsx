import React from "react";
import Button from 'react-bootstrap/Button'
import ReactDOMServer from 'react-dom/server';
import Cookies from 'universal-cookie';
import Table from 'react-bootstrap/Table'
require('dotenv').config();

function Tetris(){
  const cookies = new Cookies();
  var gameBoard = []; //10 wide, 20 high inner board
  var score = 0;
  var startingTime = 0;
  var intervalID = "";
  var currentPiece = false; //will also tell us if gamestarted
  var storedPiece = false;
  var nextPiece = false;
  var endingTime = 0;
  var timeTilDescent = 0;
  var currentPieceOccupyingSpaces = []; //use negative numbers to indicate off screen
  var maxTimeTilDescent = 1000;
  //Board Manipulation
  function getNewPiece(){
    //return a number corresponsing to a piece and update nextPiece
    //there are 7 block variations
    nextPiece = Math.floor(Math.random() * 7);
  }
  function setBoard(){
    // 22 rows, 12 wide
    if (intervalID !== ""){
      clearInterval(intervalID);
    }
    startingTime = 0;
    intervalID = "";
    currentPiece = false; //will also tell us if gamestarted
    storedPiece = false;
    endingTime = 0;
    timeTilDescent = 0;
    gameBoard = [];
    score = 0;
    var borderRow = [];
    for (let i = 0; i < 12 ; i++){
      borderRow.push('X')
    }
    gameBoard.push(...borderRow);
    var row = [];
    row.push('X');
    for (let i = 0; i < 10; i++){
      row.push("0");
    }
    row.push('X');
    for (let i = 0; i < 20; i++){
      gameBoard.push(...row);
    }
    gameBoard.push(...borderRow);
  }
  function placeNewBlock(){
    //update currentPieceOccupyingSpaces
    if (currentPiece === 1){ // Line Blocks
      currentPieceOccupyingSpaces = [...[4,-8,-20,-28]]
    }else if (currentPiece === 2){ //Square Blocks
      currentPieceOccupyingSpaces = [...[4,5,-8,-7]]
    }else if (currentPiece === 3){ //L Block
      currentPieceOccupyingSpaces = [...[4,5,-8,-20]]
    }else if (currentPiece === 4){ //T Block
      currentPieceOccupyingSpaces = [...[4,-8,-7,-20]]
    }else if (currentPiece === 5){ // J Block
      currentPieceOccupyingSpaces = [...[4,5,-7,-19]]
    }else if (currentPiece === 6){ // s block
      currentPieceOccupyingSpaces = [...[5,-7,-8,-20]]
    }else if (currentPiece === 0){ // z block
      currentPieceOccupyingSpaces = [...[4,-8,-7,-19]]
    }
  }
  function rotatePiece(){
    //make sure piece isn't blocked
    //otherwise rotate
  }
  function updateDescent(){
    //if hit the bottom get a new piece, place new piece
    //else descend
    //either way reset timeTilDescent and printBoard
  }
  function detectDirectionalKeyDown(key){
    //left: 37, up: 38, right: 39, down: 40
    //FIX THIS USE DIFFERENT KEYS (a and d) FOR ROTATION
    key = key.keyCode;
    // console.log(key);
    if ((key === 37 || key === '37')){
      printTetrisBoard();
    }else if ((key === 38 || key === "38")){ //move left
      printTetrisBoard();
    }else if ((key === 39 || key === "39")){ //move right
      printTetrisBoard();
    }else if ((key === 40 || key === "40")){ //immediately descent
      if (!currentPiece){
        currentPiece = Math.floor(Math.random() * 7);
        nextPiece = Math.floor(Math.random() * 7);
        timeTilDescent = maxTimeTilDescent;
        placeNewBlock();
        printTetrisBoard();
      }
    }
    else if ((key === 82 || key === "82")){ //R
      startGame();
    }
  }
  //Printing
  function printInitialContent(){
    var toPrint = "<h1>Tetris</h1><div class='gameBoard' id='gameBoard'>";
    toPrint += "</div>";
    toPrint += "<div class='bulletinBoard' id='bulletinBoard'></div>";
    document.getElementById("gameScreen").innerHTML = toPrint;
    printTetrisBoard();
    printInfoRow();
  }
  function printTetrisBoard(message = ""){
    var toPrint = "";
    if (message !== ""){
      toPrint += "<div class='errMsg'>" + message + "</div>"
    }
    for (let i = 0; i < gameBoard.length; i++){
      if (gameBoard[i] === 'X'){
        toPrint += "<div id='borderSquare'></div>"
      }else if (gameBoard[i] === 0){
        toPrint += "<div id='emptySquare'></div>"
      }
    }
  document.getElementById("gameBoard").innerHTML = toPrint;
  }
  function printInfoRow(){
    var text = (<Button id='returnButton'>Main Menu</Button>);
    var middleText;
    var quickRestartButton;
    if (currentPiece){
      middleText = (" Score: " + score + " ");
      quickRestartButton = (<Button id="quickRestartButton">Restart</Button>)
    }else{
      middleText = ("Press on the down arrow key to start.")
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
    if (currentPiece) document.getElementById("quickRestartButton").onclick = function(){startGame()};
  }
  // Initial
  function startGame(){
    setBoard();
    printInitialContent();
    document.addEventListener('keydown',detectDirectionalKeyDown);
  }
  //Pages
  function readInstructions(){
    document.getElementById('gameScreen').innerHTML = ReactDOMServer.renderToStaticMarkup(
      <div>
        <Button id='backButton'> Back </Button><br></br>
        <h1> Instructions </h1>
      </div>
    )
    document.getElementById("backButton").onclick = getFrontPage();
  }
  function getScoresPage(message = "", rule = "", results = [], start = 0, end = 10){
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
            var listOfElements = [];
            for (let i = start; i < Math.min(data.results.length,end); i++){
              listOfElements.push(<tr key = {i}><td>{i + 1}</td> <td> {data.results[i][0]} </td> <td> {data.results[i][1]} </td> <td> {data.results[i][2]}</td> <td> {data.results[i][3]}</td> </tr>)
            }
            var otherMetricButton;
            var personalScoresSwitchButton;
            if (rule === "myrecent"){
              otherMetricButton = (<Button onClick={getScoresPage("","mybest")}> My Best Scores </Button>)
              personalScoresSwitchButton = (<Button onClick={getScoresPage("","recent")}> All Recent Scores </Button>)
            }else if (rule === "mybest"){
              otherMetricButton = (<Button onClick={getScoresPage("","myrecent")}> My Recent Scores </Button>)
              personalScoresSwitchButton = (<Button onClick={getScoresPage("","best")}> All Best Scores </Button>)
            }else if (rule === "recent"){
              if (cookies.get("id")){
                personalScoresSwitchButton = (<Button onClick={getScoresPage("","myrecent")}> My Recent Scores </Button>)
              }
              otherMetricButton =  (<Button onClick={getScoresPage("","best")}> All Best Scores </Button>)
            }else if (rule === "best"){
              if (cookies.get("id")){
                personalScoresSwitchButton = (<Button onClick={getScoresPage("","mybest")}> My Best Scores </Button>)
              }
              otherMetricButton =  (<Button onClick={getScoresPage("","recent")}> All Recent Scores </Button>)
            }
            var nextButton, prevButton;
            if (end < data.results.length){
              nextButton = (<Button onClick={getScoresPage("",rule,data.results,start + 10, end + 10)}> Next </Button>)
            }
            if (start > 0){
              prevButton = (<Button onClick={getScoresPage("",rule,data.results,Math.min(start - 10), Math.max(end - 10,10))}> Previous </Button>)
            }
            var reactString = (
              <div>
                <h1> {scoreTitle} </h1>
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
          }
        })
    }else{ //use results instead
      var listOfElements = [];
      for (let i = start; i < Math.min(results.length,end); i++){
        listOfElements.push(<tr key = {i}><td>{i + 1}</td> <td> {results[i][0]} </td> <td> {results[i][1]} </td> <td> {results[i][2]}</td> <td> {results[i][3]}</td> </tr>)
      }
      var otherMetricButton;
      var personalScoresSwitchButton;
      if (rule === "myrecent"){
        otherMetricButton = (<Button onClick={getScoresPage("","mybest")}> My Best Scores </Button>)
        personalScoresSwitchButton = (<Button onClick={getScoresPage("","recent")}> All Recent Scores </Button>)
      }else if (rule === "mybest"){
        otherMetricButton = (<Button onClick={getScoresPage("","myrecent")}> My Recent Scores </Button>)
        personalScoresSwitchButton = (<Button onClick={getScoresPage("","best")}> All Best Scores </Button>)
      }else if (rule === "recent"){
        if (cookies.get("id")){
          personalScoresSwitchButton = (<Button onClick={getScoresPage("","myrecent")}> My Recent Scores </Button>)
        }
        otherMetricButton =  (<Button onClick={getScoresPage("","best")}> All Best Scores </Button>)
      }else if (rule === "best" || rule===""){
        if (cookies.get("id")){
          personalScoresSwitchButton = (<Button onClick={getScoresPage("","mybest")}> My Best Scores </Button>)
        }
        otherMetricButton =  (<Button onClick={getScoresPage("","recent")}> All Recent Scores </Button>)
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
          <div><Button id='backButton'>Back Button</Button></div>
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
      document.getElementById('backButton').onclick = getFrontPage();
    }
  }
  function getFrontPage(){
    document.getElementById('gameScreen').innerHTML = ReactDOMServer.renderToStaticMarkup(
      <div className='gameScreen' id='gameScreen'>
        <h1> Tetris </h1>
        <Button id='startGameButton' >Start Game</Button><br></br>
        <Button id='instructionsButton'>Read Instructions</Button><br></br>
        <Button id='scoresButton'>Scores</Button><br></br>
      </div>
    );
      document.getElementById("startGameButton").onclick = startGame();
      document.getElementById("instructionsButton").onclick = readInstructions();
      document.getElementById("scoresButton").onclick = getScoresPage();
  }

  return (
    <div className='gameScreen' id='gameScreen'>
      <h1> Tetris </h1>
      <Button onClick={()=>{startGame()}}>Start Game</Button><br></br>
      <Button onClick={()=>{readInstructions()}}>Read Instructions</Button><br></br>
      <Button onClick={()=>{getScoresPage()}}>Scores</Button><br></br>
    </div>
  )
}

export default Tetris;
