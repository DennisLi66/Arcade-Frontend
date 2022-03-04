import React from "react";
import Button from 'react-bootstrap/Button'
import ReactDOMServer from 'react-dom/server';
import Cookies from 'universal-cookie';
import Table from 'react-bootstrap/Table'
import fisherYatesShuffle from "../helpers/fisherYatesShuffle.ts";
import loginFunctionality from "../loginFunctionality/loginFunctionality"
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

function MineSweeper(){
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
        }
      }
    }
  }
  function printMineSweeperScoreBoard(end=false){
    var middleText = (<> You've Lost. </>);
    if (!end) middleText = (<>Flags Placed: {flagsPlaced} Total Mines: {mines}</>);
    else if (end && end === "Victory") middleText = (<>Completed in {endingTime} milliseconds. <Button id='submitButton'>Submit Score</Button></>);
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
  }
  //Victory and Loss
  function detectVictory(){
    for (let i = 0; i < minesweeperBoard.length; i++){
      if (revealedBoard[i] === 0 && minesweeperBoard[i] !== -1) return false;
    }
    return true;
  }
  function showVictoryScreen(){
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
    var scoreFGH;
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

  }
  function getMineSweeperScoresPage(){

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
