import React from "react";
import Button from 'react-bootstrap/Button'
import ReactDOMServer from 'react-dom/server';
import Cookies from 'universal-cookie';
import Table from 'react-bootstrap/Table'
import loginFunctionality from "../loginFunctionality/loginFunctionality"
require('dotenv').config();

function Frogger(){
  //Variables
  const cookies = new Cookies();
  var score = 0;
  var startTime, endingTime = 0;
  var intervalID = "";
  var currentDirection = false;
  var paused = false;
  var tileBoard = [];
  var objectBoard = [];
  var frogBoard = [];
  var frogPosition = [7,19]

  function startFroggerGame(){
    createFroggerBoard();
    printInitialContent();
    document.addEventListener('keydown',detectDirectionalKeyDown);
  }
  function createFroggerBoard(){ //height 20 width 15
    //Obstacles include water, cars, rocks
    //tiles include road, land, water
    //hero includes frogger
    score = 0;
    startTime = 0;
    endingTime = 0;
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
            objectBoard.push(0);
          }
          else {
            tileBoard.push("L");
            objectBoard.push("R");
          }
        }
        else if (y >= 2 && y <= 8) {
          tileBoard.push("W");
          objectBoard.push(0);
        }
        else if (y >= 10 || y <= 18) {
          tileBoard.push("R");
          objectBoard.push(0);
        }
      }
    }
    frogBoard[20*15 - 8] = 1;
  }
  //Printers
  function printFroggerBoard(){
    var tiles = [];
    var frog = [];
    var objs = [];
    for (let i = 0; i < tileBoard.length; i++){
      if (tileBoard[i] === 'L'){
        tiles.push(<div key={i} className='froggerLandTile'></div>)
      }else if (tileBoard[i] === 'W'){
        tiles.push(<div key={i} className='froggerWaterTile'></div>)
      }else if (tileBoard[i] === 'R'){
        tiles.push(<div key={i} className='froggerRoadTile'></div>)
      }else{
        tiles.push(<div key={i} className='froggerTile'></div>);
      }
      if (frogBoard[i] === 0){
        frog.push(<div className='froggerTile'></div>)
      }else{
        frog.push(<div className='froggerFrog'></div>)
      }
      if (objectBoard[i] === 'R'){
        objs.push(<div className='froggerRockTile'></div>)
      }else{
        objs.push(<div className='froggerTile'></div>)
      }
    }
    document.getElementById('froggerTileBoard').innerHTML = ReactDOMServer.renderToStaticMarkup(tiles);
    document.getElementById('froggerFrogBoard').innerHTML = ReactDOMServer.renderToStaticMarkup(frog);
    document.getElementById('froggerObjBoard').innerHTML = ReactDOMServer.renderToStaticMarkup(objs)
  }
  function printFroggerScoreBoard(ended=false,message = ""){
    var text;
    if (ended === "Loss"){ //Final Score and Time
      text = (<>{message}<Button id='mainMenuButton'>Main Menu</Button> Final Score: {score} Final Time: {endingTime}<Button id='submitScoreButton'>Submit Score</Button><Button id='restartButton'>Restart</Button></>)
    }else{
      text = (<>{message}<Button id='mainMenuButton'>Main Menu</Button> Current Score: {score} <Button id='restartButton'>Restart</Button></>)
    }
    document.getElementById("bulletinBoard").innerHTML = ReactDOMServer.renderToStaticMarkup(
      <>
      {text}
      </>
    )
    document.getElementById("mainMenuButton").onclick = function(){getFroggerMainMenu()}
    document.getElementById("restartButton").onclick = function(){startFroggerGame()}
    if ( ended === "Loss" ) document.getElementById("submitScoreButton").onclick = function(){submitFroggerScore(ended)}
  }
  function printInitialContent(){
    document.getElementById('gameScreen').innerHTML = ReactDOMServer.renderToStaticMarkup(
      <>
      <div className = 'froggerScreen' id='froggerScreen'>
        <div className='froggerTileBoard' id='froggerTileBoard'></div>
        <div className='froggerFrogBoard' id='froggerFrogBoard'></div>
        <div className='froggerObjBoard' id='froggerObjBoard'></div>
        <div className='froggerPauseScreen' id='froggerPauseScreen'><h1>PAUSED</h1><br></br><h3>Press Space to Unpause</h3></div>
      </div>
      <div className='bulletinBoard' id='bulletinBoard'></div>
      </>
    )
    printFroggerBoard();
    printFroggerScoreBoard();
    document.addEventListener('keydown',detectDirectionalKeyDown)
  }
  //Key Detection
  function detectDirectionalKeyDown(key){
    //console.log(key.key)
    if (key.key === "ArrowLeft" ){
      if (startTime === 0){startTime = Date.now()}
      if (frogPosition[0] > 0 && objectBoard[15*frogPosition[1] + frogPosition[0] - 1] === 0){
        frogBoard[15*frogPosition[1] + frogPosition[0]] = 0;
        frogPosition[0] = frogPosition[0] - 1;
        frogBoard[15*frogPosition[1] + frogPosition[0]] = 1;
        currentDirection = "left";
      }
    }else if (key.key === "ArrowRight"){
      if (startTime === 0){startTime = Date.now()}
      if (frogPosition[0] < 14 && objectBoard[15*frogPosition[1] + frogPosition[0] + 1] === 0){
        frogBoard[15*frogPosition[1] + frogPosition[0]] = 0;
        frogPosition[0] = frogPosition[0] + 1;
        frogBoard[15*frogPosition[1] + frogPosition[0]] = 1;
        currentDirection = "right";
      }
    }else if (key.key === "ArrowDown" ){
      if (startTime === 0){startTime = Date.now()}
      if (frogPosition[1] < 19 && objectBoard[15*frogPosition[1] + frogPosition[0] + 15] === 0 ){
        frogBoard[15*frogPosition[1] + frogPosition[0]] = 0;
        frogPosition[1] = frogPosition[1] + 1;
        frogBoard[15*frogPosition[1] + frogPosition[0]] = 1;
        currentDirection = "down";
      }
    }else if (key.key === "ArrowUp"){
      if (startTime === 0){startTime = Date.now()}
      if (frogPosition[1] > 0 && objectBoard[15*frogPosition[1] + frogPosition[0] - 15] === 0){
        frogBoard[15*frogPosition[1] + frogPosition[0]] = 0;
        frogPosition[1] = frogPosition[1] - 1;
        frogBoard[15*frogPosition[1] + frogPosition[0]] = 1;
        currentDirection = "up";
      }
    }
    else if (key.keyCode === 82) startFroggerGame();
    //console.log(15*frogPosition[1] + frogPosition[0])
    else if (key.keyCode === 32) pauseGame();
    if (detectInWater() || detectRunOver()){
      displayLossScreen();
    }else{
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
  function pauseGame(){
    if (paused){
      paused = false;
      document.removeEventListener('keyDown',detectDirectionalKeyDown);
      document.addEventListener('keyDown',detectOnlyPauseOrRestart);
      document.getElementById("pauseScreen").style.visibility = 'hidden';
    }else{
      paused = true;
      document.addEventListener('keyDown',detectDirectionalKeyDown);
      document.removeEventListener('keyDown',detectOnlyPauseOrRestart);
      document.getElementById("pauseScreen").style.visibility = 'visible';
    }
  }
  function detectInWater(){
    if (tileBoard[frogPosition[0] + frogPosition[1] * 15] ===  "W" && objectBoard[frogPosition[0] + frogPosition[1] * 15] !== "L") return true;
    return false;
  }
  function detectRunOver(){
    if (objectBoard[frogPosition[0] + frogPosition[1] * 15] === "C") return true;
    return false;
  }
  //EndGame
  function displayLossScreen(){
    endingTime = Date.now() - startTime;
    document.removeEventListener('keydown',detectDirectionalKeyDown);
    document.addEventListener('keydown',detectOnlyRestart);
    printFroggerScoreBoard("Loss");
  }
  function submitFroggerScore(end){
    if (cookies.get("id")){
      const requestSetup = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({userID:cookies.get("id"),gameID:1,
        timeInMilliseconds: endingTime,sessionID:cookies.get("sessionID")}) //FIX THIS: IF I ADD DIFFICULTY, CHANGE GAMEIDS
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
    }else{
      document.getElementById('gameScreen').innerHTML = ReactDOMServer.renderToStaticMarkup(
        loginFunctionality({timeInMilliseconds: endingTime, gameID: 1})
      )
      //ask that the user logs in FIX THIS
      // pass a dictionary to a new object in a new file
    }
  }
  //Pages
  function getFroggerMainMenu(){
    document.getElementById('gameScreen').innerHTML = ReactDOMServer.renderToStaticMarkup(
      <>
      <h1>Snake</h1>
      <Button id='startFroggerButton'>Play Frogger</Button><br></br>
      <Button id='froggerInstructionsButton'>Read Instructions</Button><br></br>
      <Button id='froggerScoresButton'>Scores</Button><br></br>
      </>
    );
    document.getElementById('startFroggerButton').onclick = function(){startFroggerGame()};
    document.getElementById('froggerInstructionsButton').onclick = function(){readFroggerInstructions()};
    document.getElementById('froggerScoresButton').onclick = function(){getFroggerScoresPage()};
  }
  function readFroggerInstructions(){
    var instructions;
    document.getElementById('gameScreen').innerHTML = ReactDOMServer.renderToStaticMarkup(
      <>
        <Button id='backButton'>Back</Button><br></br>
        <h1> Instructions </h1>
        <div>

        </div>
      </>
    )
    document.getElementById("backButton").onclick = function(){getFroggerMainMenu()};
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
      fetchString = "scoreswithtimes?sortBy=recent&userID=" + cookies.get("id");
      scoreTitle = "Your Recent Scores";
    }
    if (results.length === 0){
      fetch(process.env.REACT_APP_SERVERLOCATION + fetchString + '&gameID=5')
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
      nextButton = (<Button onClick={getFroggerScoresPage("",rule,results,start + 10, end + 10)}> Next </Button>)
    }
    if (start > 0){
      prevButton = (<Button onClick={getFroggerScoresPage("",rule,results,Math.min(start - 10), Math.max(end - 10,10))}> Previous </Button>)
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
    document.getElementById('backButton').onclick = function(){getFroggerMainMenu()};
    if (rule === "myrecent"){
      document.getElementById("personalScoresSwitch").onclick = function(){getFroggerScoresPage("","recent")};
      document.getElementById("otherMetricButton").onclick = function(){getFroggerScoresPage("","mybest")};
    }else if (rule === "mybest"){
      document.getElementById("personalScoresSwitch").onclick = function(){getFroggerScoresPage("","best")};
      document.getElementById("otherMetricButton").onclick = function(){getFroggerScoresPage("","myrecent")};
    }else if (rule === "recent"){
      if (cookies.get("id")){
        document.getElementById("personalScoresSwitch").onclick = function(){getFroggerScoresPage("","myrecent")};
      }
      document.getElementById("otherMetricButton").onclick = function(){getFroggerScoresPage("","best")};
    }else if (rule === "best" || rule === ""){
      if (cookies.get("id")){
        document.getElementById("personalScoresSwitch").onclick = function(){getFroggerScoresPage("","mybest")};
      }
      document.getElementById("otherMetricButton").onclick = function(){getFroggerScoresPage("","recent")};
    }
  }
  return (
    <div className="gameScreen" id="gameScreen">
      <h1>Frogger</h1>
      <Button onClick={startFroggerGame}>Play Frogger</Button><br></br>
      <Button onClick={readFroggerInstructions}>Read Instructions</Button><br></br>
      <Button onClick={getFroggerScoresPage}>Scores</Button><br></br>
    </div>
    )
}

export default Frogger;
