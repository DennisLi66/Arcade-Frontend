import React from "react";
import Button from 'react-bootstrap/Button'
import ReactDOMServer from 'react-dom/server';
import Cookies from 'universal-cookie';
import Table from 'react-bootstrap/Table'
import fisherYatesShuffle from "../helpers/fisherYatesShuffle.ts";
import loginFunctionality from "../loginFunctionality/loginFunctionality"
import millisecondsToReadableTime from "../helpers/timeConversion.ts";
import flagPNG from './minesweeperImages/flag.png'
import square1 from './minesweeperImages/square1.png'
import square0 from './minesweeperImages/square0.png'
import square2 from './minesweeperImages/square2.png'
import square3 from './minesweeperImages/square3.png'
import square4 from './minesweeperImages/square4.png'
import square5 from './minesweeperImages/square5.png'
import square6 from './minesweeperImages/square6.png'
import square7 from './minesweeperImages/square7.png'
import square8 from './minesweeperImages/square8.png'
import death from './minesweeperImages/death.png'
require('dotenv').config();

//Consider adding pause to minesweeper FIX THIS

function MineSweeper(){
  const cookies = new Cookies();
  var minesweeperBoard = []; //14 high by 18 wide
  var revealedBoard = [];
  const mines = 40;
  var startingTime, endingTime = 0;
  var flagsPlaced = 0;

  function setBoard(){//randomly place mines
    var randomMines = [];
    minesweeperBoard = [];
    revealedBoard = [];
    flagsPlaced = 0;
    for (let i = 0; i < 14*18; i++){
      randomMines.push(i);
      minesweeperBoard.push(0);
      revealedBoard.push(0);
    }
    //scramble randomMines and pick the first 40;
    randomMines = fisherYatesShuffle(randomMines);
    for (let i = 0; i < mines; i++){
      minesweeperBoard[randomMines.shift()] = -1;
    }
    //FIX THIS: Change Numbers to proximity to mines
    for (let i = 0; i < minesweeperBoard.length; i++){
      if (minesweeperBoard[i] === -1){
        if (i - 18 >= 0 && minesweeperBoard[i - 18] !== -1) minesweeperBoard[i - 18] = minesweeperBoard[i - 18] + 1 //Above
        if (i + 18 < 14*18 && minesweeperBoard[i + 18] !== -1) minesweeperBoard[i + 18] = minesweeperBoard[i + 18] + 1 //Below
        if (i % 18 !== 0 && minesweeperBoard[i - 1] !== -1) minesweeperBoard[i - 1] = minesweeperBoard[i - 1] + 1; //Left
        if ((i + 1) % 18 !== 0 && minesweeperBoard[i + 1] !== -1) minesweeperBoard[i + 1] = minesweeperBoard[i + 1] + 1; //Right
        if ( (i % 18 !== 0) && i - 19 >= 0 && minesweeperBoard[i - 19] !== -1) minesweeperBoard[i - 19] = minesweeperBoard[i - 19] + 1; //Above Left
        if ( (i % 18 !== 0) && (i + 17 < 14*18) && (minesweeperBoard[i + 17] !== -1)) minesweeperBoard[i + 17] = minesweeperBoard[i + 17] + 1 //Below Left
        if ( ((i + 1) % 18 !== 0) && i - 17 >= 0 && minesweeperBoard[i - 17] !== -1) minesweeperBoard[i - 17] = minesweeperBoard[i - 17] + 1; //Above Right
        if ( ((i + 1) % 18 !== 0) && (i + 19 < 14*18) && minesweeperBoard[i + 19] !== -1) minesweeperBoard[i + 19] = minesweeperBoard[i + 19] + 1; //Below Right
      }
    }
    document.getElementById('gameScreen').innerHTML = ReactDOMServer.renderToStaticMarkup(
      <div className='mineSweeperStack'>
        <div className='minesweeperBoard' id='minesweeperBoard'></div>
        <div className='mineSweeperScoreBoard' id='mineSweeperScoreBoard'></div>
      </div>
    )
  }
  function startMineSweeperGame(){
    document.addEventListener('keydown',detectRestart)
    setBoard();
    printMineSweeperBoard();
    printMineSweeperScoreBoard();
  }
  function printMineSweeperBoard(end=false){
    var board = [];
    for (let i = 0; i < minesweeperBoard.length; i++){
      if (revealedBoard[i] === 0) board.push(<div className='mineSweeperUnknownSquare' id={'square' + i} key={i}></div>);
      else if (revealedBoard[i] === -1) board.push(<img className='minesweeperBoardImage' id={'square' + i} src={flagPNG} alt='Marked' key={i}></img>)
      else{
        if (minesweeperBoard[i] !== -1){
          if (minesweeperBoard[i] === 1) board.push(<img className='minesweeperBoardImage' alt={board[i] + " mines around."} id={'square' + i}
          key={i} src={square1}></img>)
          else if (minesweeperBoard[i] === 2) board.push(<img className='minesweeperBoardImage' alt={board[i] + " mines around."} id={'square' + i}
          key={i} src={square2}></img>)
          else if (minesweeperBoard[i] === 3) board.push(<img className='minesweeperBoardImage' alt={board[i] + " mines around."} id={'square' + i}
          key={i} src={square3}></img>)
          else if (minesweeperBoard[i] === 4) board.push(<img className='minesweeperBoardImage' alt={board[i] + " mines around."} id={'square' + i}
          key={i} src={square4}></img>)
          else if (minesweeperBoard[i] === 5) board.push(<img className='minesweeperBoardImage' alt={board[i] + " mines around."} id={'square' + i}
          key={i} src={square5}></img>)
          else if (minesweeperBoard[i] === 6) board.push(<img className='minesweeperBoardImage' alt={board[i] + " mines around."} id={'square' + i}
          key={i} src={square6}></img>)
          else if (minesweeperBoard[i] === 7) board.push(<img className='minesweeperBoardImage' alt={board[i] + " mines around."} id={'square' + i}
          key={i} src={square7}></img>)
          else if (minesweeperBoard[i] === 8) board.push(<img className='minesweeperBoardImage' alt={board[i] + " mines around."} id={'square' + i}
          key={i} src={square8}></img>)
          else if (minesweeperBoard[i] === 0) board.push(<img className='minesweeperBoardImage' alt={board[i] + " mines around."} id={'square' + i}
          key={i} src={square0}></img>)
        }else{
          board.push(<img className='minesweeperBoardImage' alt={board[i] + " mines around."} id={'square' + i}
          key={i} src={death}></img>)
        }
      }
    }
    document.getElementById('minesweeperBoard').innerHTML = ReactDOMServer.renderToStaticMarkup(
      <>
        {board}
      </>
    )
    if (!end){
      for (let i = 0; i < 14*18; i++){
        document.getElementById('square' + i).oncontextmenu = function(){
          markSquare(i);
          return false;
        };
        document.getElementById('square' + i).onclick = function(){revealSquare(i)}
      }
    }
  }
  function printMineSweeperScoreBoard(end=false,message= false){
    var middleText = (<> You've Lost. </>);
    if (!end) middleText = (<>Flags Placed: {flagsPlaced} Total Mines: {mines}</>);
    else if (end && end === "Victory") middleText = (<><span className='errMsg'>{message}</span> Time: {millisecondsToReadableTime(endingTime)} <Button id='submitButton'>Submit Score</Button></>);
    document.getElementById('mineSweeperScoreBoard').innerHTML = ReactDOMServer.renderToStaticMarkup(
      <>
        <Button id='mainMenuButton'>Main Menu</Button>
        {middleText}
        <Button id='quickRestartButton'>Restart</Button>
      </>
    )
    document.getElementById('mainMenuButton').onclick = function(){getMineSweeperMainMenu()};
    document.getElementById('quickRestartButton').onclick = function(){startMineSweeperGame()};
    if(end && end === "Victory") document.getElementById('submitButton').onclick = function(){submitMinesweeperScore()}
  }
  //Actions
  function markSquare(square){
    if (!startingTime) startingTime = Date.now();
    if (revealedBoard[square] === -1){
      revealedBoard[square] = 0;
      flagsPlaced--;
    }else if (revealedBoard[square] === 0) {
      revealedBoard[square] = -1;
      flagsPlaced++;
    }
    printMineSweeperBoard();
    printMineSweeperScoreBoard();
  }
  function revealSquare(square){
    if (!startingTime) startingTime = Date.now();
    revealedBoard[square] = 1;
    if (minesweeperBoard[square] === -1) showLossScreen();
    else if (minesweeperBoard[square] !== -1){
      if (minesweeperBoard[square] === 0){
        revealSurroundings(square);
      }
      if (detectVictory()){
        showVictoryScreen();
      }
      else{
        printMineSweeperBoard();
      }
    }
  }
  function revealSurroundings(i){
    revealedBoard[i] = 1;
    if (i - 18 >= 0 && minesweeperBoard[i - 18] !== -1 && revealedBoard[i - 18] === 0) { //Above
      revealedBoard[i - 18] = 1;
      if (minesweeperBoard[i - 18] === 0) revealSurroundings(i - 18);
    }
    if (i + 18 < 14*18 && minesweeperBoard[i + 18] !== -1 && revealedBoard[i + 18] === 0){ //Below
      revealedBoard[i + 18] = 1;
      if (minesweeperBoard[i + 18] === 0) revealSurroundings(i + 18);
    }
    if (i % 18 !== 0 && minesweeperBoard[i - 1] !== -1 && revealedBoard[i - 1] === 0){ //Left
      revealedBoard[i - 1] = 1;
      if (minesweeperBoard[i - 1] === 0) revealSurroundings(i - 1);
    }
    if ((i + 1) % 18 !== 0 && minesweeperBoard[i + 1] !== -1 && revealedBoard[i + 1] === 0){ //Right
      revealedBoard[i + 1] = 1;
      if (minesweeperBoard[i + 1] === 0) revealSurroundings(i + 1);
    }
    if ( (i % 18 !== 0) && i - 19 >= 0 && minesweeperBoard[i - 19] !== -1 && revealedBoard[i - 19] === 0){ //Above Left
      revealedBoard[i - 19] = 1;
      if (minesweeperBoard[i - 19] === 0) revealSurroundings(i - 19);
    }
    if ( (i % 18 !== 0) && (i + 17 < 14*18) && (minesweeperBoard[i + 17] !== -1) && revealedBoard[i + 17] === 0){//Below Left
      revealedBoard[i + 17] = 1;
      if (minesweeperBoard[i + 17] === 0) revealSurroundings(i + 17);
    }
    if ( ((i + 1) % 18 !== 0) && i - 17 >= 0 && minesweeperBoard[i - 17] !== -1 && revealedBoard[i - 17] === 0) { //Above Right
      revealedBoard[i - 17] = 1;
      if (minesweeperBoard[i - 17] === 0) revealSurroundings(i - 17);
    }
    if ( ((i + 1) % 18 !== 0) && (i + 19 < 14*18) && minesweeperBoard[i + 19] !== -1 && revealedBoard[i + 19] === 0){//Below Right
      revealedBoard[i + 19] = 1;
      if (minesweeperBoard[i + 19] === 0) revealSurroundings(i + 19);
    }
    printMineSweeperBoard();
  }
  //Victory and Loss
  function detectVictory(){
    for (let i = 0; i < minesweeperBoard.length; i++){
      if (revealedBoard[i] === 0 && minesweeperBoard[i] !== -1) return false;
    }
    return true;
  }
  function detectRestart(key){
    if (key.keyCode === 82) startMineSweeperGame();
  }
  function showVictoryScreen(){
    document.removeEventListener('keydown',detectRestart);
    endingTime = Date.now() - startingTime;
    for (let i = 0; i < revealedBoard.length; i++){
      revealedBoard[i] = 1;
    }
    printMineSweeperBoard(true);
    printMineSweeperScoreBoard("Victory");
  }
  function showLossScreen(){
    for (let i = 0; i < revealedBoard.length; i++){
      revealedBoard[i] = 1;
    }
    printMineSweeperBoard(true);
    printMineSweeperScoreBoard("Victory");
  }
  function submitMinesweeperScore(){
    if (cookies.get("id")){
      const requestSetup = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({userID:cookies.get("id"),gameID:4,
        timeInMilliseconds: endingTime,sessionID:cookies.get("sessionID")}) //FIX THIS: IF I ADD DIFFICULTY, CHANGE GAMEIDS
      }
      fetch(process.env.REACT_APP_SERVERLOCATION + '/scoreswithtimes',requestSetup)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          if (data.status === -1){
            printMineSweeperScoreBoard("Victory",data.message);
          }else{
            getMineSweeperScoresPage("Your score has been submitted.")
          }
        })
    }else{
      document.getElementById('gameScreen').innerHTML = ReactDOMServer.renderToStaticMarkup(
        loginFunctionality({timeInMilliseconds: endingTime, gameID: 4})
      )
      //ask that the user logs in FIX THIS
      // pass a dictionary to a new object in a new file
    }
  }
  //Get Pages
  function getMineSweeperMainMenu(){
    document.getElementById('gameScreen').innerHTML = ReactDOMServer.renderToStaticMarkup(
      <>
      <h1> Tetris </h1>
      <Button id='startGameButton'>Start Game</Button><br></br>
      <Button id='instructionsButton'>Read Instructions</Button><br></br>
      <Button id='scoresButton'>Scores</Button><br></br>
      </>
    );
    document.getElementById('startGameButton').onclick = function(){startMineSweeperGame()};
    document.getElementById('instructionsButton').onclick = function(){readMineSweeperInstructions()};
    document.getElementById('scoresButton').onclick = function(){getMineSweeperScoresPage()};
  }
  function readMineSweeperInstructions(){
    document.getElementById('gameScreen').innerHTML = ReactDOMServer.renderToStaticMarkup(
      <>
        <Button id='backButton'>Back</Button><br></br>
        <h1> Instructions </h1>
        <div>
          <p>In Minesweeper, your objective is to reveal all the tiles on the board that are not mines. </p>
          <p>Clicking on a mine will cause you to lose the game,
          while clicking on a tile without a mine will reveal the tile and the tiles near it that are not mines.</p>

          <p>Controls:</p>
          <p>Click on a tile to reveal it.</p>
          <p>Right click on a tile to mark it as a mine. Right click on a tile again to remove that mark if needed.</p>
          <p>Press the R button to quickly restart the game if needed.</p>
        </div>
      </>
    )
    document.getElementById("backButton").onclick = function(){getMineSweeperMainMenu()};
  }
  function getMineSweeperScoresPage(message = "", rule = "", results = [], start = 0, end = 10){
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
      fetch(process.env.REACT_APP_SERVERLOCATION + fetchString + '&gameID=4')
        .then(response => response.json())
        .then(data => {
          console.log(data.results);
          if (data.status === -1){
            // do nothing... FIX THIS
            console.log(data.message);
          }else{
            scoresHelperFunction(message,rule,data.results,start,end,scoreTitle);
          }
        })
    }else{ //use results instead
      scoresHelperFunction(message,rule,results,start,end,scoreTitle);
    }
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
      nextButton = (<Button onClick={getMineSweeperScoresPage("",rule,results,start + 10, end + 10)}> Next </Button>)
    }
    if (start > 0){
      prevButton = (<Button onClick={getMineSweeperScoresPage("",rule,results,Math.min(start - 10), Math.max(end - 10,10))}> Previous </Button>)
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
    document.getElementById('backButton').onclick = function(){getMineSweeperMainMenu()};
    if (rule === "myrecent"){
      document.getElementById("personalScoresSwitch").onclick = function(){getMineSweeperScoresPage("","recent")};
      document.getElementById("otherMetricButton").onclick = function(){getMineSweeperScoresPage("","mybest")};
    }else if (rule === "mybest"){
      document.getElementById("personalScoresSwitch").onclick = function(){getMineSweeperScoresPage("","best")};
      document.getElementById("otherMetricButton").onclick = function(){getMineSweeperScoresPage("","myrecent")};
    }else if (rule === "recent"){
      if (cookies.get("id")){
        document.getElementById("personalScoresSwitch").onclick = function(){getMineSweeperScoresPage("","myrecent")};
      }
      document.getElementById("otherMetricButton").onclick = function(){getMineSweeperScoresPage("","best")};
    }else if (rule === "best" || rule === ""){
      if (cookies.get("id")){
        document.getElementById("personalScoresSwitch").onclick = function(){getMineSweeperScoresPage("","mybest")};
      }
      document.getElementById("otherMetricButton").onclick = function(){getMineSweeperScoresPage("","recent")};
    }
  }
  return (
    <div className='gameScreen' id='gameScreen'>
      <h1> Minesweeper </h1>
      <Button onClick={()=>{startMineSweeperGame()}}>Start Game</Button><br></br>
      <Button onClick={()=>{readMineSweeperInstructions()}}>Read Instructions</Button><br></br>
      <Button onClick={()=>{getMineSweeperScoresPage()}}>Scores</Button><br></br>
    </div>
  )
}

export default MineSweeper;
