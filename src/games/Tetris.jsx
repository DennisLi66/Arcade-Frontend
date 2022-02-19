import React from "react";
import Button from 'react-bootstrap/Button'
import ReactDOMServer from 'react-dom/server';
import Cookies from 'universal-cookie';
import Table from 'react-bootstrap/Table'
import loginFunctionality from "../loginFunctionality/loginFunctionality"
import "./css/Tetris.css"
require('dotenv').config();

//FIX THIS: runTime interval - clear it and reinclude it if rushed down
//FIX THIS: Write Instructions
//FIX THIS: Mid secion topple may cause issues, check periodically
function Tetris(){
   //10 wide, 20 high inner board
   //pieceQueue loads 3 or more pieces
  const cookies = new Cookies();
  var gameBoard = [];
  var currentPieceOccupyingSpaces = [];
  var pieceQueue = [];
  var score, startingTime, currentPieceOrientation, endingTime = 0;
  var intervalID = "";
  var currentPiece, storedPiece, recentlyStored = false; //will also tell us if gamestarted
  var maxTimeTilDescent = 1000;
  //Board Manipulation
  function loadPieceQueue(){
    while (pieceQueue.length < 3){
      pieceQueue.push(Math.floor(Math.random() * 7) + 1);
    }
  }
  function getNewPiece(){
    //return a number corresponsing to a piece and update nextPiece
      currentPiece = pieceQueue.shift();
      loadPieceQueue();
  }
  function setBoard(){
    // 22 rows, 12 wide
    if (intervalID !== ""){
      clearInterval(intervalID);
      intervalID = "";
    }
    document.removeEventListener('keydown',detectOnlyRestart);
    gameBoard = [];
    currentPieceOccupyingSpaces = [];
    pieceQueue = [];
    score = 0;
    startingTime = 0;
    currentPieceOrientation = 0;
    endingTime = 0;
    currentPiece = false; //will also tell us if gamestarted
    storedPiece = false;
    recentlyStored = false;
    maxTimeTilDescent = 1000;
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
        return false;
      }
    }
    var newList = [];
    for (let i = 0; i < newLocations.length; i++){
      newList.push(currentPieceOccupyingSpaces[blockToRotateAround] + newLocations[i])
    }
    currentPieceOccupyingSpaces = [...newList];
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
        for (let t = 1; t < 11; t++){
          if (gameBoard[currentRow * 12 + t] === '0' || gameBoard[currentRow * 12 + t] === 'X'){
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
    //check the rows starting upwards from the bottom most currentPiece rows
    //delete rows where necessary and bring board down
    for (let y = 0; y < rowsToTopple.length; y++){
      for (let t = rowsToTopple[y] * 12 + 11; t > 0; t--){
        if (t > 12 && t < 23 && gameBoard[t] !== 'X'){
          gameBoard[t] = '0';
        }else if (t <= 12 && gameBoard[t] !== 'X'){ //Checks Overfill
          for (let u = 0; u < currentPieceOccupyingSpaces.length; u++){
            if (currentPieceOccupyingSpaces[u] - t % 12 === 0){
              currentPieceOccupyingSpaces[u] = currentPieceOccupyingSpaces[u] - 12;
              if (t === currentPieceOccupyingSpaces[u]){
                gameBoard[t] = 'B';
              }
            }
          }
        }else if (gameBoard[t] !== 'X'){
          gameBoard[t] = gameBoard[t - 12];
        }
      }
    }
    var points = [0,10,25,40,60];
    score += points[rowsToTopple.length];
    printAllContent();
    recentlyStored = false;
    detectLoss();
  }
  function storePiece(){
    // set current piece to stored
    if (!storedPiece){
      storedPiece = currentPiece;
      getNewPiece();
      placeNewBlock()
      recentlyStored = true;
      score -= 5;
    }else if (!recentlyStored){
      //if already stored, set next piece to stored and queue for afterStoredPiece
      pieceQueue.unshift(storedPiece);
      storedPiece = false;
    }
    printAllContent();
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
      getNewPiece();
      placeNewBlock();
      printSideDisplay();
    }else{
      for (let i = 0; i < currentPieceOccupyingSpaces.length; i++){
        currentPieceOccupyingSpaces[i] = currentPieceOccupyingSpaces[i] + 12;
      }
    }
    printTetrisBoard();
    if (!endingTime){
      clearInterval(intervalID);
      intervalID = setInterval(updateDescent,maxTimeTilDescent);
    }
  }
  function detectDirectionalKeyDown(key){
    //left: 37, up: 38, right: 39, down: 40
    key = key.keyCode;
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
        loadPieceQueue();
        getNewPiece();
        placeNewBlock();
        printAllContent();
        updateDescent();
      }else{
        updateDescent();
      }
    }
    else if ((key === 82 || key === "82")){ //R
      startGame();
    }
    else if ((key === 32 || key === "32")){ //spacebar
      storePiece();
    }
  }
  function detectOnlyRestart(key){
    key = key.keyCode;
    if (key === 82 || key === "82") startGame();
  }
  //Printing
  function printInitialContent(){
    var reactScript = (
        <>
        <h2>Tetris</h2>
        <div className='tetrisSideBySide'>
        <div className='tetrisBoard' id='tetrisBoard'></div>
        <div className='tetrisSideDisplay' id='tetrisSideDisplay'></div>
        </div>
        <div className='tetrisBulletinBoard' id='tetrisBulletinBoard'></div>
        </>
    );
    document.getElementById("gameScreen").innerHTML = ReactDOMServer.renderToStaticMarkup(reactScript);
    printTetrisBoard();
    printInfoRow();
    printSideDisplay();
  }
  function printAllContent(){
    printTetrisBoard();
    printInfoRow();
    printSideDisplay();
  }
  function printTetrisBoard(message = ""){
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
        <>
          {text}
          {middleText}
          {quickRestartButton}
        </>
      )
    );
    document.getElementById("returnButton").onclick = function(){getFrontPage()};
    if (currentPiece) document.getElementById("quickRestartButton").onclick = function(){startGame()};
  }
  function printSideDisplay(){//prints at beginning, after store, and after topple
    //Need to display storedPiece, and next two upcoming pieces
    var holdPieceGrid = [];
    var holdPieceReactString = (<div></div>);
    var pictures = [
      [],
      [0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0],
      [0,0,0,0,0,1,1,0,0,1,1,0,0,0,0,0],
      [0,0,0,0,0,1,0,0,0,1,0,0,0,1,1,0],
      [0,0,0,0,0,0,1,0,0,1,1,0,0,0,1,0],
      [0,0,0,0,0,0,1,0,0,0,1,0,0,1,1,0],
      [0,0,0,0,0,1,0,0,0,1,1,0,0,0,1,0],
      [0,0,0,0,0,0,1,0,0,1,1,0,0,1,0,0]
    ]
    if (!storedPiece){
      for (let i = 0; i < 16; i++){
        holdPieceGrid.push(<div className='tetrisMiniEmptyBlock' key={i}></div>)
      }
    }else{
      holdPieceGrid = [...pictures[storedPiece]]
      for (let i = 0; i < 16; i++){
        if (holdPieceGrid[i] === 0) holdPieceGrid[i] = (<div className='tetrisMiniEmptyBlock' key={i}></div>);
        else holdPieceGrid[i] = (<div className='tetrisMiniFilledBlock' key={i}></div>);
      }
    }
    holdPieceReactString = (<div className='tetrisSideDisplayPieceHolders' id='heldPiecePicture'>{holdPieceGrid}</div>)
    var nextPieceGrid = [];
    var nextPieceReactString = (<div></div>)
    var afterNextPieceGrid = [];
    var afterNextPieceReactString = (<div></div>)
    if (!currentPiece){
      for (let i = 0; i < 16; i++){
        nextPieceGrid.push(<div className='tetrisMiniEmptyBlock' key={i}></div>)
      }
      nextPieceReactString = (<div className='tetrisSideDisplayPieceHolders' id='nextPiecePicture'>{nextPieceGrid}</div>)
      afterNextPieceReactString = (<div className='tetrisSideDisplayPieceHolders' id='afterPiecePicture'>{nextPieceGrid}</div>)
    }else{
      nextPieceGrid = [...pictures[pieceQueue[0]]];
      afterNextPieceGrid = [...pictures[pieceQueue[1]]];
      for (let i = 0; i < 16; i++){
        if (nextPieceGrid[i] === 0) nextPieceGrid[i] = (<div className='tetrisMiniEmptyBlock' key={i}></div>)
        else nextPieceGrid[i] = (<div className='tetrisMiniFilledBlock' key={i}></div>)
        if (afterNextPieceGrid[i] === 0) afterNextPieceGrid[i] = (<div className='tetrisMiniEmptyBlock' key={i}></div>)
        else afterNextPieceGrid[i] = (<div className='tetrisMiniFilledBlock' key={i}></div>)
      }
      nextPieceReactString = (<div className='tetrisSideDisplayPieceHolders' id='nextPiecePicture'>{nextPieceGrid}</div>)
      afterNextPieceReactString = (<div className='tetrisSideDisplayPieceHolders' id='afterPiecePicture'>{afterNextPieceGrid}</div>)
    }
    document.getElementById("tetrisSideDisplay").innerHTML = ReactDOMServer.renderToStaticMarkup(
      <>
        <h4>Held Piece</h4>
        {holdPieceReactString}
        <h4>Next Pieces</h4>
        <h5>Next</h5>
        {nextPieceReactString}
        <h5>After Next</h5>
        {afterNextPieceReactString}
      </>
    )
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
    if (isLoss) showLossScreen();
  }
  function showLossScreen(){
    endingTime = Date.now() - startingTime;
    //remove event handler
    document.removeEventListener('keydown',detectDirectionalKeyDown);
    document.addEventListener('keydown',detectOnlyRestart);
    //remove runGame
    clearInterval(intervalID);
    //change infoRow
    var returnButtonText = (<Button id='returnButton'>Main Menu</Button>);
    var middleText = " Score: " + score + " Elapsed Time: " + endingTime + " ";
    var restartAndSubmitButton =
    (
      <>
      <Button id='submitScoreButton'>Submit Score</Button>
      <Button id="quickRestartButton">Restart</Button>
      </>
    );
    document.getElementById("tetrisBulletinBoard").innerHTML = ReactDOMServer.renderToStaticMarkup(
      <>
        {returnButtonText}
        {middleText}
        {restartAndSubmitButton}
      </>
    );
    document.getElementById("submitScoreButton").onclick = function(){submitScore()};
    document.getElementById("returnButton").onclick = function(){getFrontPage()} ;
    document.getElementById("quickRestartButton").onclick = function(){startGame()};
  }
  function submitScore(){
    // console.log(cookies.get("id"));
    // console.log(cookies.get("sessionID"));
    if (cookies.get("id")){
      const requestSetup = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({userID:cookies.get("id"),score:score,gameID:2
        ,
        timeInMilliseconds: endingTime,sessionID:cookies.get("sessionID")}) //FIX THIS: IF I ADD DIFFICULTY, CHANGE GAMEIDS
      }
      fetch(process.env.REACT_APP_SERVERLOCATION + '/scoreswithtimes',requestSetup)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          if (data.status === -1){
            printTetrisBoard(data.message);
          }else{
            getScoresPage("Your score has been submitted.")
          }
        })
    }else{
      document.getElementById('gameScreen').innerHTML = ReactDOMServer(
        loginFunctionality({score: score, timeInMilliseconds: endingTime, gameID: 2})
      )
      //ask that the user logs in FIX THIS
      // pass a dictionary to a new object in a new file
    }
  }
  // Initial
  function startGame(){
    setBoard();
    printInitialContent();
    printAllContent();
    document.addEventListener('keydown',detectDirectionalKeyDown);
  }
  //Pages
  function readInstructions(){
    document.getElementById('gameScreen').innerHTML = ReactDOMServer.renderToStaticMarkup(
      <>
        <Button id='backButton'>Back</Button><br></br>
        <h1> Instructions </h1>
        <div>
          In Tetris, your objective is to clear rows of blocks without them reaching the top. You can clear a row of blocks
          by forming a complete row of blocks, but the more rows you clear at a time, the more points you get. Just make sure
          not to reach the top.

          Controls:
          Use the left and right arrow keys to move left and right, respectively.
          Press the A key to rotate your current piece counterclockwise, given space.
          Press the D key or the up arrow key to rotate your current piece clockwise, given space.
          Press the down arrow key to have your current piece descend faster.
          Press the spacebar to store your current piece, if you aren't currently storing one. Note that this action will cause you
          to lose a small amount of points each usage.
          If you are currently storing a piece, pressing the spacebar once again will make it your next piece, pushing the upcoming pieces
          back.
          Press the R button to quickly restart the game if needed.

        </div>
      </>
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
            scoresHelperFunction(message,rule,data.results,start,end,scoreTitle);
          }
        })
    }else{ //use results instead
      scoresHelperFunction(message,rule,results,start,end,scoreTitle);
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
      <>
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
      </>
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
  function getFrontPage(){
    document.getElementById('gameScreen').innerHTML = ReactDOMServer.renderToStaticMarkup(
      <>
        <h1> Tetris </h1>
        <Button id='startGameButton' >Start Game</Button><br></br>
        <Button id='instructionsButton'>Read Instructions</Button><br></br>
        <Button id='scoresButton'>Scores</Button><br></br>
      </>
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
