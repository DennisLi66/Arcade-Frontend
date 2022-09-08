import React from "react";
import Button from 'react-bootstrap/Button'
import ReactDOMServer from 'react-dom/server';
import Cookies from 'universal-cookie';
import Table from 'react-bootstrap/Table'
import cookieSetter from "../helpers/setCookiesForGame.jsx";
import millisecondsToReadableTime from "../helpers/timeConversion.ts";
import $ from 'jquery'

import FrogImageNorth from './froggerImages/frogNorth.png'
import FrogImageSouth from './froggerImages/frogSouth.png'
import FrogImageWest from './froggerImages/frogWest.png'
import FrogImageEast from './froggerImages/frogEast.png'
import TruckWest from './froggerImages/truckWest.png'
import TruckEast from './froggerImages/truckEast.png'
import LilyPad from './froggerImages/lilypad.png'
import TreeTile from './froggerImages/tree.png'
import LogWest from './froggerImages/logWest.png'
import LogEast from './froggerImages/logEast.png'
require('dotenv').config();

//make things move at different intervals?

function Frogger(msg = ""){
  //Variables
  const cookies = new Cookies();
  var score = 0;
  var startTime, totalTime, lastTime, remainingTime = 0;
  var intervalID = "";
  var currentDirection = false;
  var paused = false;
  var tileBoard = [];
  var objectBoard = [];
  var frogBoard = [];
  var frogPosition = [7,19]
  var refreshRate = 1000;

  function getFrogPosition(){
    return 15*frogPosition[1] + frogPosition[0];
  }
  function startFroggerGame(){
    createFroggerBoard();
    printInitialContent();
    $('body').on('keydown',detectDirectionalKeyDown);
  }
  function createFroggerBoard(){ //height 20 width 15
    //Obstacles include water, cars, rocks
    //tiles include road, land, water
    //hero includes frogger
    lastTime = Date.now();
    remainingTime = 0;
    score = 0;
    totalTime = 0;
    refreshRate = 1000;
    startTime = 0;
    clearInterval(intervalID);
    intervalID = "";
    currentDirection = false;
    paused = false;
    tileBoard = [];
    objectBoard = [];
    frogBoard = [];
    frogPosition = [7,19]
    for (let y = 0; y < 20; y++){
      for (let x = 0; x < 15; x++){
        frogBoard.push(0)
        if (y === 0){
          tileBoard.push("L");
          objectBoard.push("R");
        }
        else if (y === 9 || y === 19) {
          tileBoard.push("L")
          objectBoard.push(0);
        }
        else if (y === 1){
          if (x === 2 || x === 5 || x === 7 || x === 9 || x === 12) {
            tileBoard.push("W")
            objectBoard.push("P");
          }
          else {
            tileBoard.push("L");
            objectBoard.push("R");
          }
        }
        else if (y >= 2 && y <= 8) {
          tileBoard.push("W");
          if (y === 7 && (x <= 1 || x === 4 || x >= 13 || x === 10 || (x >= 6 && x <= 8)) ){
            objectBoard.push("L");
          }else if ( y === 8 && (x >= 5 && x <= 9) ){
            objectBoard.push("L");
          }else if ( y === 6 && (x >= 11 || x <= 3 || x === 7) ){
            objectBoard.push("L");
          }else if ( y === 5 && ( x === 1 || x === 2  || x === 12 || x === 13 || x === 5 || x === 9) ){
            objectBoard.push("L");
          }else if (y === 4 && ( x % 2 === 0 || x === 1 || x === 7)){
            objectBoard.push("L");
          }else if (y === 2 && (x % 2 === 1 || x === 2 || x === 8)){
            objectBoard.push("L");
          }else if (y === 3 && (x === 3 || x === 11 || x === 4 || x === 10 || x === 7 || x === 8)){
            objectBoard.push("L");
          }else objectBoard.push(0);
        }
        else if (y >= 10 || y <= 18) {
          tileBoard.push("R");
          if (y === 17 && (( x === 1 || x === 2  || x === 13 || x === 12 ||  x === 7 || x === 4 || x === 10))){
            objectBoard.push("C");
          }else if (y === 18 && ((x === 2) || (x === 6) || (x === 8) ||(x === 12))){
            objectBoard.push("C");
          }else if (y === 16 && (x <= 4 || x >= 10) && (x !== 0 && x !== 14) && (x !== 12 && x !== 2)){
            objectBoard.push("C")
          }else if (y === 15 && (((x <= 3 || x >= 11) && x !== 2 && x !== 12) || ( x === 8 || x === 6))){
            objectBoard.push("C")
          }else if (y === 14 && (x >= 5 && x <= 9)){
            objectBoard.push("C")
          }else if (y === 13 && (x === 2 || x === 1 || x === 13 || x === 12 || x === 7 || x === 9 || x === 5)){
            objectBoard.push("C")
          }else if (y === 12 && (x === 4 || x === 10 || x <= 1 || x >= 13)){
            objectBoard.push("C")
          }else if (y === 11 && ((x >= 2 && x <= 4) || (x <= 12 && x >= 10) || (x === 6 || x === 8))){
            objectBoard.push("C")
          }else if (y === 10 && (x === 2 || x === 3 || x === 12|| x === 11 || x === 7 || x === 9 || x === 5)){
            objectBoard.push("C")
          }else objectBoard.push(0);
        }
      }
    }
    frogBoard[20*15 - 8] = 1;
    intervalID = setInterval(runBoard,1000);
  }
  //Printers
  function printFroggerBoard(){
    var tiles = [];
    var frog = [];
    var objs = [];
    for (let i = 0; i < tileBoard.length; i++){
      if (tileBoard[i] === 'L') tiles.push(<div key={i} className='froggerLandTile'></div>)
      else if (tileBoard[i] === 'W') tiles.push(<div key={i} className='froggerWaterTile'></div>)
      else if (tileBoard[i] === 'R') tiles.push(<div key={i} className='froggerRoadTile'></div>)
      else tiles.push(<div key={i} className='froggerTile'></div>);
      if (frogBoard[i] === 0) frog.push(<div className='froggerTile'></div>);
      else if (currentDirection === "up" || !currentDirection) frog.push(<img className='froggerFrog' alt='Frog' src={FrogImageNorth}></img>);
      else if (currentDirection === "left") frog.push(<img className='froggerFrog' alt='Frog' src={FrogImageWest}></img>);
      else if (currentDirection === "right") frog.push(<img className='froggerFrog' alt='Frog' src={FrogImageEast}></img>);
      else  frog.push(<img className='froggerFrog' alt='Frog' src={FrogImageSouth}></img>);
      if (objectBoard[i] === 'R') objs.push(<img className='froggerRockTile' alt='Tree' src={TreeTile}></img>);
      else if (objectBoard[i] === "P") objs.push(<img className='froggerLilyPad' alt='Lilypad' src={LilyPad}></img>);
      else if (objectBoard[i] === "C" && Math.floor( i / 15) % 2 === 0) objs.push(<img className='froggerCar' alt='Car' src={TruckWest}></img>);
      else if (objectBoard[i] === "C") objs.push(<img className='froggerCar' alt='Car' src={TruckEast}></img>)
      else if (objectBoard[i] === "L" && Math.floor( i / 15) % 2 === 0) objs.push(<img className='froggerLog' alt='Log' src={LogWest}></img>);
      else if (objectBoard[i] === "L") objs.push(<img className='froggerLog' alt='Log' src={LogEast}></img>);
      else objs.push(<div className='froggerTile'></div>);
    }
    $('#froggerTileBoard').html(ReactDOMServer.renderToStaticMarkup(tiles));
    $('#froggerFrogBoard').html(ReactDOMServer.renderToStaticMarkup(frog));
    $('#froggerObjBoard').html(ReactDOMServer.renderToStaticMarkup(objs));
  }
  function printFroggerScoreBoard(ended=false,message = ""){
    var text;
    if (ended === "Loss"){ //Final Score and Time
      text = (<>{message}<Button id='mainMenuButton'>Main Menu</Button> Final Score: {score} Final Time: {millisecondsToReadableTime(totalTime)}<Button id='submitScoreButton'>Submit Score</Button><Button id='restartButton'>Restart</Button></>)
    }else text = (<>{message}<Button id='mainMenuButton'>Main Menu</Button> Current Score: {score} <Button id='restartButton'>Restart</Button></>)
    $("#bulletinBoard").html(ReactDOMServer.renderToStaticMarkup(
      <>
      {text}
      </>
    ));
    $("#mainMenuButton").click(function(){getFroggerMainMenu()});
    $("#restartButton").click(function(){startFroggerGame()})
    if ( ended === "Loss" ) $("#submitScoreButton").click(function(){submitFroggerScore(ended)});
  }
  function printInitialContent(){
    $('#gameScreen').html(ReactDOMServer.renderToStaticMarkup(
      <>
      <div className = 'froggerScreen' id='froggerScreen'>
        <div className='froggerTileBoard' id='froggerTileBoard'></div>
        <div className='froggerObjBoard' id='froggerObjBoard'></div>
        <div className='froggerFrogBoard' id='froggerFrogBoard'></div>
        <div className='froggerPauseScreen' id='froggerPauseScreen'><div className='pauseText'><h1>PAUSED</h1><br></br><h3>Press Space to Unpause</h3></div></div>
      </div>
      <div className='bulletinBoard' id='bulletinBoard'></div>
      </>
    ));
    printFroggerBoard();
    printFroggerScoreBoard();
  }
  //Key Detection
  function detectDirectionalKeyDown(key){
    key.preventDefault();
    if (key.key === "ArrowLeft" ){
      currentDirection = "left";
      moveFrog("left");
    }else if (key.key === "ArrowRight"){
      currentDirection = "right";
      moveFrog("right");
    }else if (key.key === "ArrowDown" ){
      currentDirection = "down";
      moveFrog("down");
    }else if (key.key === "ArrowUp"){
      currentDirection = "up";
      moveFrog("up");
    }
    else if (key.keyCode === 82) startFroggerGame();
    else if (key.keyCode === 32) pauseGame();
    if (detectInWater() || detectRunOver()){
      displayLossScreen();
    }else{
      detectOnLilyPad();
      printFroggerBoard();
    }
  }
  function detectOnlyRestart(key){
    if (key.keyCode === 82) startFroggerGame();
  }
  function detectOnlyPauseOrRestart(key){
    if (key.keyCode === 82) startFroggerGame();
    else if (key.keyCode === 32) pauseGame();
  }
  //Paused Game
  function pauseGame(){
    if (paused){
      lastTime = Date.now();
      startTime = Date.now();
      paused = false;
      $('body').on('keydown',detectDirectionalKeyDown);
      $('body').off('keydown',detectOnlyPauseOrRestart);
      $("#froggerPauseScreen").css('visibility','hidden');
      intervalID = setTimeout(function(){
        runBoard();
        intervalID = setInterval(runBoard,refreshRate)
      },refreshRate - remainingTime)
    }else{
      paused = true;
      remainingTime = Date.now() - lastTime;
      totalTime += Date.now() - startTime;
      clearInterval(intervalID);
      $('#body').off('keydown',detectDirectionalKeyDown);
      $('#body').on('keydown',detectOnlyPauseOrRestart);
      $("#froggerPauseScreen").css('visibility','visible');
    }
  }
  //Board Detections
  function isTileToLandOn(offset){
    if (objectBoard[getFrogPosition() + offset] === 0) return true;
    else if (objectBoard[getFrogPosition() + offset] === 'P') return true;
    else if (objectBoard[getFrogPosition() + offset] === "L") return true;
    return false;
  }
  function detectInWater(){
    if (tileBoard[getFrogPosition()] !== "W") return false;
    else if (objectBoard[getFrogPosition()] === "L"
      || (objectBoard[getFrogPosition()] === "P") ) return false;
      console.log(objectBoard[getFrogPosition()])
    return true;
  }
  function detectRunOver(){
    if (objectBoard[getFrogPosition()] === "C") return true;
    return false;
  }
  function detectOnLilyPad(){
    if (objectBoard[getFrogPosition()] === "P"){
      refreshRate = Math.max(refreshRate - 50, 500);
      objectBoard[getFrogPosition()] = 0;
      frogBoard[getFrogPosition()] = 0;
      frogPosition = [7,19];
      frogBoard[getFrogPosition()] = 1;
      score++;
      detectAllLilyPadsGone();
      clearInterval(intervalID);
      intervalID = setInterval(runBoard,refreshRate)
      printFroggerScoreBoard();
      return true;
    }
    return false;
  }
  function detectAllLilyPadsGone(){
    if (objectBoard[17] !== 0 || objectBoard[20] !== 0 || objectBoard[22] !== 0 || objectBoard[24] !== 0 || objectBoard[27] !== 0){
      return false;
    }
    objectBoard[17] = 'P';
    objectBoard[20] = 'P';
    objectBoard[22] = 'P';
    objectBoard[24] = 'P';
    objectBoard[27] = 'P';
    return true;
  }
  //Runners
  function moveFrog(direction){
    if (direction === "up"){
      if (startTime === 0){startTime = Date.now()}
      if (frogPosition[1] > 0 && isTileToLandOn(-15)){
        frogBoard[getFrogPosition()] = 0;
        frogPosition[1] = frogPosition[1] - 1;
        frogBoard[getFrogPosition()] = 1;
        currentDirection = "up";
      }
      if (intervalID === "") intervalID = setInterval(runBoard,1000);
    }else if (direction === "down"){
      if (startTime === 0){startTime = Date.now()}
      if (frogPosition[1] < 19 && isTileToLandOn(15)){
        frogBoard[getFrogPosition()] = 0;
        frogPosition[1] = frogPosition[1] + 1;
        frogBoard[getFrogPosition()] = 1;
        currentDirection = "down";
      }
      if (intervalID === "") intervalID = setInterval(runBoard,1000);
    }else if (direction === "left"){
      if (startTime === 0){startTime = Date.now()}
      if (frogPosition[0] > 0 && isTileToLandOn(-1)){
        frogBoard[getFrogPosition()] = 0;
        frogPosition[0] = frogPosition[0] - 1;
        frogBoard[getFrogPosition()] = 1;
        currentDirection = "left";
      }
      if (intervalID === "") intervalID = setInterval(runBoard,1000);
    }else if (direction === "right"){
      if (startTime === 0){startTime = Date.now()}
      if (frogPosition[0] < 14 && isTileToLandOn(1)){
        frogBoard[getFrogPosition()] = 0;
        frogPosition[0] = frogPosition[0] + 1;
        frogBoard[getFrogPosition()] = 1;
        currentDirection = "right";
      }
    }
  }
  function runBoard(){
    lastTime = Date.now();
    runCarsLeft();
    runCarsRight();
    runLogsLeft();
    runLogsRight();
    if (detectInWater() || detectRunOver()) displayLossScreen();
    printFroggerBoard();
  }
  function runCarsLeft(){ //
    for (let y = 10; y <= 18; y = y + 2){
      var turnover = false;
      for (let x = 0; x < 15; x++){
        if (x === 0 && objectBoard[y*15 + x] === "C") turnover = true;
        if (x < 14) objectBoard[y*15 + x] = objectBoard[y*15+x+1];
        else if (turnover) objectBoard[y*15 + x] = "C";
        else objectBoard[y*15 + x] = 0;
      }
    }
  }
  function runCarsRight(){
    for (let y = 11; y <= 18; y = y + 2){
      var turnover = false;
      for (let x = 14; x >= 0; x--){
        if (x === 14 && objectBoard[y*15 + x] === "C") turnover = true;
        if (x > 0) objectBoard[y*15 + x] = objectBoard[y*15+x-1];
        else if (turnover) objectBoard[y*15 + x] = "C";
        else objectBoard[y*15 + x] = 0;
      }
    }
  }
  function runLogsLeft(){
    for (let y = 2; y <= 8; y = y + 2){
      var turnover = false;
      for (let x = 0; x < 15; x++){
        if (x === 0 && objectBoard[y*15 + x] === "L") turnover = true;
        if (y === frogPosition[1] && x === frogPosition[0]) moveFrog("left");
        if (x < 14) objectBoard[y*15 + x] = objectBoard[y*15+x+1];
        else if (turnover) objectBoard[y*15 + x] = "L";
        else objectBoard[y*15 + x] = 0;
      }
    }
  }
  function runLogsRight(){
    for (let y = 3; y <= 8; y = y + 2){
      var turnover = false;
      for (let x = 14; x >= 0; x--){
        if (x === 14 && objectBoard[y*15 + x] === "L") turnover = true;
        if (y === frogPosition[1] && x === frogPosition[0]) moveFrog("right");
        if (x > 0) objectBoard[y*15 + x] = objectBoard[y*15+x-1];
        else if (turnover) objectBoard[y*15 + x] = "L";
        else objectBoard[y*15 + x] = 0;
      }
    }
  }
  //EndGame
  function displayLossScreen(){
    clearInterval(intervalID);
    totalTime += Date.now() - startTime;
    $('body').off('keydown',detectDirectionalKeyDown);
    $('body').on('keydown',detectOnlyRestart);
    printFroggerBoard();
    printFroggerScoreBoard("Loss");
  }
  function submitFroggerScore(end){
    if (cookies.get("id")){
      const requestSetup = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({userID:cookies.get("id"),gameID: 5, score: score,
        timeInMilliseconds: totalTime,sessionID:cookies.get("sessionID")}) //FIX THIS: IF I ADD DIFFICULTY, CHANGE GAMEIDS
      }
      fetch(process.env.REACT_APP_SERVERLOCATION + '/scoreswithtimes',requestSetup)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          if (data.status === -1){
            printFroggerScoreBoard(end,data.message);
          }else{
            getFroggerScoresPage("Your score has been submitted.")
          }
        })
    }else cookieSetter({timeInMilliseconds: totalTime, gameID: 5, score: score === 0 ? "0" : score});
  }
  //Pages
  function getFroggerMainMenu(){
    clearInterval(intervalID);
    $('#gameScreen').html(ReactDOMServer.renderToStaticMarkup(
      <>
      <h1>Frogger</h1>
      <Button id='startFroggerButton'>Play Frogger</Button><br></br>
      <Button id='froggerInstructionsButton'>Read Instructions</Button><br></br>
      <Button id='froggerScoresButton'>Scores</Button><br></br>
      </>
    ));
    $('#startFroggerButton').click(function(){startFroggerGame()});
    $('#froggerInstructionsButton').click(function(){readFroggerInstructions()});
    $('#froggerScoresButton').click(function(){getFroggerScoresPage()});
  }
  function readFroggerInstructions(){
    $('#gameScreen').html(ReactDOMServer.renderToStaticMarkup(
      <>
        <Button id='backButton'>Back</Button><br></br>
        <h1> Instructions </h1>
        <div>
          <p>In Frogger, your objective is make it to the lilypads on the other side of the road and river without getting run
          over by a car or falling into the river.</p>
          <p>Use the arrow keys to control your frog.</p>
          <p>Press the spacebar to pause the game.</p>
          <p>Press the R Button to quickly restart the game.</p>
        </div>
      </>
    ));
    $("#backButton").click(function(){getFroggerMainMenu()});
  }
  function getFroggerScoresPage(message = "", rule = "", results = [], start = 0, end = 10){
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
      fetch(process.env.REACT_APP_SERVERLOCATION + fetchString + '&gameID=5')
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
    }else scoresHelperFunction(message,rule,results,start,end,scoreTitle);
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
    if (end < results.length) nextButton = (<Button onClick={getFroggerScoresPage("",rule,results,start + 10, end + 10)}> Next </Button>);
    if (start > 0) prevButton = (<Button onClick={getFroggerScoresPage("",rule,results,Math.min(start - 10), Math.max(end - 10,10))}> Previous </Button>);
    var notif = (<div> </div>);
    if (message && message !== "") {
      if (message === "" || message === "Your score has been submitted.") notif = (<div className="confMsg">{message}</div>)
      else notif = (<div className="errMsg"> {message} </div>)
    }
    var reactString = (
      <>
        <h1> {scoreTitle} </h1>
        <div><Button id='backButton'>Main Menu</Button></div>
        <div> {otherMetricButton} {personalScoresSwitchButton} </div>
        <div> {notif} </div>
        <Table>
        <thead> <tr> <th> # </th> <th> Username </th> <th> Score </th> <th> Time </th> <th> Time Submitted </th> </tr> </thead>
        <tbody>
        {listOfElements}
        </tbody>
        </Table>
        <div>{prevButton}{nextButton}</div>
      </>
    );
    $('#gameScreen').html(ReactDOMServer.renderToStaticMarkup(reactString));
    $('#backButton').click(function(){getFroggerMainMenu()});
    if (rule === "myrecent"){
      $("#personalScoresSwitch").click(function(){getFroggerScoresPage("","recent")});
      $("#otherMetricButton").click(function(){getFroggerScoresPage("","mybest")});
    }else if (rule === "mybest"){
      $("#personalScoresSwitch").click(function(){getFroggerScoresPage("","best")});
      $("#otherMetricButton").click(function(){getFroggerScoresPage("","myrecent")});
    }else if (rule === "recent"){
      if (cookies.get("id")) $("#personalScoresSwitch").click(function(){getFroggerScoresPage("","myrecent")});
      $("#otherMetricButton").click(function(){getFroggerScoresPage("","best")});
    }else if (rule === "best" || rule === ""){
      if (cookies.get("id")) $("#personalScoresSwitch").click(function(){getFroggerScoresPage("","mybest")});
      $("#otherMetricButton").click(function(){getFroggerScoresPage("","recent")});
    }
  }
  return (
    <div className="gameScreen" id="gameScreen">
      <h1>Frogger</h1>
      {(msg !== "") ?  <div className='confMsg'>{msg}</div>  : ""}
      <Button onClick={startFroggerGame}>Play Frogger</Button><br></br>
      <Button onClick={readFroggerInstructions}>Read Instructions</Button><br></br>
      <Button onClick={()=>getFroggerScoresPage()}>Scores</Button><br></br>
    </div>
    )
}

export default Frogger;
