import React from "react";
import Button from 'react-bootstrap/Button'
import ReactDOMServer from 'react-dom/server';
import Cookies from 'universal-cookie';
import Table from 'react-bootstrap/Table'
//import loginFunctionality from "../loginFunctionality/loginFunctionality"
import "./css/Wordle.css"
require('dotenv').config();

//gameScreen consists of psudeo input text box with blocks, game board with current guesses, and the score board

function Wordle(){
  //VARIABLES
  const cookies = new Cookies();
  var score = 0;
  var wordLength = 3;
  var currentWord = "";
  var currentGuess = "";
  var guesses = [];
  //Printers
  function printInitialContent(){
    var reactScript = (
      <>
      <h2>Wordle</h2>
      <div className='wordleColumns'>
        <div className='WordleGameBoard' id='WordleGameBoard'>
          <div className='wordleColumns' id='guessBoxes'></div>
        </div>
        <div className='WordleTextBox' id='WordleTextBox'></div>
      </div>
      <div className='WordleBulletinBoard' id='WordleBulletinBoard'></div>
      </>
    );
    document.getElementById("gameScreen").innerHTML = ReactDOMServer.renderToStaticMarkup(reactScript);
    printWordleGameBoard();
    printWordleBulletinBoard();
    printWordleTextBox();
  }
  function printWordleBulletinBoard(){
    var text = (<Button id='returnButton'>Main Menu</Button>);
    var middleText;
    var quickRestartButton;
    if (currentWord !== ""){
      middleText = (" Score: " + score + " ");
      quickRestartButton = (<Button id="quickRestartButton">Restart</Button>)
    }else{
      middleText = (" Type a letter to begin. ")
    }
    document.getElementById("WordleBulletinBoard").innerHTML = ReactDOMServer.renderToStaticMarkup(
      (
        <>
          {text}
          {middleText}
          {quickRestartButton}
        </>
      )
    );
    document.getElementById("returnButton").onclick = function(){getWordleFrontPage()};
    if (currentWord !== "") document.getElementById("quickRestartButton").onclick = function(){startWordleGame()};
  }
  function printWordleGameBoard(){
    var wordsToPrint = [];
    for (let i = 0 ; i < guesses.length; i++){
      var letters = [];
      for (let x = 0; x < guesses[i].length; i++){
        letters.push(<div className='WordleMiniBox' key={x}>{guesses[i][x]}</div>)
      }
      wordsToPrint.push(
        (
          <div className='WordleBoxesHolder' key={i}>
            {letters}
          </div>
        )
      )
    }
    if (wordsToPrint.length < 5){
      var letters2 = [];
      for (let i = 0; i < wordLength; i++){
        letters2.push(<div className='WordleMiniBox' key={i}></div>)
      }
    }
    while (wordsToPrint.length < 5) wordsToPrint.push(
        (
        <div className='WordleBoxesHolder' key={wordsToPrint.length}>
          {letters2}
        </div>
        )
      )
    document.getElementById('guessBoxes').innerHTML = ReactDOMServer.renderToStaticMarkup(
      <>
      <h2>Guesses</h2>
      {wordsToPrint}
      </>
    )
  }
  function printWordleTextBox(message = ""){

  }
  //KeyLogging
  function detectKeyPress(key){

  }
  //Pages
  function startWordleGame(){
    score = 0;
    wordLength = 3;
    currentWord = "";
    currentGuess = "";
    guesses = [];
    printInitialContent();
    document.addEventListener('keydown',detectKeyPress)
  }
  function readWordleInstructions(){
    document.getElementById('gameScreen').innerHTML = ReactDOMServer.renderToStaticMarkup(
      <>
        <Button id='backButton'>Back</Button><br></br>
        <h1> Instructions </h1>
        <div>

        </div>
      </>
    )
    document.getElementById("backButton").onclick = function(){getWordleFrontPage()};
  }
  function getWordleScores(message = "", rule = "", results = [], start = 0, end = 10){
    var fetchString;
    var scoreTitle;
    if (rule === "" || rule === "best"){//Get the best
      fetchString = "/scoreswithtimes?sortBy=top";
      scoreTitle = "Top Scores";
    }else if (rule === "recent"){
      fetchString = "/scoreswithtimes?sortBy=recent"
      scoreTitle = "Recent Scores";
    }else if (rule === "mybest"){
      fetchString = "/scoreswithtimes?sortBy=top&userID="  + cookies.get("id");
      scoreTitle = "Your Top Scores";
    }else if (rule === "myrecent"){
      fetchString = "scoreswithtimes?sortBy=recent&userID=" + cookies.get("id");
      scoreTitle = "Your Recent Scores";
    }
    if (results.length === 0){
      fetch(process.env.REACT_APP_SERVERLOCATION + fetchString + '&gameID=3')
        .then(response => response.json())
        .then(data => {
          console.log(data.results);
          if (data.status === -1){
            // do nothing... FIX THIS
            console.log(data.message);
          }else{
            wordleScoresHelperFunction(message,rule,data.results,start,end,scoreTitle);
          }
        })
    }else{ //use results instead
      wordleScoresHelperFunction(message,rule,results,start,end,scoreTitle);
    }
  }
  function wordleScoresHelperFunction(message,rule,results,start,end,scoreTitle){
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
      if (cookies.get("id")){
        personalScoresSwitchButton = (<Button id='personalScoresSwitch'> My Recent Scores </Button>)
      }
      otherMetricButton =  (<Button id='otherMetricButton'> All Best Scores </Button>)
    }else if (rule === "best" || rule === ""){
      if (cookies.get("id")){
        personalScoresSwitchButton = (<Button id='personalScoresSwitch'> My Best Scores </Button>)
      }
      otherMetricButton =  (<Button id='otherMetricButton'> All Recent Scores </Button>)
    }
    var nextButton, prevButton;
    if (end < results.length){
      nextButton = (<Button onClick={getWordleScores("",rule,results,start + 10, end + 10)}> Next </Button>)
    }
    if (start > 0){
      prevButton = (<Button onClick={getWordleScores("",rule,results,Math.min(start - 10), Math.max(end - 10,10))}> Previous </Button>)
    }
    var reactString = (
      <>
        <h1> {scoreTitle} </h1>
        <div><Button id='backButton'>Main Menu</Button></div>
        <div> {otherMetricButton} {personalScoresSwitchButton} </div>
        <Table>
        <thead> <tr> <th> # </th> <th> Username </th> <th> Score </th> <th> Time </th> <th> Time Submitted </th> </tr> </thead>
        <tbody>
        {listOfElements}
        </tbody>
        </Table>
        <div>{prevButton}{nextButton}</div>
      </>
    );
    document.getElementById('gameScreen').innerHTML = ReactDOMServer.renderToStaticMarkup(reactString);
    document.getElementById('backButton').onclick = function(){getWordleFrontPage()};
    if (rule === "myrecent"){
      document.getElementById("personalScoresSwitch").onclick = function(){getWordleScores("","recent")};
      document.getElementById("otherMetricButton").onclick = function(){getWordleScores("","mybest")};
    }else if (rule === "mybest"){
      document.getElementById("personalScoresSwitch").onclick = function(){getWordleScores("","best")};
      document.getElementById("otherMetricButton").onclick = function(){getWordleScores("","myrecent")};
    }else if (rule === "recent"){
      if (cookies.get("id")){
        document.getElementById("personalScoresSwitch").onclick = function(){getWordleScores("","myrecent")};
      }
      document.getElementById("otherMetricButton").onclick = function(){getWordleScores("","best")};
    }else if (rule === "best" || rule === ""){
      if (cookies.get("id")){
        document.getElementById("personalScoresSwitch").onclick = function(){getWordleScores("","mybest")};
      }
      document.getElementById("otherMetricButton").onclick = function(){getWordleScores("","recent")};
    }
  }
  function getWordleFrontPage(){
    document.getElementById('gameScreen').innerHTML = ReactDOMServer.renderToStaticMarkup(
      <>
        <h1> Wordle </h1>
        <Button id='startGameButton' >Start Game</Button><br></br>
        <Button id='instructionsButton'>Read Instructions</Button><br></br>
        <Button id='scoresButton'>Scores</Button><br></br>
      </>
    );
    document.getElementById("startGameButton").onclick = function(){startWordleGame()};
    document.getElementById("instructionsButton").onclick = function(){readWordleInstructions()};
    document.getElementById("scoresButton").onclick = function(){getWordleScores()};
  }
  ////
  return (
    <div className='gameScreen' id='gameScreen'>
      <h1> Wordle </h1>
      <Button onClick={()=>{startWordleGame()}}>Start Game</Button><br></br>
      <Button onClick={()=>{readWordleInstructions()}}>Read Instructions</Button><br></br>
      <Button onClick={()=>{getWordleScores()}}>Scores</Button><br></br>
    </div>
  )
}

export default Wordle;
