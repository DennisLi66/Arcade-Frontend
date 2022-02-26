import React from "react";
import Button from 'react-bootstrap/Button'
import ReactDOMServer from 'react-dom/server';
import Cookies from 'universal-cookie';
import Table from 'react-bootstrap/Table'
import loginFunctionality from "../loginFunctionality/loginFunctionality"
import produceWord from "../helpers/produceWord.ts";
require('dotenv').config();

//Add score submission
//gameScreen consists of psudeo input text box with blocks, game board with current guesses, and the score board

function Wordle(){
  //VARIABLES
  const cookies = new Cookies();
  var score = 0;
  var currentWord = "";
  var currentGuess = "";
  var wordLength = 5;
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
      quickRestartButton = (<Button id="quickRestartButton">Restart</Button>);
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
  function printWordleLossBulletinBoard(){
    var text = (<Button id='returnButton'>Main Menu</Button>);
    var middleText = (" Final Score: " + score + " ");
    var quickRestartButton = (<Button id="quickRestartButton">Restart</Button>);
    var submitAndQuitButton = (<Button id='submitAndQuitButton'>Submit Score</Button>);
    document.getElementById("WordleBulletinBoard").innerHTML = ReactDOMServer.renderToStaticMarkup(
      (
        <>
          {text}
          {middleText}
          {submitAndQuitButton}
          {quickRestartButton}
        </>
      )
    );
    document.getElementById("returnButton").onclick = function(){getWordleFrontPage()};
    document.getElementById("quickRestartButton").onclick = function(){startWordleGame()};
    document.getElementById("submitAndQuitButton").onclick = function(){submitScoreAndEndGame()}
  }
  function printWordleWinBulletinBoard(){
    var middleText = (" Current Score: " + score + " ");
    var advanceLengthButton;
    if (wordLength < 8) advanceLengthButton = (<Button id='advanceLengthButton'>Increase Word Length</Button>);
    var decreaseLengthButton;
    if (wordLength > 3) decreaseLengthButton = (<Button id='decreaseLengthButton'>Decrease Word Length</Button>);
    var submitAndQuitButton = (<Button id='submitAndQuitButton'>Submit Score and End Game</Button>);
    var continueButton = (<Button id='continueButton'>Continue</Button>)
    document.getElementById("WordleBulletinBoard").innerHTML = ReactDOMServer.renderToStaticMarkup(
      <>
        {middleText}
        {decreaseLengthButton}
        {continueButton}
        {advanceLengthButton}
        {submitAndQuitButton}
      </>
    );
    if (wordLength < 8) document.getElementById("advanceLengthButton").onclick = function(){nextWordStage(1)};
    if (wordLength > 3) document.getElementById("decreaseLengthButton").onclick = function(){nextWordStage(-1)};
    document.getElementById("submitAndQuitButton").onclick = function(){submitScoreAndEndGame()};
    document.getElementById("continueButton").onclick = function(){nextWordStage()}
  }
  function printWordleGameBoard(){
    var wordsToPrint = [];
    for (let i = 0 ; i < guesses.length; i++){
      var letters = [];
      var copyOfWord = [];
      for (let y = 0; y < currentWord.length; y++){
        copyOfWord.push(currentWord[y]);
      }
      for (let x = 0; x < guesses[i].length; x++){
        if (guesses[i][x].toUpperCase() === currentWord[x].toUpperCase()){
          letters.push(<div className='WordleGreenBox' key={x}>{guesses[i][x].toUpperCase()}</div>);
          copyOfWord[x] = '_';
        }else{
          var found = false;
          for (let t = 0; t < copyOfWord.length; t++){
            if (copyOfWord[t].toUpperCase() === guesses[i][x].toUpperCase()){
              found = true;
              letters.push(<div className='WordleYellowBox' key={x}>{guesses[i][x].toUpperCase()}</div>);
              copyOfWord[t] = '_';
              break;
            }
          }
          if (!found) letters.push(<div className='WordleMiniBox' key={x}>{guesses[i][x].toUpperCase()}</div>);
        }
      }
      wordsToPrint.push(
        (
          <div className='WordleBoxesHolder' key={i}>
            {letters}
          </div>
        )
      )
    }
    if (wordsToPrint.length < 6){
      var letters2 = [];
      for (let i = 0; i < wordLength; i++){
        letters2.push(<div className='WordleMiniBox' key={i}></div>)
      }
    }
    while (wordsToPrint.length < 6) wordsToPrint.push(
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
    var letterBoxes = [];
    for (let i = 0; i < currentGuess.length; i++){
      letterBoxes.push(<div className='WordleMiniBox' key={i}>{currentGuess[i].toUpperCase()}</div>)
    }
    while (letterBoxes.length < wordLength){
      letterBoxes.push(<div className='WordleMiniBox' key={letterBoxes.length}></div>)
    }
    document.getElementById('WordleTextBox').innerHTML = ReactDOMServer.renderToStaticMarkup(
      <>
        <h4>Your Current Guess</h4>
        <h5> {message} </h5>
        <div className='WordleBoxesHolder'>
          <Button id='wordleClearButton'>Clear</Button>
          {letterBoxes}
          <Button id='wordleSubmitButton'>Submit</Button>
        </div>
      </>
    );
    document.getElementById('wordleSubmitButton').onclick = function(){submitGuess()};
    document.getElementById('wordleClearButton').onclick = function(){currentGuess = ""; printWordleTextBox()};
  }
  function printWordleLossTextBox(){
    var letterBoxes = [];
    for (let i = 0; i < currentWord.length; i++){
      letterBoxes.push(<div className='WordleMiniBox' key={i}>{currentWord[i].toUpperCase()}</div>)
    };
    document.getElementById('WordleTextBox').innerHTML = ReactDOMServer.renderToStaticMarkup(
      <>
        <h4>The Actual Word</h4>
        <div className='WordleBoxesHolder'>
          {letterBoxes}
        </div>
      </>
    );
  }
  //KeyLogging
  function detectKeyPress(button){
    if (button.keyCode >= 65 && button.keyCode <= 90){
      if (currentGuess.length < wordLength){
        currentGuess += button.key;
        printWordleTextBox();
      }
    }else if (button.keyCode === 13){ //Enter Button
      submitGuess();
    }else if (button.keyCode === 8){ //Backspace Button
      if (currentGuess.length > 0){
        currentGuess = currentGuess.slice(0,-1);
        printWordleTextBox();
      }
    }
  }
  function detectOnlyRestart(button){
    if (button.keyCode === 82) startWordleGame();
  }
  function submitGuess(){
    if (currentGuess.length !== wordLength);
    else if (checkPreviouslyUsed()){
      printWordleTextBox("You've already typed that word!");
    }else if (currentGuess.toLowerCase() === currentWord.toLowerCase()) showVictoryScreen();
    else{
        guesses.push(currentGuess);
        if (guesses.length === 6){
          currentGuess = "";
          showLossScreen();
        }else{
          currentGuess = "";
          printWordleGameBoard();
          printWordleBulletinBoard();
          printWordleTextBox();
        }
      }
  }
  //Loss and Victory screens
  function showVictoryScreen(){
    //add score based on amount of guesses
    //can submit score and quit
    //can increase word length and point gain
    document.removeEventListener('keydown',detectKeyPress);
    const guessRatio = [25,15,10,6,3,1];
    score += guessRatio[guesses.length] * (1 + Math.abs(5-wordLength));
    guesses.push(currentGuess);
    printWordleGameBoard();
    printWordleTextBox();
    printWordleWinBulletinBoard();
  }
  function showLossScreen(){
    document.removeEventListener('keydown',detectKeyPress);
    document.addEventListener('keydown',detectOnlyRestart);
    printWordleGameBoard();
    printWordleLossTextBox();
    printWordleLossBulletinBoard();
  }
  function submitScoreAndEndGame(){
    // console.log(cookies.get("id"));
    // console.log(cookies.get("sessionID"));
    if (cookies.get("id")){
      const requestSetup = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({userID:cookies.get("id"),score:score,gameID:3
        ,
        sessionID:cookies.get("sessionID")}) //FIX THIS: IF I ADD DIFFICULTY, CHANGE GAMEIDS
      }
      fetch(process.env.REACT_APP_SERVERLOCATION + '/scoreswithtimes',requestSetup)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          if (data.status === -1){
            printWordleGameBoard(data.message);
          }else{
            getWordleScores("Your score has been submitted.")
          }
        })
    }else{
      document.getElementById('gameScreen').innerHTML = ReactDOMServer(
        loginFunctionality({score: score, gameID: 3})
      )
      //ask that the user logs in FIX THIS
      // pass a dictionary to a new object in a new file
    }
  }
  //Checking For Validity
  function checkPreviouslyUsed(){
    //return true if current word has been previously used
    for (let i = 0; i < guesses.length; i++){
      if (guesses[i].toUpperCase() === currentGuess.toUpperCase()){
        return true;
      }
    }
    return false;
  }
  //Advancement
  function nextWordStage(increment = 0){
    wordLength += increment;
    currentWord = produceWord(wordLength);
    currentGuess = "";
    guesses = [];
    printInitialContent();
    document.addEventListener('keydown',detectKeyPress);
  }
  //Pages
  function startWordleGame(){
    score = 0;
    wordLength = 5;
    currentWord = produceWord(wordLength);
    currentGuess = "";
    guesses = [];
    printInitialContent();
    document.removeEventListener('keydown',detectOnlyRestart);
    document.addEventListener('keydown',detectKeyPress);
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
