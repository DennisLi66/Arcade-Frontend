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
  const mines = 40;
  var startingTime, endingTime = 0;
  var flagsPlaced = 0;

  function setBoard(){//randomly place mines
    var randomMines = [];
    minesweeperBoard = [];
    flagsPlaced = 0;
    for (let i = 0; i < 14*18; i++){
      randomMines.push(i);
      minesweeperBoard.push(0);
    }
    //scramble randomMines and pick the first 40;
    randomMines = fisherYatesShuffle(randomMines);
    for (let i = 0; i < mines; i++){
      minesweeperBoard[randomMines.shift()] = 1;
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
    // for (let i = 0; i < minesweeperBoard.length; i++){
    //
    // }
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
