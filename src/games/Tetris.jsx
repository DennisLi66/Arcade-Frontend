import React from "react";
import Button from 'react-bootstrap/Button'
import ReactDOMServer from 'react-dom/server';
import Cookies from 'universal-cookie';
import Table from 'react-bootstrap/Table'
import "./css/Tetris.css"
require('dotenv').config();

//maybe change currentPiece and nextPiece into a list queue
//FIX THIS change gameBoard to tetrisBoard so css doesnt affect snake
//FIx Ending gameScreen
//fix end buttons for print infro screen.

function Tetris(){
  const cookies = new Cookies();
  var gameBoard = []; //10 wide, 20 high inner board
  var score = 0;
  var startingTime = 0;
  var intervalID = "";
  var currentPiece = false; //will also tell us if gamestarted
  var storedPiece = false;
  var pieceQueue = [];
  var afterStoredPiece = false;
  var nextPiece = false;
  var endingTime = 0;
  var timeTilDescent = 0;
  var currentPieceOccupyingSpaces = []; //use negative numbers to indicate off screen
  var currentPieceOrientation = 0;
  var maxTimeTilDescent = 1000;
  //Board Manipulation
  function getNewPiece(){
    //return a number corresponsing to a piece and update nextPiece
    //there are 7 block variations
    // if (afterStoredPiece){
    //   nextPiece = afterStoredPiece;
    //   afterStoredPiece = false;
    // }else{
      nextPiece = Math.floor(Math.random() * 8);
    // }
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
  //Block Setting
  function placeNewBlock(){
    //update currentPieceOccupyingSpaces
    //organize by top to bottom, left to right
    if (currentPiece === 1){ // Line Blocks
      currentPieceOccupyingSpaces = [...[-32,-20,-8,4]];
    }else if (currentPiece === 2){ //Square Blocks
      currentPieceOccupyingSpaces = [...[-8,-7,4,5]];
    }else if (currentPiece === 3){ //L Block
      currentPieceOccupyingSpaces = [...[-20,-8,4,5]];
    }else if (currentPiece === 4){ //T Block
      currentPieceOccupyingSpaces = [...[-20,-9,-8,4]];
    }else if (currentPiece === 5){ // J Block
      currentPieceOccupyingSpaces = [...[-19,-7,4,5]];
    }else if (currentPiece === 6){ // s block
      currentPieceOccupyingSpaces = [...[-20,-8,-7,5]];
    }else if (currentPiece === 7){ // z block
      currentPieceOccupyingSpaces = [...[-19,-8,-7,4]];
    }
    currentPieceOrientation = 0;
  }
  function rotatePiece(rotation){
    //make sure piece isn't blocked
    //otherwise rotate
    if (rotation === "clockwise"){
      if (currentPiece === 1){
        if (currentPieceOrientation === 0) currentPieceOrientation = rotationHelperFunction(1,[-1,0,1,2]) ? 90: 0;
        else if (currentPieceOrientation === 90) currentPieceOrientation = rotationHelperFunction(2,[-12,0,12,24]) ? 180: 90;
        else if (currentPieceOrientation === 180) currentPieceOrientation = rotationHelperFunction(2,[-2,-1,0,1]) ? 270: 180;
        else if (currentPieceOrientation === 270) currentPieceOrientation = rotationHelperFunction(1,[-24,-12,0,12]) ? 0: 270;
      }else if (currentPiece === 2) { //squares don't rotate
      }else if (currentPiece === 3){ // L block rotate along center block
        if (currentPieceOrientation === 0) currentPieceOrientation = rotationHelperFunction(1,[-1,0,1,11]) ? 90 : 0;
        else if (currentPieceOrientation === 90) currentPieceOrientation = rotationHelperFunction(1,[-13,-12,0,12]) ? 180 : 90;
        else if (currentPieceOrientation === 180) currentPieceOrientation = rotationHelperFunction(2,[-11,-1,0,1]) ? 270 : 180;
        else if (currentPieceOrientation === 270) currentPieceOrientation = rotationHelperFunction(2,[-12,0,12,13]) ? 0 : 270;
      }else if (currentPiece === 4){ // T Block
        if (currentPieceOrientation === 0) currentPieceOrientation = rotationHelperFunction(2,[-12,-1,0,1]) ? 90 : 0;
        else if (currentPieceOrientation === 90) currentPieceOrientation = rotationHelperFunction(2,[-12,0,1,12]) ? 180 : 90;
        else if (currentPieceOrientation === 180)currentPieceOrientation = rotationHelperFunction(1,[-1,0,1,12]) ? 270 : 180;
        else if (currentPieceOrientation === 270)currentPieceOrientation = rotationHelperFunction(1,[-12,-1,0,12]) ? 0 : 270;
      }else if (currentPiece === 5){ // J block
        if (currentPieceOrientation === 0) currentPieceOrientation = rotationHelperFunction(1,[-13,-1,0,1]) ? 90 : 0;
        else if (currentPieceOrientation === 90) currentPieceOrientation = rotationHelperFunction(2,[-12,-11,0,12]) ? 180 : 90;
        else if (currentPieceOrientation === 180) currentPieceOrientation = rotationHelperFunction(2,[-1,0,1,13]) ? 270 : 180;
        else if (currentPieceOrientation === 270) currentPieceOrientation = rotationHelperFunction(1,[-12,0,11,12]) ? 0 : 270;
      }else if (currentPiece === 6){ //S BLOCK
        if (currentPieceOrientation === 0) currentPieceOrientation = rotationHelperFunction(1,[0,1,11,12]) ? 90 : 0;
        else if (currentPieceOrientation === 90) currentPieceOrientation = rotationHelperFunction(0,[-12,0,1,13]) ? 180 : 90;
        else if (currentPieceOrientation === 180)currentPieceOrientation = rotationHelperFunction(1,[0,1,11,12]) ? 270 : 180;
        else if (currentPieceOrientation === 270)currentPieceOrientation = rotationHelperFunction(0,[-12,0,1,13]) ? 0 : 270;
      }else if (currentPiece === 7){ // Z BLOCK
        if (currentPieceOrientation === 0) currentPieceOrientation = rotationHelperFunction(1,[-1,0,12,13]) ? 90 : 0;
        else if (currentPieceOrientation === 90) currentPieceOrientation = rotationHelperFunction(1,[-11,0,1,12]) ? 180 : 90;
        else if (currentPieceOrientation === 180) currentPieceOrientation = rotationHelperFunction(1,[-1,0,12,13]) ? 270 : 180;
        else if (currentPieceOrientation === 270) currentPieceOrientation = rotationHelperFunction(1,[-11,0,1,12]) ? 180 : 90;
      }
    }else if (rotation === "counterclockwise"){
      if (currentPiece === 1){
        if (currentPieceOrientation === 0) currentPieceOrientation = rotationHelperFunction(2,[-1,0,1,2]) ? 270 : 0;
        else if (currentPieceOrientation === 90) currentPieceOrientation = rotationHelperFunction(1,[-12,0,12,24]) ? 0 : 90;
        else if (currentPieceOrientation === 180) currentPieceOrientation = rotationHelperFunction(1,[-2,-1,0,1]) ? 90 : 180;
        else if (currentPieceOrientation === 270) currentPieceOrientation = rotationHelperFunction(2,[-24,-12,0,12]) ? 180 : 270;
      }else if (currentPiece === 2) { //squares don't rotate
      }else if (currentPiece === 3){ // L block
        if (currentPieceOrientation === 0) currentPieceOrientation = rotationHelperFunction(1,[-11,-1,0,1]) ? 270 : 0;
        else if (currentPieceOrientation === 90) currentPieceOrientation = rotationHelperFunction(1,[-12,0,12,13]) ? 0 : 90;
        else if (currentPieceOrientation === 180) currentPieceOrientation = rotationHelperFunction(2,[-1,0,1,11]) ? 90 : 180;
        else if (currentPieceOrientation === 270) currentPieceOrientation = rotationHelperFunction(2,[-13,-12,0,12]) ? 270 : 0;
      }else if (currentPiece === 4){ //T block
        if (currentPieceOrientation === 0) currentPieceOrientation = rotationHelperFunction(2,[-1,0,1,12]) ? 270 : 0;
        else if (currentPieceOrientation === 90) currentPieceOrientation = rotationHelperFunction(2,[-12,-1,0,12]) ? 0 : 90;
        else if (currentPieceOrientation === 180) currentPieceOrientation = rotationHelperFunction(1,[-12,-1,0,1]) ? 90 : 180;
        else if (currentPieceOrientation === 270) currentPieceOrientation = rotationHelperFunction(1,[-12,0,1,12]) ? 180 : 270;
      }else if (currentPiece === 5){ // J block
        if (currentPieceOrientation === 0) currentPieceOrientation = rotationHelperFunction(1,[-1,0,1,13]) ? 270 : 0;
        else if (currentPieceOrientation === 90) currentPieceOrientation = rotationHelperFunction(2,[-12,0,11,12]) ? 0 : 90;
        else if (currentPieceOrientation === 180) currentPieceOrientation = rotationHelperFunction(2,[-13,-1,0,1]) ? 90 : 180;
        else if (currentPieceOrientation === 270) currentPieceOrientation = rotationHelperFunction(1,[-12,-11,0,12]) ? 180 : 270;
      }else if (currentPiece === 6){ //S Block
        if (currentPieceOrientation === 0) currentPieceOrientation = rotationHelperFunction(1,[0,1,11,12]) ? 270 : 0;
        else if (currentPieceOrientation === 90) currentPieceOrientation = rotationHelperFunction(0,[0,1,11,12]) ? 0 : 90;
        else if (currentPieceOrientation === 180) currentPieceOrientation = rotationHelperFunction(1,[0,1,11,12]) ? 90 : 180;
        else if (currentPieceOrientation === 270) currentPieceOrientation = rotationHelperFunction(0,[0,1,11,12]) ? 180 : 270;
      }else if (currentPiece === 7){ // Z BLOCK
        if (currentPieceOrientation === 0) currentPieceOrientation = rotationHelperFunction(1,[-1,0,12,13]) ? 270 : 0;
        else if (currentPieceOrientation === 90) currentPieceOrientation = rotationHelperFunction(1,[-11,0,1,12]) ? 0 : 90;
        else if (currentPieceOrientation === 180) currentPieceOrientation = rotationHelperFunction(1,[-1,0,12,13]) ? 90 : 180;
        else if (currentPieceOrientation === 270) currentPieceOrientation = rotationHelperFunction(1,[-11,0,1,12]) ? 180 : 270;
      }
    }
  }
  function rotationHelperFunction(blockToRotateAround,newLocations){
    for (let i = 0; i < newLocations.length; i++){
      if (currentPieceOccupyingSpaces[blockToRotateAround] + newLocations[i] < 12 ||
      gameBoard[currentPieceOccupyingSpaces[blockToRotateAround] + newLocations[i]] === '0'){
      }else{
        console.log(gameBoard[currentPieceOccupyingSpaces[blockToRotateAround] + newLocations[i]])
        return false;
      }
    }
    var newList = [];
    for (let i = 0; i < newLocations.length; i++){
      newList.push(currentPieceOccupyingSpaces[blockToRotateAround] + newLocations[i])
    }
    //console.log(currentPieceOccupyingSpaces);
    currentPieceOccupyingSpaces = [...newList];
    //console.log(currentPieceOccupyingSpaces);
    return true;
  }
  function movePiece(direction){
    //if unobstructed, shift blocks to the corresponding direction
    if (direction === "left"){
      for (let i = 0; i < currentPieceOccupyingSpaces.length; i++){
        if (currentPieceOccupyingSpaces[i] < 12 || gameBoard[currentPieceOccupyingSpaces[i] - 1] === '0'){
        }else{
          return;
        }
      }
      for (let i = 0; i < currentPieceOccupyingSpaces.length; i++){
        currentPieceOccupyingSpaces[i] = currentPieceOccupyingSpaces[i] - 1;
      }
    }else if (direction === "right"){
      for (let i = 0; i < currentPieceOccupyingSpaces.length; i++){
        if (currentPieceOccupyingSpaces[i] < 12 || gameBoard[currentPieceOccupyingSpaces[i] + 1] === '0'){
        }else{
          return;
        }
      }
      for (let i = 0; i < currentPieceOccupyingSpaces.length; i++){
        currentPieceOccupyingSpaces[i] = currentPieceOccupyingSpaces[i] + 1;
      }
    }
  }
  //
  function toppleBlocks(){
    score += 4; //give points for each block;
    var rowsToTopple = [];
    var lastRow = -1;
    for (let i = 0; i < 4; i++){
      var currentRow = Math.floor(currentPieceOccupyingSpaces[i] / 12);
      if (currentRow !== lastRow){
        var allBlocked = true;
        for (let t = 0; t < 12; t++){
          if (gameBoard[currentRow * 12 + t] === '0'){
            allBlocked = false;
            break;
          }
        }
        if (allBlocked){
          rowsToTopple.push(currentRow);
        }
        lastRow = currentRow;
      }
    }
    //console.log(rowsToTopple);
    //check the rows starting upwards from the bottom most currentPiece rows
    //delete rows where necessary and bring board down
    for (let y = 0; y < rowsToTopple.length; y++){
      for (let t = rowsToTopple[y] * 12 + 11; t > 0; t--){
        //console.log(t);
        if (t > 12 && t < 23 && gameBoard[t] !== 'X'){
          gameBoard[t] = '0';
        }else if (t <= 12 && gameBoard[t] !== 'X'
          //FIX THIS: way to check over fill
        ){
          for (let u = 0; u < currentPieceOccupyingSpaces.length; u++){
            if (currentPieceOccupyingSpaces[u] - t % 12 === 0){
              currentPieceOccupyingSpaces[u] = currentPieceOccupyingSpaces[u] - 12;
              if (t === currentPieceOccupyingSpaces[u]){
                gameBoard[t] = 'B';
              }
            }
          }
        }else{
          gameBoard[t] = gameBoard[t - 12];
        }
      }
    }
    var points = [0,10,25,40,60];
    score += points[rowsToTopple.length];
    printInfoRow();
    detectLoss()
  }
  function storePiece(){
    // set next piece to stored
    //if already stored, set next piece to stored and queue for afterStoredPiece
  }
  function updateDescent(){
    //check that each square is not touching a floor
    var hasReachedFloor = false;
    for (let i = 0; i < currentPieceOccupyingSpaces.length; i++){
      if (
        currentPieceOccupyingSpaces[i] > 0 &&
        (gameBoard[currentPieceOccupyingSpaces[i] + 12] !== '0')
      ){
        hasReachedFloor = true;
        break;
      }
    }
    if (hasReachedFloor){
      //change the blocks where they are located to fixed
      for (let i = 0; i < currentPieceOccupyingSpaces.length; i++){
        gameBoard[currentPieceOccupyingSpaces[i]] = 'B';
      }
      //clear and topple blocks as necessary
      toppleBlocks();
      //change current and next piece
      currentPiece = nextPiece;
      placeNewBlock()
      getNewPiece();
    }else{
      for (let i = 0; i < currentPieceOccupyingSpaces.length; i++){
        currentPieceOccupyingSpaces[i] = currentPieceOccupyingSpaces[i] + 12;
      }
    }
    timeTilDescent = maxTimeTilDescent;
    printTetrisBoard();
  }
  function detectDirectionalKeyDown(key){
    //left: 37, up: 38, right: 39, down: 40
    //FIX THIS USE DIFFERENT KEYS (a and d) FOR ROTATION
    key = key.keyCode;
    // console.log(key);
    if ((key === 65) || key === '65'){ //a key //rotate counter counterclockwise
      rotatePiece("counterclockwise");
      printTetrisBoard();
    }else if (key === 68 || key === '68'){ //d key // rotate clockwise
      rotatePiece('clockwise');
      printTetrisBoard();
    }
    else if ((key === 37 || key === '37')){//move left
      movePiece("left");
      printTetrisBoard();
    }
    else if ((key === 38 || key === "38")){ //move clockwise, up key
      rotatePiece('clockwise');
      printTetrisBoard();
    }else if ((key === 39 || key === "39")){ //move right
      movePiece("right");
      printTetrisBoard();
    }else if ((key === 40 || key === "40")){ //immediately descent
      if (!currentPiece){
        startingTime = Date.now();
        currentPiece = Math.floor(Math.random() * 7);
        getNewPiece();
        timeTilDescent = maxTimeTilDescent;
        placeNewBlock();
        printTetrisBoard();
      }else{
        updateDescent();
      }
    }
    else if ((key === 82 || key === "82")){ //R
      startGame();
    }
    else if ((key === 32 || key === "32")){
      storePiece();
    }
  }
  //Printing
  function printInitialContent(){
    var toPrint = "<h1>Tetris</h1><div class='tetrisBoard' id='tetrisBoard'>";
    toPrint += "</div>";
    toPrint += "<div class='tetrisBulletinBoard' id='tetrisBulletinBoard'></div>";
    document.getElementById("gameScreen").innerHTML = toPrint;
    printTetrisBoard();
    printInfoRow();
  }
  function printTetrisBoard(message = ""){
    // console.log(gameBoard);
    //console.log(currentPieceOccupyingSpaces);
    var toPrint = "";
    var counter = 0;
    if (message !== ""){
      toPrint += "<div class='errMsg'>" + message + "</div>"
    }
    for (let i = 0; i < gameBoard.length; i++){
      if (currentPieceOccupyingSpaces.length !== 0 && currentPieceOccupyingSpaces[counter] === i){
        counter++;
        toPrint += "<div class='tetrisActiveSquare'></div>"
      }else if (gameBoard[i] === 'X'){
        toPrint += "<div class='tetrisBorderSquare'></div>"
      }else if (gameBoard[i] === '0'){
        toPrint += "<div class='tetrisEmptySquare'></div>"
      }else if (gameBoard[i] === 'B'){
        toPrint += "<div class='tetrisBlockSquare'></div>"
      }
    }
  document.getElementById("tetrisBoard").innerHTML = toPrint;
  }
  function printInfoRow(){
    var text = (<Button id='returnButton'>Main Menu</Button>);
    var middleText;
    var quickRestartButton;
    if (currentPiece){
      middleText = (" Score: " + score + " ");
      quickRestartButton = (<Button id="quickRestartButton">Restart</Button>)
    }else{
      middleText = (" Press on the down arrow key to start. ")
    }
    document.getElementById("tetrisBulletinBoard").innerHTML = ReactDOMServer.renderToStaticMarkup(
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
  //Losing
  function detectLoss(){
    //if board is overfilled, cause loss
    var isLoss = false;
    for (let g = 0; g < 12; g++){
      if (gameBoard[g] === '0'){
        gameBoard[g] = 'X';
      }else if (gameBoard[g] === 'B'){
        isLoss = true;
      }else{
        gameBoard[g] = 'X';
      }
    }
    if (isLoss){
      console.log(gameBoard);
      showLossScreen();
    }
  }
  function showLossScreen(){
    endingTime = Date.now() - startingTime;
    //remove event handler
    document.removeEventListener('keydown',detectDirectionalKeyDown);
    //remove runGame
    //clearInterval(intervalID); //FIX THIS: ADD IN AFTER ADDING INTERVAL
    //change infoRow
    var returnButtonText = (<Button id='returnButton'>Main Menu</Button>);
    var middleText = (" Score: " + score + " Elapsed Time: " + endingTime + " ");
    var quickRestartButton = (<Button id="quickRestartButton">Restart</Button>);
    document.getElementById("tetrisBulletinBoard").innerHTML = ReactDOMServer.renderToStaticMarkup(
      <div>
        {returnButtonText}
        {middleText}
        {quickRestartButton}
      </div>
    );
    document.getElementById("returnButton").onclick = function(){getFrontPage()} ;
    document.getElementById("quickRestartButton").onclick = function(){startGame()};
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
        <Button id='backButton'>Back</Button><br></br>
        <h1> Instructions </h1>
      </div>
    )
    document.getElementById("backButton").onclick = function(){getFrontPage()};
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
      fetch(process.env.REACT_APP_SERVERLOCATION + fetchString + '&gameID=2')
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
      document.getElementById('backButton').onclick = function(){getFrontPage()};
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
      document.getElementById("startGameButton").onclick = function(){startGame()};
      document.getElementById("instructionsButton").onclick = function(){readInstructions()};
      document.getElementById("scoresButton").onclick = function(){getScoresPage()};
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
