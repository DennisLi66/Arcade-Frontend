import React from "react";
import Button from 'react-bootstrap/Button'
import ReactDOMServer from 'react-dom/server';
import Cookies from 'universal-cookie';
import Table from 'react-bootstrap/Table'
import cookieSetter from "../helpers/setCookiesForGame.jsx";
import millisecondsToReadableTime from "../helpers/timeConversion.ts";
import $ from 'jquery'

require('dotenv').config();

function Match3(msg=""){
    const cookies = new Cookies();
    var score = 0;
    var intervalID = ""; //unlikely to need
    var gameBoard = []; //size is ??? FIX THIS
    var multiplier = 1;
    var timer = 0;
    var markedPiece = null;

    function startGame(){
      $('body').off('keydown',detectKeyPress);
      gameBoard = [];
      score = 0;
      timer = 0;
      multiplier = 0;
      markedPiece = null;
      setBoard();
      printInitialContent();
      printAllContent();
      $('body').on('keydown',detectKeyPress);
    }
    //Printers
    function printInitialContent(){

    }
    function printAllContent(){

    }
    //Detection
    function detectKeyPress(){
      if (markedPiece){

      }
    }
    function markPiece(id){
      markedPiece = id;
    }
    //Score Submission
    function submitScore(end){
      //FIX THIS - Needs Checking Later
      if (cookies.get("id")){
        const requestSetup = {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({userID:cookies.get("id"),gameID: 7, score: score,
          sessionID:cookies.get("sessionID")}) //FIX THIS: IF I ADD DIFFICULTY, CHANGE GAMEIDS
        }
        fetch(process.env.REACT_APP_SERVERLOCATION + '/scores',requestSetup)
          .then(response => response.json())
          .then(data => {
            console.log(data);
            if (data.status === -1) printScoreBoard(end,data.message);
            else getScoresPage("Your score has been submitted.");
          })
      }else cookieSetter({gameID: 7, score: score === 0 ? "0" : score});  
    }
    //Base Pages
    function getScoresPage(message = "", rule = "", results = [], start = 0, end = 10){
      //FIX THIS: Change to scores and times if needed
      var fetchString;
      var scoreTitle;
      if (rule === "" || rule === "best"){//Get the best
        fetchString = "/scores?sortBy=top";
        scoreTitle = "Top Scores";
      }else if (rule === "recent"){
        fetchString = "/scores?sortBy=recent"
        scoreTitle = "Recent Scores";
      }else if (rule === "mybest"){
        fetchString = "/scores?sortBy=top&userID="  + cookies.get("id");
        scoreTitle = "Your Top Scores";
      }else if (rule === "myrecent"){
        fetchString = "/scores?sortBy=recent&userID=" + cookies.get("id");
        scoreTitle = "Your Recent Scores";
      }
      if (results.length === 0){
        fetch(process.env.REACT_APP_SERVERLOCATION + fetchString + '&gameID=7')
          .then(response => response.json())
          .then(data => {
            console.log(data.results);
            if (data.status === -1){
              // console.log(data.message);
              scoresHelperFunction(data.message,rule,data.results,start,end,scoreTitle);
            }else if (!data.results) scoresHelperFunction("Oops! Received Faulty Information From Server...",rule,[],start,end,scoreTitle);
            else scoresHelperFunction(message,rule,data.results,start,end,scoreTitle);
          })
      }else scoresHelperFunction(message,rule,results,start,end,scoreTitle);
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
        if (cookies.get("id")) personalScoresSwitchButton = (<Button id='personalScoresSwitch'> My Recent Scores </Button>)
        otherMetricButton =  (<Button id='otherMetricButton'> All Best Scores </Button>)
      }else if (rule === "best" || rule === ""){
        if (cookies.get("id")) personalScoresSwitchButton = (<Button id='personalScoresSwitch'> My Best Scores </Button>)
        otherMetricButton =  (<Button id='otherMetricButton'> All Recent Scores </Button>)
      }
      var nextButton, prevButton;
      if (end < results.length) nextButton = (<Button onClick={getScoresPage("",rule,results,start + 10, end + 10)}> Next </Button>)
      if (start > 0) prevButton = (<Button onClick={getScoresPage("",rule,results,Math.min(start - 10), Math.max(end - 10,10))}> Previous </Button>)
      var notif;
      if (message) {
        if (message === "" || message === "Your score has been submitted.") notif = (<div className="confMsg">{message}</div>)
        else notif = (<div className="errMsg"> {message} </div>)
      }
      var reactString = (
        <>
          <h1> {scoreTitle} </h1>
          <div><Button id='backButton'>Main Menu</Button></div>
          <div> {otherMetricButton} {personalScoresSwitchButton} </div>
          <div>{notif}</div>
          <Table>
          <thead> <tr> <th> # </th> <th> Username </th> <th> Score </th> <th> Time </th> <th> Time Submitted </th> </tr> </thead>
          <tbody>
          {listOfElements}
          </tbody>
          </Table>
          <div>{prevButton}{nextButton}</div>
        </>
      );
      $('#gameScreen').html(ReactDOMServer.renderToStaticMarkup(reactString));
      $('#backButton').click(function(){getFrontPage()});
      if (rule === "myrecent"){
        $("#personalScoresSwitch").click(function(){getScoresPage("","recent")});
        $("#otherMetricButton").click(function(){getScoresPage("","mybest")});
      }else if (rule === "mybest"){
        $("#personalScoresSwitch").click(function(){getScoresPage("","best")});
        $("#otherMetricButton").click(function(){getScoresPage("","myrecent")});
      }else if (rule === "recent"){
        if (cookies.get("id")) $("#personalScoresSwitch").click(function(){getScoresPage("","myrecent")});
        $("otherMetricButton").click(function(){getScoresPage("","best")});
      }else if (rule === "best" || rule === ""){
        if (cookies.get("id")) $("#personalScoresSwitch").click(function(){getScoresPage("","mybest")});
        $("#otherMetricButton").click(function(){getScoresPage("","recent")});
      }
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
          <h1> Match 3 </h1>
          {(msg !== "") ?  <div className='confMsg'>{msg}</div>  : ""}
          <Button onClick={()=>{startGame()}}>Start Game</Button><br></br>
          <Button onClick={()=>{readInstructions()}}>Read Instructions</Button><br></br>
          <Button onClick={()=>{getScoresPage()}}>Scores</Button><br></br>
        </div>
      )
}

export default Match3;