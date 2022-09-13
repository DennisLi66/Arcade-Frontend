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
    var gameBoard = []; //size is 4 x 12
    var currentPiece = false;

    //Game Functions
    function startGame(){
        setBoard();
        printInitialContent();
        printAllContent();
    }
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
    // //Board Interactions
    function setBoard(){
        gameBoard.push(['X','X','X','X','X','X']);
        for (let i = 0; i < 12; i++) gameBoard.push(['X',0,0,0,0,'X']);
        gameBoard.push(['X','X','X','X','X','X']);
        score = 0;
        currentPiece = false;
    }
    // // //Printers
    function printInitialContent(){

    }
    function printAllContent(){

    }
    //Scores
    function getScoresPage(){

    }
    //Other
    function readInstructions(){
        $('#gameScreen').html(ReactDOMServer.renderToStaticMarkup(
            <>
              <Button id='backButton'>Back</Button><br></br>
              <h1> Instructions </h1>
              <div>
                    FIX THIS
              </div>
            </>
          ));
          $("#backButton").click(function(){getFrontPage()});
    }
    function getFrontPage(){
      $('#gameScreen').html(ReactDOMServer.renderToStaticMarkup(
        <>
          <h1> Domino Drop </h1>
          <Button id='startGameButton' >Start Game</Button><br></br>
          <Button id='instructionsButton'>Read Instructions</Button><br></br>
          <Button id='scoresButton'>Scores</Button><br></br>
        </>
      ));
        $("#startGameButton").click(function(){startGame()});
        $("#instructionsButton").click(function(){readInstructions()});
        $("#scoresButton").click(function(){getScoresPage()});
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