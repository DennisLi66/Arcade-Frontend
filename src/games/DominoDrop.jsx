import React from "react";
import Button from 'react-bootstrap/Button'
import ReactDOMServer from 'react-dom/server';
import Cookies from 'universal-cookie';
import Table from 'react-bootstrap/Table'
import cookieSetter from "../helpers/setCookiesForGame.jsx";
import millisecondsToReadableTime from "../helpers/timeConversion.ts";
import $ from 'jquery'

//show block detonation?

require('dotenv').config();

function DominoDrop(msg=""){
    const cookies = new Cookies();
    var score = 0;
    var intervalID = ""; //unlikely to need
    var gameBoard = [];
    var currentPiece = false;

    function generateDomino(){
        //yellow 1, orange 2, red 3, green 4, blue 5, black 6, blank white
        //randomly generate 1 of 7 values, white having a lower chance?
        //can change odds later
        return [
            Math.floor(Math.random() * 7), //firstValue
            Math.floor(Math.random() * 7), //secondValue
            Math.floor(Math.random() * 2)  //orientation
        ];
    }

    return (
        <div className='gameScreen' id='gameScreen'>
          <h1> Domino Drop </h1>
          {(msg !== "") ?  <div className='confMsg'>{msg}</div>  : ""}
          <Button onClick={()=>{startGame()}}>Start Game</Button><br></br>
          <Button onClick={()=>{readInstructions()}}>Read Instructions</Button><br></br>
          <Button onClick={()=>{getScoresPage()}}>Scores</Button><br></br>
        </div>
      )
}

export default DominoDrop;