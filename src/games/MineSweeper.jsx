import React from "react";
import Button from 'react-bootstrap/Button'
import ReactDOMServer from 'react-dom/server';
import Cookies from 'universal-cookie';
import Table from 'react-bootstrap/Table'
import fisherYatesShuffle from "../helpers/fisherYatesShuffle.ts";
import loginFunctionality from "../loginFunctionality/loginFunctionality"
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
        if (i - 18 >= 0) minesweeperBoard[i - 18] = minesweeperBoard[i - 18] + 1 //Above
        if (i + 18 < 14*18) minesweeperBoard[i + 18] = minesweeperBoard[i + 18] + 1 //Below
        if (i % 18 !== 0) minesweeperBoard[i - 1] = minesweeperBoard[i - 1] + 1; //Left
        if (i + 1 % 18 !== 0) minesweeperBoard[i + 1] = minesweeperBoard[i + 1] + 1; //Right
        if ( (i % 18 !== 0) && i - 19 >= 0) minesweeperBoard[i - 19] = minesweeperBoard[i - 19] + 1; //Above Left
        if ( (i % 18 !== 0) && (i + 17 < 14*18)) minesweeperBoard[i + 17] = minesweeperBoard[i + 17] + 1 //Below Left
        if ( (i + 1 % 18 !== 0) && i - 17 >= 0) minesweeperBoard[i - 17] = minesweeperBoard[i - 17] + 1; //Above Right
        if ( (i + 1 % 18 !== 0) && (i + 19 < 14*18)) minesweeperBoard[i + 19] = minesweeperBoard[i + 19] + 1; //Below Right
      }
    }
    document.getElementById('gameScreen').innerHTML = ReactDOMServer.renderToStaticMarkup(
      <div className='mineSweeperStack'>
        <div className='minesweeperBoard'></div>
        <div className='mineSweeperScoreBoard'></div>
      </div>
    )
  }
  function startMineSweeperGame(){
    setBoard();
    printMineSweeperBoard();
    printMineSweeperScoreBoard();
  }
  function printMineSweeperBoard(){
    //      minesweeperBoard.push(<div className='mineSweeperUnknownSquare' id={'square' + i} key={i}></div>)
    for (let i = 0; i < minesweeperBoard.length; i++){
      // if (){
      //
      // }
    }
  }
  function printMineSweeperScoreBoard(){
    document.getElementById('mineSweeperScoreBoard').innerHTML = ReactDOMServer.renderToStaticMarkup(
      <>
        <Button id='mainMenuButton'>Main Menu</Button>
        Flags Placed: {flagsPlaced} Total Mines: {mines}
        <Button id='quickRestartButton'>Restart</Button>
      </>
    )
    document.getElementById('mainMenuButton').onclick = function(){getMineSweeperMainMenu()};
    document.getElementById('quickRestartButton').onclick = function(){startMineSweeperGame()};
  }
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
      <h1> Tetris </h1>
      <Button onClick={()=>{startMineSweeperGame()}}>Start Game</Button><br></br>
      <Button onClick={()=>{readMineSweeperInstructions()}}>Read Instructions</Button><br></br>
      <Button onClick={()=>{getMineSweeperScoresPage()}}>Scores</Button><br></br>
    </div>
  )
}

export default MineSweeper;
