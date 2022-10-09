import React from "react";
import Button from 'react-bootstrap/Button'
import ReactDOMServer from 'react-dom/server';
import Cookies from 'universal-cookie';
import Table from 'react-bootstrap/Table'
import cookieSetter from "../helpers/setCookiesForGame.jsx";
import millisecondsToReadableTime from "../helpers/timeConversion.ts";
import $ from 'jquery'

require('dotenv').config();

//Game Description:
//Like an arcade game where you stack blocks of different shapes together into a tower
//Google Arcade Stacking Tower Game

function Towers(msg=""){
    const cookies = new Cookies();
    var score = 0;
    var intervalID = ""; //unlikely to need
    var gameBoard = []; //size is ??? FIX THIS

    function startGame(){

    }
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
    function getScoresPage(){
        
    }

    return (
        <div className='gameScreen' id='gameScreen'>
            <h1> Stacking Towers </h1>
            {(msg !== "") ?  <div className='confMsg'>{msg}</div>  : ""}
            <Button onClick={()=>{startGame()}}>Start Game</Button><br></br>
            <Button onClick={()=>{readInstructions()}}>Read Instructions</Button><br></br>
            <Button onClick={()=>{getScoresPage()}}>Scores</Button><br></br>
        </div>
        )
}

export default Towers;