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
  var height = 20;
  var width = 15;

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
  function startFroggerGame(){

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
