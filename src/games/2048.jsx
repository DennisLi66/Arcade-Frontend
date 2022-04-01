import React from "react";
import Button from 'react-bootstrap/Button'
import ReactDOMServer from 'react-dom/server';
import Cookies from 'universal-cookie';
import Table from 'react-bootstrap/Table'
import loginFunctionality from "../loginFunctionality/loginFunctionality"

require('dotenv').config();

function Two048(){
  //Values
  const cookies = new Cookies();
  var gameBoard = [];
  var score, startTime, totalTime = 0;
  //Menus
  function get2048MainMenu(){
    document.getElementById('gameScreen').innerHTML = ReactDOMServer.renderToStaticMarkup(
      <>
      <h1>2048</h1>
      <Button id='start2048Button'>Play 2048</Button><br></br>
      <Button id='two048InstructionsButton'>Read Instructions</Button><br></br>
      <Button id='two048ScoresButton'>Scores</Button><br></br>
      </>
    );
    document.getElementById('start2048Button').onclick = function(){start2048Game()};
    document.getElementById('two048InstructionsButton').onclick = function(){read2048Instructions()};
    document.getElementById('two048ScoresButton').onclick = function(){get2048ScoresPage()};
  }
  function read2048Instructions(){
    var instructions;
  }
  function get2048ScoresPage(message = "", rule = "", results = [], start = 0, end = 10){
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
      fetch(process.env.REACT_APP_SERVERLOCATION + fetchString + '&gameID=6')
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
      nextButton = (<Button onClick={get2048ScoresPage("",rule,results,start + 10, end + 10)}> Next </Button>)
    }
    if (start > 0){
      prevButton = (<Button onClick={get2048ScoresPage("",rule,results,Math.min(start - 10), Math.max(end - 10,10))}> Previous </Button>)
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
    document.getElementById('backButton').onclick = function(){get2048MainMenu()};
    if (rule === "myrecent"){
      document.getElementById("personalScoresSwitch").onclick = function(){get2048ScoresPage("","recent")};
      document.getElementById("otherMetricButton").onclick = function(){get2048ScoresPage("","mybest")};
    }else if (rule === "mybest"){
      document.getElementById("personalScoresSwitch").onclick = function(){get2048ScoresPage("","best")};
      document.getElementById("otherMetricButton").onclick = function(){get2048ScoresPage("","myrecent")};
    }else if (rule === "recent"){
      if (cookies.get("id")){
        document.getElementById("personalScoresSwitch").onclick = function(){get2048ScoresPage("","myrecent")};
      }
      document.getElementById("otherMetricButton").onclick = function(){get2048ScoresPage("","best")};
    }else if (rule === "best" || rule === ""){
      if (cookies.get("id")){
        document.getElementById("personalScoresSwitch").onclick = function(){get2048ScoresPage("","mybest")};
      }
      document.getElementById("otherMetricButton").onclick = function(){get2048ScoresPage("","recent")};
    }
  }
  //Game Start
  function start2048Game(){
    create2048Board();
    printInitialContent();
    document.addEventListener('keydown',detectDirectionalKeyDown);
  }
  function create2048Board(){
    gameBoard = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    score = 0;
    startTime = 0;
    gameBoard[randomlyPickFreeSquare()] = 2;
    gameBoard[randomlyPickFreeSquare()] = 2;
  }
  //Algorithms
  function randomlyPickFreeSquare(){
    var emptySlots = [];
    for (let i = 0; i < gameBoard.length; i++){
      if (gameBoard[i] === 0) emptySlots.push(i);
    }
    return emptySlots[Math.floor(Math.random() * (emptySlots.length + 1))]
  }
  function generateStyleForSquare(number){

  }
  //Detection
  function detectDirectionalKeyDown(key){
    if (key.key === "ArrowLeft" ){
      shiftContents("left");
      startTime = Date.now();
    }else if (key.key === "ArrowRight"){
      shiftContents("right");
      startTime = Date.now();
    }else if (key.key === "ArrowDown" ){
      shiftContents("down");
      startTime = Date.now();
    }else if (key.key === "ArrowUp"){
      shiftContents("up");
      startTime = Date.now();
    }
    else if (key.keyCode === 82) start2048Game();
    else if (key.keyCode === 32) pauseGame();
  }
  //Printers
  function printInitialContent(){
    document.getElementById('gameScreen').innerHTML = ReactDOMServer.renderToStaticMarkup(
      <>
      <div className = 'two048Screen' id='two048Screen'>
        <div className='two048GameBoard' id='two048GameBoard'></div>
        <div className='two048PauseScreen' id='two048PauseScreen'><h1>PAUSED</h1><br></br><h3>Press Space to Unpause</h3></div>
      </div>
      <div className='bulletinBoard' id='bulletinBoard'></div>
      </>
    )
    print2048Board();
    print2048ScoreBoard();
  }
  function print2048Board(){
    var squares = [];
    for (let i = 0; i < gameBoard.length; i++){
      squares.push(<div className='two048Tile' key={i}><h1>{gameBoard[i] === 0 ? "" : gameBoard[i]}</h1></div>)
    }
    document.getElementById("two048GameBoard").innerHTML = ReactDOMServer.renderToStaticMarkup(
      <div>
      {squares}
      </div>
    )
  }
  function print2048ScoreBoard(){

  }
  //Player Actions
  function pauseGame(){
    var pause;
  }
  function shiftContents(direction){
    var cintents;
  }
  return (
    <div className="gameScreen" id="gameScreen">
      <h1>2048</h1>
      <Button onClick={start2048Game}>Play 2048</Button><br></br>
      <Button onClick={read2048Instructions}>Read Instructions</Button><br></br>
      <Button onClick={get2048ScoresPage}>Scores</Button><br></br>
    </div>
    )
}

export default Two048;
