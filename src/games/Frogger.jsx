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
  var objectBoard = [];

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
        if (y === 0 || y === 9 || y === 19) tileBoard.push("L");
        else if (y === 1){
          if (x === 2 || x === 5 || x === 7 || x === 9 || x === 12) tileBoard.push("W")
          else tileBoard.push("L");
        }else if (y >= 2 && y <= 8) tileBoard.push("W");
        else if (y >= 10 || y <= 18) tileBoard.push("R");
      }
    }
  }
  //Printers
  function printFroggerBoard(){
    var tiles = [];
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
    }
    document.getElementById('froggerTileBoard').innerHTML = ReactDOMServer.renderToStaticMarkup(tiles);

  }
  function printFroggerScoreBoard(){

  }
  function printInitialContent(){
    document.getElementById('gameScreen').innerHTML = ReactDOMServer.renderToStaticMarkup(
      <>
      <h1>Frogger</h1>
      <div className = 'froggerScreen' id='froggerScreen'>
        <div className='froggerTileBoard' id='froggerTileBoard'></div>
        <div className='froggerObjBoard' id='froggerObjBoard'></div>
        <div className='froggerPauseScreen' id='froggerPauseScreen'><h1>PAUSED</h1><br></br><h3>Press Space to Unpause</h3></div>
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
