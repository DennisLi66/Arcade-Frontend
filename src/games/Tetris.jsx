import React from "react";
import Button from 'react-bootstrap/Button'
import ReactDOMServer from 'react-dom/server';
require('dotenv').config();


function Tetris(){
  var gameBoard = [];
  var score = 0;
  var startingTime = 0;
  var intervalID = "";
  var direction = false; //will also tell us if gamestarted
  var endingTime = 0;
  var timeTilDescent = 0;
  function setBoard(){

  }
  function startGame(){

  }
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
