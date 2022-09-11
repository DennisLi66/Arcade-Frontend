import React from "react";
import Button from 'react-bootstrap/Button'
import ReactDOMServer from 'react-dom/server';
import Cookies from 'universal-cookie';
import Table from 'react-bootstrap/Table'
import cookieSetter from "../helpers/setCookiesForGame.jsx";
import produceWord from "../helpers/produceWord.ts";
import $ from 'jquery'
require('dotenv').config();

//gameScreen consists of psudeo input text box with blocks, game board with current guesses, and the score board
//add highlight to current character, also clicking a box should let you change that box?

function Wordle(msg = ""){
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
    $("#gameScreen").html(ReactDOMServer.renderToStaticMarkup(reactScript));
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
    $("#WordleBulletinBoard").html(ReactDOMServer.renderToStaticMarkup(
      (
        <>
          {text}
          {middleText}
          {quickRestartButton}
        </>
      )
    ));
    $("#returnButton").click(function(){getWordleFrontPage()});
    if (currentWord !== "") $("#quickRestartButton").click(function(){startWordleGame()});
  }
  function printWordleLossBulletinBoard(){
    var text = (<Button id='returnButton'>Main Menu</Button>);
    var middleText = (" Final Score: " + score + " ");
    var quickRestartButton = (<Button id="quickRestartButton">Restart</Button>);
    var submitAndQuitButton = (<Button id='submitAndQuitButton'>Submit Score</Button>);
    $("#WordleBulletinBoard").html(ReactDOMServer.renderToStaticMarkup(
      (
        <>
          {text}
          {middleText}
          {submitAndQuitButton}
          {quickRestartButton}
        </>
      )
    ));
    $("#returnButton").click(function(){getWordleFrontPage()});
    $("#quickRestartButton").click(function(){startWordleGame()});
    $("#submitAndQuitButton").click(function(){submitScoreAndEndGame()});
  }
  function printWordleWinBulletinBoard(){
    var middleText = (" Current Score: " + score + " ");
    var advanceLengthButton;
    if (wordLength < 8) advanceLengthButton = (<Button id='advanceLengthButton'>Increase Word Length</Button>);
    var decreaseLengthButton;
    if (wordLength > 3) decreaseLengthButton = (<Button id='decreaseLengthButton'>Decrease Word Length</Button>);
    var submitAndQuitButton = (<Button id='submitAndQuitButton'>Submit Score and End Game</Button>);
    var continueButton = (<Button id='continueButton'>Continue</Button>)
    $("#WordleBulletinBoard").html(ReactDOMServer.renderToStaticMarkup(
      <>
        {middleText}
        {decreaseLengthButton}
        {continueButton}
        {advanceLengthButton}
        {submitAndQuitButton}
      </>
    ));
    if (wordLength < 8) $("#advanceLengthButton").click(function(){nextWordStage(1)});
    if (wordLength > 3) $("#decreaseLengthButton").click(function(){nextWordStage(-1)});
    $("#submitAndQuitButton").click(function(){submitScoreAndEndGame()});
    $("#continueButton").click(function(){nextWordStage()});
  }
  function printWordleGameBoard(){
    var wordsToPrint = [];
    for (let i = 0 ; i < guesses.length; i++){
      var letters = [];
      var copyOfWord = [];
      var colors = [];
      for (let y = 0; y < currentWord.length; y++){
        copyOfWord.push(currentWord[y]);
        colors.push("white");
      }
      for (let x = 0; x < guesses[i].length; x++){
        if (guesses[i][x].toUpperCase() === currentWord[x].toUpperCase()){
          colors[x] = "green";
          copyOfWord[x] = '_';
        }
      }
      for (let x = 0; x < colors.length; x++){
        if (colors[x] === 'green') continue;
        else{
          for (let t = 0; t < copyOfWord.length; t++){
            if (copyOfWord[t].toUpperCase() === guesses[i][x].toUpperCase()){
              colors[x] = 'yellow';
              copyOfWord[t] = '_';
              break;
            }
          }
        }
      }
      console.log(colors);
      for (let g = 0; g < colors.length; g++){
          if (colors[g] === "white") letters.push(<div className='WordleMiniBox' key={g}>{guesses[i][g].toUpperCase()}</div>);
          else if (colors[g] === "green") letters.push(<div className='WordleGreenBox' key={g}>{guesses[i][g].toUpperCase()}</div>);
          else letters.push(<div className='WordleYellowBox' key={g}>{guesses[i][g].toUpperCase()}</div>);
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
    $('#guessBoxes').html(ReactDOMServer.renderToStaticMarkup(
      <>
      <h2>Guesses</h2>
      {wordsToPrint}
      </>
    ))
  }
  function printWordleTextBox(message = ""){
    var letterBoxes = [];
    for (let i = 0; i < currentGuess.length; i++){
      letterBoxes.push(<div className='WordleMiniBox' key={i}>{currentGuess[i].toUpperCase()}</div>)
    }
    while (letterBoxes.length < wordLength){
      letterBoxes.push(<div className='WordleMiniBox' key={letterBoxes.length}></div>)
    }
    $('#WordleTextBox').html(ReactDOMServer.renderToStaticMarkup(
      <>
        <h4>Your Current Guess</h4>
        <h5> {message} </h5>
        <div className='WordleBoxesHolder'>
          <Button id='wordleClearButton'>Clear</Button>
          {letterBoxes}
          <Button id='wordleSubmitButton'>Submit</Button>
        </div>
      </>
    ));
    $('#wordleSubmitButton').click(function(){submitGuess()});
    $('#wordleClearButton').click(function(){currentGuess = ""; printWordleTextBox()});
  }
  function printWordleLossTextBox(){
    var letterBoxes = [];
    for (let i = 0; i < currentWord.length; i++){
      letterBoxes.push(<div className='WordleMiniBox' key={i}>{currentWord[i].toUpperCase()}</div>)
    };
    $('#WordleTextBox').html(ReactDOMServer.renderToStaticMarkup(
      <>
        <h4>The Actual Word</h4>
        <div className='WordleBoxesHolder'>
          {letterBoxes}
        </div>
      </>
    ));
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
    $('body').off('keydown',detectKeyPress);
    const guessRatio = [25,15,10,6,3,1];
    score += guessRatio[guesses.length] * (1 + Math.abs(5-wordLength));
    guesses.push(currentGuess);
    printWordleGameBoard();
    printWordleTextBox();
    printWordleWinBulletinBoard();
  }
  function showLossScreen(){
    $('body').off('keydown',detectKeyPress);
    $('body').on('keydown',detectOnlyRestart);
    printWordleGameBoard();
    printWordleLossTextBox();
    printWordleLossBulletinBoard();
  }
  function submitScoreAndEndGame(){
    if (cookies.get("id")){
      const requestSetup = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({userID:cookies.get("id"),score:score,gameID:3
        ,sessionID:cookies.get("sessionID")})
      }
      fetch(process.env.REACT_APP_SERVERLOCATION + '/scores',requestSetup)
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
      cookieSetter({score: score, gameID: 3});
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
    $('body').on('keydown',detectKeyPress);
  }
  //Pages
  function startWordleGame(){
    score = 0;
    wordLength = 5;
    currentWord = produceWord(wordLength);
    currentGuess = "";
    guesses = [];
    printInitialContent();
    $('body').off('keydown',detectOnlyRestart);
    $('body').on('keydown',detectKeyPress);
  }
  function readWordleInstructions(){
    $('#gameScreen').html(ReactDOMServer.renderToStaticMarkup(
      <>
        <Button id='backButton'>Back</Button><br></br>
        <h1> Instructions </h1>
        <div>
          <p> Wordle is a game about guessing the secret word. </p>
          <p> Type in a word and submit it in to see how your entry compares to the answer.</p>
          <p> If a letter is green, it is present in the word and at that position of that word.</p>
          <p> If a letter is yellow, it is present in the word, but not at that position. </p>
          <p> If a letter is colorless, it is not present in the word in any position. </p>
        </div>
      </>
    ));
    $("#backButton").click(function(){getWordleFrontPage()});
  }
  function getWordleScores(message = "", rule = "", results = [], start = 0, end = 10){
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
      fetch(process.env.REACT_APP_SERVERLOCATION + fetchString + '&gameID=3')
        .then(response => response.json())
        .then(data => {
          console.log(data.results);
          if (data.status === -1){
            // console.log(data.message);
            wordleScoresHelperFunction(data.message,rule,data.results,start,end,scoreTitle);
          } else if (!data.results) wordleScoresHelperFunction("Oops! Received Faulty Information From Server...",rule,[],start,end,scoreTitle);
          else wordleScoresHelperFunction(message,rule,data.results,start,end,scoreTitle);
        })
    }else wordleScoresHelperFunction(message,rule,results,start,end,scoreTitle);
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
      if (cookies.get("id")) personalScoresSwitchButton = (<Button id='personalScoresSwitch'> My Recent Scores </Button>)
      otherMetricButton =  (<Button id='otherMetricButton'> All Best Scores </Button>)
    }else if (rule === "best" || rule === ""){
      if (cookies.get("id")) personalScoresSwitchButton = (<Button id='personalScoresSwitch'> My Best Scores </Button>)
      otherMetricButton =  (<Button id='otherMetricButton'> All Recent Scores </Button>)
    }
    var nextButton, prevButton;
    if (end < results.length) nextButton = (<Button onClick={getWordleScores("",rule,results,start + 10, end + 10)}> Next </Button>)
    if (start > 0) prevButton = (<Button onClick={getWordleScores("",rule,results,Math.min(start - 10), Math.max(end - 10,10))}> Previous </Button>)
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
    $('#backButton').click(function(){getWordleFrontPage()});
    if (rule === "myrecent"){
      $("#personalScoresSwitch").click(function(){getWordleScores("","recent")});
      $("#otherMetricButton").click(function(){getWordleScores("","mybest")});
    }else if (rule === "mybest"){
      $("#personalScoresSwitch").click(function(){getWordleScores("","best")});
      $("#otherMetricButton").click(function(){getWordleScores("","myrecent")});
    }else if (rule === "recent"){
      if (cookies.get("id")) $("#personalScoresSwitch").click(function(){getWordleScores("","myrecent")});
      $("#otherMetricButton").click(function(){getWordleScores("","best")});
    }else if (rule === "best" || rule === ""){
      if (cookies.get("id")) $("#personalScoresSwitch").click(function(){getWordleScores("","mybest")});
      $("#otherMetricButton").click(function(){getWordleScores("","recent")});
    }
  }
  function getWordleFrontPage(){
    $('body').off('keydown',detectOnlyRestart);
    $('body').off('keydown',detectKeyPress);
    $('#gameScreen').html(ReactDOMServer.renderToStaticMarkup(
      <>
        <h1> Wordle </h1>
        <Button id='startGameButton' >Start Game</Button><br></br>
        <Button id='instructionsButton'>Read Instructions</Button><br></br>
        <Button id='scoresButton'>Scores</Button><br></br>
      </>
    ));
    $("#startGameButton").click(function(){startWordleGame()});
    $("#instructionsButton").click(function(){readWordleInstructions()});
    $("#scoresButton").click(function(){getWordleScores()});
  }
  ////
  return (
    <div className='gameScreen' id='gameScreen'>
      <h1> Wordle </h1>
      {(msg !== "") ?  <div className='confMsg'>{msg}</div>  : ""}
      <Button onClick={()=>{startWordleGame()}}>Start Game</Button><br></br>
      <Button onClick={()=>{readWordleInstructions()}}>Read Instructions</Button><br></br>
      <Button onClick={()=>{getWordleScores()}}>Scores</Button><br></br>
    </div>
  )
}

export default Wordle;
