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
      slotIntoFreeSpace();
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
      else if (key.key === "ArrowDown") moveDown();
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
    function moveDown(){
      $('body').off('keydown',detectKeyPress);
      var loc1 = numberConvert(currentOccupyingSpaces[0]);
      var loc2 = numberConvert(currentOccupyingSpaces[1]);
      while (
        gameBoard[loc1[0] + 1][loc1[1]] === 0 
     && gameBoard[loc2[0] + 1][loc2[1]] === 0 
      ){
        currentOccupyingSpaces = [currentOccupyingSpaces[0] + 6,currentOccupyingSpaces[1] + 6,currentOccupyingSpaces[2]];
        loc1 = numberConvert(currentOccupyingSpaces[0]);
        loc2 = numberConvert(currentOccupyingSpaces[1]);
        printBoard();
      }
      gameBoard[loc1[0]][loc1[1]] = currentPiece[0]; 
      gameBoard[loc2[0]][loc2[1]] = currentPiece[1];
      printBoard();
      clearBoardConnections(loc1,loc2);
    }
    function clearBoardConnections(loc1,loc2){
      var toDelete = [...check8SquaresAround(loc1), ...check8SquaresAround(loc2),...checkWhiteBlocks(loc1),...checkWhiteBlocks(loc2)];
      for (let i = 0; i < toDelete.length; i++){
        //console.log(toDelete[i]); Can Delete Later
        //FIX THIS: could wait a second here for better visual feedback.
        //FIX THIS: add score increasing
        gameBoard[toDelete[i][0]][toDelete[i][1]] = 0;
        printBoard();
      }
      if (toDelete.length === 0) detectLoss();
      else cascadeBlocks();
    }
    function cascadeBlocks(){ //recursively delete blocks
      //FIX THIS
      detectLoss();
    }
    function detectLoss(){
      currentPiece = nextPiece;
      if (!slotIntoFreeSpace()) showLoss();  
      else {
        $('body').on('keydown',detectKeyPress);
        nextPiece = generateDomino();
        printSideDisplay();
      }
      printBoard();
    }
    function showLoss(){
      $('body').off('keydown',detectKeyPress);
      printScoreBoard(true);
    }
    function slotIntoFreeSpace(){
      currentOccupyingSpaces = currentPiece[2] === 0 ? [8,9] : [9,15];
      var loc1 = numberConvert(currentOccupyingSpaces[0]);
      var loc2 = numberConvert(currentOccupyingSpaces[1]);
      if (!(gameBoard[loc1[0]][loc1[1]] === 0) || !(gameBoard[loc2[0]][loc2[1]] === 0)){
        if (currentPiece[2] === 0){
          if (gameBoard[1][1] === 0 && gameBoard[1][2] === 0){
            currentOccupyingSpaces = [7,8,0];
            return true;
          }else if (gameBoard[1][2] === 0 && gameBoard[1][3] === 0){
            currentOccupyingSpaces = [8,9,0];
            return true;
          }else if (gameBoard[1][3] === 0 && gameBoard[1][4] === 0){
            currentOccupyingSpaces = [9,10,0];
            return true;
          }
          currentOccupyingSpaces = [];
          return false;
        }else{
          if (gameBoard[1][1] === 0 && gameBoard[2][1] === 0){
            currentOccupyingSpaces = [7,13,1];
            return true;
          }else if (gameBoard[1][2] === 0 && gameBoard[2][2] === 0){
            currentOccupyingSpaces = [8,14,1];
            return true;
          }else if (gameBoard[1][3] === 0 && gameBoard[2][3] === 0){
            currentOccupyingSpaces = [9,15,1];
            return true;
          }else if (gameBoard[1][4] === 0 && gameBoard[2][4] === 0){
            currentOccupyingSpaces = [10,16,1];
            return true;
          }
          currentOccupyingSpaces = [];
          return false;
        }
      }
      return true;
    }
    // // //Printers
    function printInitialContent(){
      var reactScript = (
        <>
        {/* <h2>Domino Drop</h2> */}
        <div className = 'ddScreen' id='ddScreen'>
          <div className='ddSideBySide'>
            <div className='ddGameBoard' id='ddGameBoard'></div>
            <div className='ddSideDisplay' id='ddSideDisplay'></div>
          </div>
        </div>
        <div className='bulletinBoard' id='bulletinBoard'></div>
        </>
    );
    $("#gameScreen").html(ReactDOMServer.renderToStaticMarkup(reactScript));
    printAllContent();
    }
    function printAllContent(){
      printBoard();
      printSideDisplay();
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
      var submitButton = end ? (<Button id='submitButton'>Submit Score</Button>) : (<div></div>)
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
    function printSideDisplay(){
      //take next piece and write into box
      var blocks = [];
      for (let i = 0; i < 16; i++){
        blocks.push(<div key={i} className='ddSideBlock'></div>)
      }
      if (nextPiece[2] === 0){
        if (nextPiece[0] === 7) blocks[9] = (<div key={9} className='ddSidePaleBlock'></div>)
        else blocks[9] = (<img key={9} className='ddSideBlock' src={numToDice(nextPiece[0])}></img>);
        if (nextPiece[1] === 7) blocks[10] = (<div key={10} className='ddSidePaleBlock'></div>)
        else blocks[10] = (<img key={10} className='ddSideBlock' src={numToDice(nextPiece[1])}></img>);
      }else{
        if (nextPiece[0] === 7) blocks[5] = (<div key={9} className='ddSidePaleBlock'></div>)
        else blocks[5] = (<img className='ddSideBlock' key={9} src={numToDice(nextPiece[0])}></img>);
        if (nextPiece[1] === 7) blocks[9] = (<div key={10} className='ddSidePaleBlock'></div>)
        else blocks[9] = (<img className='ddSideBlock' key={10} src={numToDice(nextPiece[1])}></img>);
      }
      var text = (
        <div>
          <div className='ddSideTitle'><h4>Next Piece</h4></div>
          <div className="ddSideBlockDisplay">
            {blocks}
          </div>
        </div>
        );
      $('#ddSideDisplay').html(ReactDOMServer.renderToStaticMarkup(text));
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
            if (data.status === -1){
              printScoreBoard(end,data.message);
            }else{
              getScoresPage("Your score has been submitted.")
            }
          })
      }else cookieSetter({gameID: 7, score: score === 0 ? "0" : score});  
    }
    //Other
    function checkWhiteBlocks(loc, start = true){       //check 4 directions around and return a list of at least four blocks
      //FIX THIS -- need to check after cascading is added
      var domino = gameBoard[loc[0]][loc[1]];
      if (domino !== 7) return [];
      else{
        //if less than 4 results return empty list
        //else return list
        var dominos = [];
        if (1 < loc[0] && gameBoard[loc[0] - 1][loc[1]] === domino) dominos.push( ...checkWhiteBlocks([loc[0] - 1,loc[1]],false));
        if (loc[0] < 12 && gameBoard[loc[0] + 1][loc[1]] === domino) dominos.push(...checkWhiteBlocks([loc[0] + 1,loc[1]],false));
        if (1 < loc[1] && gameBoard[loc[0]][loc[1] - 1] === domino) dominos.push(...checkWhiteBlocks([loc[0], loc[1] - 1]),false);
        if (loc[1] < 4 && gameBoard[loc[0]][loc[1] + 1] === domino) dominos.push(...checkWhiteBlocks([loc[0],loc[1] + 1]),false);
        if (!start) return dominos;
        else{
          if (dominos.length >= 4) return dominos;
          return [];
        }
    }
    function check8SquaresAround(loc){
      //check the 8 spaces around each domino
      var list = [];
      var domino = gameBoard[loc[0]][loc[1]];
      if (domino === 7) return [];
      //upwards
      if (1 < loc[0] && gameBoard[loc[0] - 1][loc[1]] === domino) list.push([loc[0] - 1,loc[1]]);
      //leftwards
      if (1 < loc[1] && gameBoard[loc[0]][loc[1] - 1] === domino) list.push([loc[0], loc[1] - 1]);
      //rightwards
      if (loc[1] < 4 && gameBoard[loc[0]][loc[1] + 1] === domino) list.push([loc[0],loc[1] + 1]);
      //downwards
      if (loc[0] < 12 && gameBoard[loc[0] + 1][loc[1]] === domino) list.push([loc[0] + 1,loc[1]]);
      //upleft
      if (1 < loc[1] && 1 < loc[0] && gameBoard[loc[0] - 1][loc[1] - 1] === domino) list.push([loc[0] - 1,loc[1] - 1]);
      //upright
      if (loc[1] < 4 && 1 < loc[0] && gameBoard[loc[0] - 1][loc[1] + 1] === domino) list.push([loc[0] - 1,loc[1] + 1]);
      //downleft
      if (1 < loc[1] && loc[0] < 12 && gameBoard[loc[0] + 1][loc[1] - 1] === domino) list.push([loc[0] + 1,loc[1] - 1]);
      //downright
      if (loc[1] < 4 && loc[0] < 12 && gameBoard[loc[0] + 1][loc[1] + 1] === domino) list.push([loc[0] + 1,loc[1] + 1]);
      //original domino
      if (list.length > 0) list.push(loc);
      return list;
    }
    function numberConvert(num){
      return [Math.floor(num/6),num%6];
    }
    function numToDice(num){
      return ['zero',oneDice,twoDice,threeDice,fourDice,fiveDice,sixDice][num];
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