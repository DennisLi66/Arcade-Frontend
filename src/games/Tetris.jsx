import React from "react";
import Button from 'react-bootstrap/Button'
//import ReactDOMServer from 'react-dom/server';
require('dotenv').config();


function Tetris(){
  var gameBoard = [];
  function startGame(){

  }
  function readInstructions(){

  }
  function getScoresPage(){

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
