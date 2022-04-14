import React from 'react';
import Button from 'react-bootstrap/Button'
import ReactDOMServer from 'react-dom/server';
import Cookies from 'universal-cookie';
import Table from 'react-bootstrap/Table'
import cookieSetter from '../helpers/setCookiesForGame.jsx';
import millisecondsToReadableTime from '../helpers/timeConversion.ts';
import $ from 'jquery'
require('dotenv').config();

function Two048(msg = ''){
  //Values
  const cookies = new Cookies();
  var gameBoard = [];
  var odds = [];
  var score, startTime, totalTime, moves = 0;
  var paused = false;
  //Menus
  function get2048MainMenu(){
    $('#gameScreen').html(ReactDOMServer.renderToStaticMarkup(
      <>
      <h1>2048</h1>
      <Button id='start2048Button'>Play 2048</Button><br></br>
      <Button id='two048InstructionsButton'>Read Instructions</Button><br></br>
      <Button id='two048ScoresButton'>Scores</Button><br></br>
      </>
    ));
    $('#start2048Button').click(function(){start2048Game()});
    $('#two048InstructionsButton').click(function(){read2048Instructions()});
    $('#two048ScoresButton').click(function(){get2048ScoresPage()});
  }
  function read2048Instructions(){
    $('#gameScreen').html(ReactDOMServer.renderToStaticMarkup(
      <>
        <Button id='backButton'>Back</Button><br></br>
        <h1> Instructions </h1>
        <div>
          <p>This game is based on the popular 2048 arcade game. Collide numbers of the same value together to combine them.</p>
          <p>Press an arrow key to move all tiles in that direction. If two tiles of the same number collide, they will combine.</p>
          <p>Press R to restart the game.</p>
          <p>Press the spacebar to pause the timer.</p>
        </div>
      </>
    ))
    $('#backButton').click(function(){get2048MainMenu()});
  }
  //Scores
  function submitScore(){
    if (cookies.get('id')){
      const requestSetup = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({userID:cookies.get('id'),gameID: 6, score: score,
        timeInMilliseconds: totalTime,sessionID:cookies.get('sessionID')}) //FIX THIS: IF I ADD DIFFICULTY, CHANGE GAMEIDS
      }
      fetch(process.env.REACT_APP_SERVERLOCATION + '/scoreswithtimes',requestSetup)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          if (data.status === -1){
            print2048ScoreBoard('loss',data.message);
          }else{
            get2048ScoresPage('Your score has been submitted.')
          }
        })
    }else{
      cookieSetter({timeInMilliseconds: totalTime, gameID: 6, score: score});
    }
  }
  function get2048ScoresPage(message = '', rule = '', results = [], start = 0, end = 10){
    var fetchString;
    var scoreTitle;
    if (rule === '' || rule === 'best'){//Get the best
      fetchString = '/scoreswithtimes?sortBy=top';
      scoreTitle = 'Top Scores';
    }else if (rule === 'recent'){
      fetchString = '/scoreswithtimes?sortBy=recent'
      scoreTitle = 'Recent Scores';
    }else if (rule === 'mybest'){
      fetchString = '/scoreswithtimes?sortBy=top&userID='  + cookies.get('id');
      scoreTitle = 'Your Top Scores';
    }else if (rule === 'myrecent'){
      fetchString = 'scoreswithtimes?sortBy=recent&userID=' + cookies.get('id');
      scoreTitle = 'Your Recent Scores';
    }
    if (results.length === 0){
      fetch(process.env.REACT_APP_SERVERLOCATION + fetchString + '&gameID=6')
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
    if (rule === 'myrecent'){
      otherMetricButton = (<Button id='otherMetricButton'> My Best Scores </Button>)
      personalScoresSwitchButton = (<Button id='personalScoresSwitch'> All Recent Scores </Button>)
    }else if (rule === 'mybest'){
      otherMetricButton = (<Button id='otherMetricButton'> My Recent Scores </Button>)
      personalScoresSwitchButton = (<Button id='personalScoresSwitch'> All Best Scores </Button>)
    }else if (rule === 'recent'){
      if (cookies.get('id')){
        personalScoresSwitchButton = (<Button id='personalScoresSwitch'> My Recent Scores </Button>)
      }
      otherMetricButton =  (<Button id='otherMetricButton'> All Best Scores </Button>)
    }else if (rule === 'best' || rule === ''){
      if (cookies.get('id')){
        personalScoresSwitchButton = (<Button id='personalScoresSwitch'> My Best Scores </Button>)
      }
      otherMetricButton =  (<Button id='otherMetricButton'> All Recent Scores </Button>)
    }
    var nextButton, prevButton;
    if (end < results.length){
      nextButton = (<Button onClick={get2048ScoresPage('',rule,results,start + 10, end + 10)}> Next </Button>)
    }
    if (start > 0){
      prevButton = (<Button onClick={get2048ScoresPage('',rule,results,Math.min(start - 10), Math.max(end - 10,10))}> Previous </Button>)
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
    $('#gameScreen').html(ReactDOMServer.renderToStaticMarkup(reactString));
    $('#backButton').click(function(){get2048MainMenu()});
    if (rule === 'myrecent'){
      $('#personalScoresSwitch').click(function(){get2048ScoresPage('','recent')});
      $('otherMetricButton').click(function(){get2048ScoresPage('','mybest')});
    }else if (rule === 'mybest'){
      $('#personalScoresSwitch').click(function(){get2048ScoresPage('','best')});
      $('#otherMetricButton').click(function(){get2048ScoresPage('','myrecent')});
    }else if (rule === 'recent'){
      if (cookies.get('id')){
        $('personalScoresSwitch').click(function(){get2048ScoresPage('','myrecent')});
      }
      $('#otherMetricButton').click(function(){get2048ScoresPage('','best')});
    }else if (rule === 'best' || rule === ''){
      if (cookies.get('id')){
        $('#personalScoresSwitch').click(function(){get2048ScoresPage('','mybest')});
      }
      $('#otherMetricButton').click(function(){get2048ScoresPage('','recent')});
    }
  }
  //Game Start
  function start2048Game(){
    create2048Board();
    printInitialContent();
    $('body').off('keydown',detectOnlyPauseOrRestart);
    $('body').off('keydown',detectOnlyRestart);
    $('body').on('keydown',detectDirectionalKeyDown);
  }
  function create2048Board(){
    gameBoard = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    score = 0;
    startTime = 0;
    totalTime = 0;
    paused = false;
    moves = 0;
    odds = [];
    generateStarterOdds();
    gameBoard[randomlyPickFreeSquare()] = 2;
    gameBoard[randomlyPickFreeSquare()] = 2;
  }
  //Algorithms
  function generateStarterOdds(){
    for (let i = 0; i < 30; i++) odds.push(2);
  }
  function updateOdds(number){
    if (!number) return;
    var copy = number;
    while (true){
      copy = Math.floor(copy/2);
      if (copy <= 1) return;
      else odds.push(copy);
    }
  }
  function randomlyPickFreeSquare(){
    var emptySlots = [];
    for (let i = 0; i < gameBoard.length; i++){
      if (gameBoard[i] === 0) emptySlots.push(i);
    }
    return emptySlots[Math.floor(Math.random() * (emptySlots.length))]
  }
  function areBoardsSame(x,y){
    for (let i = 0; i < x.length; i++){
      if (x[i] !== y[i]) return false;
    }
    return true;
  }
  function anyMovesRemaining(){
    for (let i = 0; i < gameBoard.length; i++){
      if (gameBoard[i] === 0) return true;
      if (i >= 4 && gameBoard[i] === gameBoard[i-4]) return true;
      if (i <= 11 && gameBoard[i] === gameBoard[i+4]) return true;
      if (i % 4 !== 0 && gameBoard[i] === gameBoard[i-1]) return true;
      if ((i + 1) % 4 !== 0 && gameBoard[i] === gameBoard[i+1]) return true;
    }
    return false;
  }
  function generateColorForSquare(number){
    var number1 = Math.min(255,(Math.log2(number) - 1) * 16);
    var choices = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'];
    return '#' + choices[Math.floor(number1/16)] + choices[number1 % 16] + '0000';
  }
  function randomNumberSelect(){
    return odds[Math.floor(Math.random() * (odds.length))];
  }
  //Detection
  function detectDirectionalKeyDown(key){
    if (key.key === 'ArrowLeft' ){
      shiftContents('left');
    }else if (key.key === 'ArrowRight'){
      shiftContents('right');
    }else if (key.key === 'ArrowDown' ){
      shiftContents('down');
    }else if (key.key === 'ArrowUp'){
      shiftContents('up');
    }
    else if (key.keyCode === 82) start2048Game();
    else if (key.keyCode === 32) pauseGame();
  }
  function detectOnlyPauseOrRestart(key){
    if (key.keyCode === 82) start2048Game();
    else if (key.keyCode === 32) pauseGame();
  }
  function detectOnlyRestart(key){
    if (key.keyCode === 82) start2048Game();
  }
  //Printers
  function printInitialContent(){
    $('#gameScreen').html(ReactDOMServer.renderToStaticMarkup(
      <>
      <div className = 'two048Screen' id='two048Screen'>
        <div className='two048GameBoard' id='two048GameBoard'></div>
        <div className='two048PauseScreen' id='two048PauseScreen'><div className='pauseText'><h1>PAUSED</h1><br></br><h3>Press Space to Unpause</h3></div></div>
      </div>
      <div className='bulletinBoard' id='bulletinBoard'></div>
      </>
    ))
    print2048Board();
    print2048ScoreBoard();
  }
  function print2048Board(){
    var squares = [];
    for (let i = 0; i < gameBoard.length; i++){
      squares.push(<div className='two048Tile' key={i} id={'square' + i}><h1>{gameBoard[i] === 0 ? '' : gameBoard[i]}</h1></div>)
    }
    $('#two048GameBoard').html(ReactDOMServer.renderToStaticMarkup(
      <div>
      {squares}
      </div>
    ))
    for (let i = 0; i < gameBoard.length; i++){
      if (gameBoard[i] !== 0){
        $('#square' + i).css('backgroundColor', generateColorForSquare(gameBoard[i]));
      }
    }
  }
  function print2048ScoreBoard(end=false,message=''){
    if (end) {
      totalTime += Date.now() - startTime;
      $('body').off('keydown',detectDirectionalKeyDown)
      $('body').on('keydown',detectOnlyRestart);
    }
    $('#bulletinBoard').html(ReactDOMServer.renderToStaticMarkup(
      <div>
      <Button id='mainMenuButton'>Main Menu</Button>
      {message + ' '}
      Score: {score}
      {end ? ' Total Time: ' + millisecondsToReadableTime(totalTime) : ''}
      {end ? ' Total Moves ' + moves : ''}
      <Button id='restartButton'>Restart</Button>
      {end ? (<Button id='submitButton'>Submit Score</Button>) : (<div></div>)}
      </div>
    ))
    $('#restartButton').click(function(){start2048Game()});
    $('#mainMenuButton').click(function(){get2048MainMenu()});
    if (end) $('#submitButton').click(function(){submitScore()});
  }
  //Player Actions
  function pauseGame(){
    if (paused){
      paused = false;
      startTime = Date.now();
      $('body').on('keydown',detectDirectionalKeyDown);
      $('body').off('keydown',detectOnlyPauseOrRestart)
      $('#two048PauseScreen').css('visibility','hidden');
    }else{
      paused = true;
      totalTime += Date.now() - startTime;
      $('body').off('keydown',detectDirectionalKeyDown);
      $('body').on('keydown',detectOnlyPauseOrRestart);
      $('#two048PauseScreen').css('visibility','visible');
    }
  }
  function shiftContents(direction){
    var blocked = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    var prevBoardState = [...gameBoard];
    if (direction === 'left'){
      for (let i = 0; i < gameBoard.length; i++){
        var newf = i;
        while (newf % 4 !== 0){
          if (gameBoard[newf - 1] === 0){
            gameBoard[newf - 1] = gameBoard[newf];
            gameBoard[newf] = 0;
            newf--;
          }else if (gameBoard[newf - 1] === gameBoard[newf] && !blocked[newf-1]){
            gameBoard[newf-1] = gameBoard[newf-1]*2;
            score += gameBoard[newf-1];
            updateOdds(gameBoard[newf-1]);
            gameBoard[newf] = 0;
            newf--;
            blocked[newf] = true;
          }else break;
        }
      }
    }else if (direction === 'right'){
      for (let i = gameBoard.length - 1; i >= 0; i--){
        var newg = i;
        while ((newg + 1) % 4 !== 0){
          if (gameBoard[newg + 1] === 0){
            gameBoard[newg+1] = gameBoard[newg];
            gameBoard[newg] = 0;
            newg++;
          }else if (gameBoard[newg+1] === gameBoard[newg] && !blocked[newg+1]){
            gameBoard[newg+1] = gameBoard[newg+1] * 2;
            score += gameBoard[newg+1];
            updateOdds(gameBoard[newg+1]);
            gameBoard[newg] = 0;
            newg = newg++;
            blocked[newg] = true;
          }else break;
        }
      }
    }else if (direction === 'down'){
      for (let i = gameBoard.length - 1; i >= 0; i--){
        var newI = i;
        while (newI < gameBoard.length - 4){
          if (gameBoard[newI+4] === 0){
            gameBoard[newI+4] = gameBoard[newI];
            gameBoard[newI] = 0;
            newI = newI + 4;
          }else if (gameBoard[newI+4] === gameBoard[newI] && !blocked[newI + 4]){
            gameBoard[newI+4] = gameBoard[newI+4] * 2;
            score += gameBoard[newI+4];
            updateOdds(gameBoard[newI+4]);
            gameBoard[newI] = 0;
            newI = newI + 4;
            blocked[newI] = true;
          }else break;
        }
      }
    }else if (direction === 'up'){
      for (let i = 0; i < gameBoard.length; i++){
        var newX = i;
        while (newX >= 4){
          if (gameBoard[newX-4] === 0){
            gameBoard[newX-4] = gameBoard[newX];
            gameBoard[newX] = 0;
            newX = newX - 4;
          }else if (gameBoard[newX-4] === gameBoard[newX] && !blocked[newX - 4]){
            gameBoard[newX-4] = gameBoard[newX-4] * 2;
            score += gameBoard[newX-4]
            updateOdds(gameBoard[newX-4])
            gameBoard[newX] = 0;
            newX = newX - 4;
            blocked[newX] = true;
          }else break;
        }
      }
    }
    if (!areBoardsSame(prevBoardState,gameBoard)){
      if (!startTime) startTime = Date.now();
      moves++;
      gameBoard[randomlyPickFreeSquare()] = randomNumberSelect();
    }
    print2048Board();
    if (!anyMovesRemaining()) print2048ScoreBoard('lose');
    else print2048ScoreBoard();
  }
  return (
    <div className='gameScreen' id='gameScreen'>
      <h1>2048</h1>
      {(msg !== '') ?  <div className='confMsg'>{msg}</div>  : ''}
      <Button onClick={start2048Game}>Play 2048</Button><br></br>
      <Button onClick={read2048Instructions}>Read Instructions</Button><br></br>
      <Button onClick={get2048ScoresPage}>Scores</Button><br></br>
    </div>
    )
}

export default Two048;
