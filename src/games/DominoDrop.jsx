import React from "react";
import Button from 'react-bootstrap/Button'
import ReactDOMServer from 'react-dom/server';
import Cookies from 'universal-cookie';
import Table from 'react-bootstrap/Table'
import cookieSetter from "../helpers/setCookiesForGame.jsx";
import millisecondsToReadableTime from "../helpers/timeConversion.ts";
import $ from 'jquery'

import oneDice from './dominoDropImages/one.png';
import twoDice from './dominoDropImages/two.png';
import threeDice from './dominoDropImages/three.png';
import fourDice from './dominoDropImages/four.png';
import fiveDice from './dominoDropImages/five.png';
import sixDice from './dominoDropImages/six.png';

//show block detonation?

require('dotenv').config();

function DominoDrop(msg=""){
    const cookies = new Cookies();
    var score = 0;
    var intervalID = ""; //unlikely to need
    var gameBoard = []; //size is 4 x 12
    var currentPiece = false;
    var currentOccupyingSpaces = [];
    var nextPiece = false;

    //Game Functions
    function startGame(){
      $('body').off('keydown',detectKeyPress);
      gameBoard = [];
      score = 0;
      currentPiece = false;
      setBoard();
      currentPiece = generateDomino();
      nextPiece = generateDomino();
      currentOccupyingSpaces = currentPiece[2] === 0 ? [8,9] : [9,15] ;
      printInitialContent();
      printAllContent();
      $('body').on('keydown',detectKeyPress);
    }
    function generateDomino(){
        //yellow 1, orange 2, red 3, green 4, blue 5, violet 6, blank white
        //randomly generate 1 of 7 values, white having a lower chance?
        //can change odds later
        return [
            Math.floor(Math.random() * 7) + 1, //firstValue
            Math.floor(Math.random() * 7) + 1, //secondValue
            Math.floor(Math.random() * 2)  //orientation 0: Horizontal Shape 1: Vertical Shape
        ];
    }
    // //Board Interactions
    function setBoard(){
      gameBoard.push(['X','X','X','X','X','X']);
      for (let i = 0; i < 12; i++) gameBoard.push(['X',0,0,0,0,'X']);
      gameBoard.push(['X','X','X','X','X','X']);
      score = 0;
      currentPiece = false;
      currentOccupyingSpaces = [];
    }
    // // Key Detection
    function detectKeyPress(key){
      key.preventDefault();
      if (key.keyCode === 82) startGame();
      else if (key.key === "ArrowLeft") moveLeft();
      else if (key.key === "ArrowRight") moveRight();
    }
    // // Movement
    function moveLeft(){
      for (let i = currentOccupyingSpaces[0] % 6; 1 < i; i--){
        var loc1 = numberConvert(currentOccupyingSpaces[0]);
        var loc2 = numberConvert(currentOccupyingSpaces[1]);
        if (gameBoard[loc1[0]][loc1[1] - 1] === 0 
          && gameBoard[loc2[0]][loc2[1] - 1] === 0 ){
          currentOccupyingSpaces = [currentOccupyingSpaces[0] - 1, currentOccupyingSpaces[1] - 1, currentOccupyingSpaces[2]];
          printBoard();
          return;
        }
      }
    }
    function moveRight(){
      for (let i = currentOccupyingSpaces[0] % 6;  i < 5; i++){
        var loc1 = numberConvert(currentOccupyingSpaces[0]);
        var loc2 = numberConvert(currentOccupyingSpaces[1]);
        if (gameBoard[loc1[0]][loc1[1] + 1] === 0 
          && gameBoard[loc2[0]][loc2[1] + 1] === 0 ){
          currentOccupyingSpaces = [currentOccupyingSpaces[0] + 1, currentOccupyingSpaces[1] + 1, currentOccupyingSpaces[2]];
          printBoard();
          return;
        }
      }
    }
    // // //Printers
    function printInitialContent(){
      var reactScript = (
        <>
        {/* <h2>Domino Drop</h2> */}
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
      printBoard();
      printScoreBoard();
    }
    function printBoard(){
      var squares = [];
      for (let i = 0; i < gameBoard.length; i++){
        for (let x = 0; x < gameBoard[i].length; x++){
          if (gameBoard[i][x] === 'X') squares.push(<div className="borderTile" key={i} id={'square' + i*6+x}></div>)
          else if (gameBoard[i][x] === 1 || 
            (currentOccupyingSpaces[0] === (i*6+x) && currentPiece[0] === 1) || 
            (currentOccupyingSpaces[1] === (i*6+x) && currentPiece[1] === 1)){
            squares.push(<img className='tile' alt='one' src={oneDice} key={i} id={'square' + i*6+x}></img>);
          }else if (gameBoard[i][x] === 2 || 
            (currentOccupyingSpaces[0] === (i*6+x) && currentPiece[0] === 2) || 
            (currentOccupyingSpaces[1] === (i*6+x) && currentPiece[1] === 2)){
              squares.push(<img className='tile' alt='two' src={twoDice} key={i} id={'square' + i*6+x}></img>);
          }else if (gameBoard[i][x] === 3 || 
            (currentOccupyingSpaces[0] === (i*6+x) && currentPiece[0] === 3) || 
            (currentOccupyingSpaces[1] === (i*6+x) && currentPiece[1] === 3)){
              squares.push(<img className='tile' alt='three' src={threeDice} key={i} id={'square' + i*6+x}></img>);
          }else if (gameBoard[i][x] === 4 || 
            (currentOccupyingSpaces[0] === (i*6+x) && currentPiece[0] === 4) || 
            (currentOccupyingSpaces[1] === (i*6+x) && currentPiece[1] === 4)){
              squares.push(<img className='tile' alt='four' src={fourDice} key={i} id={'square' + i*6+x}></img>);
          }else if (gameBoard[i][x] === 5 || 
            (currentOccupyingSpaces[0] === (i*6+x) && currentPiece[0] === 5) || 
            (currentOccupyingSpaces[1] === (i*6+x) && currentPiece[1] === 5)){
              squares.push(<img className='tile' alt='five' src={fiveDice} key={i} id={'square' + i*6+x}></img>);
          }else if (gameBoard[i][x] === 6 || 
            (currentOccupyingSpaces[0] === (i*6+x) && currentPiece[0] === 6) || 
            (currentOccupyingSpaces[1] === (i*6+x) && currentPiece[1] === 6)){
              squares.push(<img className='tile' alt='six' src={sixDice} key={i} id={'square' + i*6+x}></img>);
          }else if (gameBoard[i][x] === 7 || 
            (currentOccupyingSpaces[0] === (i*6+x) && currentPiece[0] === 7) || 
            (currentOccupyingSpaces[1] === (i*6+x) && currentPiece[1] === 7)){
              squares.push(<div className="whiteTile" key={i} id={'square' + i*6+x}></div>);
          }else if (gameBoard[i][x] === 0) squares.push(<div className="blankTile" key={i} id={'square' + i*6+x}></div>);
        }
      }
      $('#ddGameBoard').html(ReactDOMServer.renderToStaticMarkup(
        <div>
        {squares}
        </div>
      ))
    }
    function printScoreBoard(end=false){
      var mainMenuButton = (<Button id='mainMenuButton'>Main Menu</Button>);
      var restartButton = (<Button id='restartButton'>Restart</Button>);
      var submitButton = end ? (<Button id='submitButton'>Submit Scores</Button>) : (<div></div>)
      $('#bulletinBoard').html(ReactDOMServer.renderToStaticMarkup(
        <div>
          {mainMenuButton}
          Current Score: {score}
          {restartButton}
          {submitButton}
        </div>
      ));
      $('#mainMenuButton').click(function(){getFrontPage()});
      $('#restartButton').click(function(){startGame()});
      if (end) $('#submitButton').click(function(){submitScore()});
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
    function submitScore(){
      //FIX THIS
    }
    //Other
    function numberConvert(num){
      return [Math.floor(num/6),num%6];
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
          <h1> Domino Drop </h1>
          {(msg !== "") ?  <div className='confMsg'>{msg}</div>  : ""}
          <Button onClick={()=>{startGame()}}>Start Game</Button><br></br>
          <Button onClick={()=>{readInstructions()}}>Read Instructions</Button><br></br>
          <Button onClick={()=>{getScoresPage()}}>Scores</Button><br></br>
        </div>
      )
}

export default DominoDrop;