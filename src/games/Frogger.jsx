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
  var frogPosition = false;
  var paused = false;
  var tileBoard = [];
  var obstacleBoard = [];

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
    for (let y = 0; y < 20; y++){
      for (let x = 0; x < 15; x++){
        if (y === 0) tileBoard.push("L");
        else if (y === 1){

        }else if (y === 2){

        }
      }
    }
  }
  //Printers
  function printFroggerBoard(){

  }
  function printFroggerScoreBoard(){

  }
  function printInitialContent(){
    document.getElementById('gameScreen').innerHTML = ReactDOMServer.renderToStaticMarkup(
      <>
      <h1>Frogger</h1>
      <div className = 'froggerScreen' id='froggerScreen'>
        <div className='froggerBoard' id='froggerBoard'></div>
        <div className='pauseScreen' id='pauseScreen'><h1>PAUSED</h1><br></br><h3>Press Space to Unpause</h3></div>
      </div>
      <div className='bulletinBoard' id='bulletinBoard'></div>
      </>
    )
    printFroggerBoard();
    printFroggerScoreBoard();
  }
  //Key Detection
  function detectDirectionalKeyDown(){

  }
  function detectOnlyRestart(){

  }
  function detectOnlyPauseOrRestart(){

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
    const b = 0;
  }
  function getFroggerScoresPage(){
    const a = 0;
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
