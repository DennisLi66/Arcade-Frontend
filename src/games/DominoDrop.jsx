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
      var reactScript = (
        <>
        <h2>Domino Drop</h2>
        <div className = 'ddScreen' id='ddScreen'>
          <div className='ddGameBoard' id='ddGameBoard'></div>
        </div>
        <div className='bulletinBoard' id='bulletinBoard'></div>
        </>
    );
    $("#gameScreen").html(ReactDOMServer.renderToStaticMarkup(reactScript));
    printAllContent();
    }
    function printAllContent(){
      // var squares = [];
      // for ()
    }
    //Scores
    function getScoresPage(message = "", rule = "", results = [], start = 0, end = 10){
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