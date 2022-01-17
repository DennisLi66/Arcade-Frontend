import React from "react";
import Button from 'react-bootstrap/Button'
import ReactDOMServer from 'react-dom/server';
import Cookies from 'universal-cookie';
import Table from 'react-bootstrap/Table'
require('dotenv').config();

function Tetris(){
  const cookies = new Cookies();
  var gameBoard = [];
  var score = 0;
  var startingTime = 0;
  var intervalID = "";
  var direction = false; //will also tell us if gamestarted
  var endingTime = 0;
  var timeTilDescent = 0;
  function setBoard(){

  }
  function startGame(){

  }
  function readInstructions(){
    document.getElementById('gameScreen').innerHTML = ReactDOMServer.renderToStaticMarkup(
      <div>
        <Button id='backButton'> Back </Button><br></br>
        <h1> Instructions </h1>
      </div>
    )
    document.getElementById("backButton").onclick = getFrontPage();
  }
  function getScoresPage(message = "", rule = "", results = [], start = 0, end = 10){
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
      fetch(process.env.REACT_APP_SERVERLOCATION + fetchString + '&gameID=1')
        .then(response => response.json())
        .then(data => {
          console.log(data.results);
          if (data.status === -1){
            // do nothing... FIX THIS
            console.log(data.message);
          }else{
            var listOfElements = [];
            for (let i = start; i < Math.min(data.results.length,end); i++){
              listOfElements.push(<tr key = {i}><td>{i + 1}</td> <td> {data.results[i][0]} </td> <td> {data.results[i][1]} </td> <td> {data.results[i][2]}</td> <td> {data.results[i][3]}</td> </tr>)
            }
            var otherMetricButton;
            var personalScoresSwitchButton;
            if (rule === "myrecent"){
              otherMetricButton = (<Button onClick={getScoresPage("","mybest")}> My Best Scores </Button>)
              personalScoresSwitchButton = (<Button onClick={getScoresPage("","recent")}> All Recent Scores </Button>)
            }else if (rule === "mybest"){
              otherMetricButton = (<Button onClick={getScoresPage("","myrecent")}> My Recent Scores </Button>)
              personalScoresSwitchButton = (<Button onClick={getScoresPage("","best")}> All Best Scores </Button>)
            }else if (rule === "recent"){
              if (cookies.get("id")){
                personalScoresSwitchButton = (<Button onClick={getScoresPage("","myrecent")}> My Recent Scores </Button>)
              }
              otherMetricButton =  (<Button onClick={getScoresPage("","best")}> All Best Scores </Button>)
            }else if (rule === "best"){
              if (cookies.get("id")){
                personalScoresSwitchButton = (<Button onClick={getScoresPage("","mybest")}> My Best Scores </Button>)
              }
              otherMetricButton =  (<Button onClick={getScoresPage("","recent")}> All Recent Scores </Button>)
            }
            var nextButton, prevButton;
            if (end < data.results.length){
              nextButton = (<Button onClick={getScoresPage("",rule,data.results,start + 10, end + 10)}> Next </Button>)
            }
            if (start > 0){
              prevButton = (<Button onClick={getScoresPage("",rule,data.results,Math.min(start - 10), Math.max(end - 10,10))}> Previous </Button>)
            }
            var reactString = (
              <div>
                <h1> {scoreTitle} </h1>
                <div> {otherMetricButton} {personalScoresSwitchButton} </div>
                <Table>
                <thead> <tr> <th> # </th> <th> Username </th> <th> Score </th> <th> Time </th> <th> Time Submitted </th> </tr> </thead>
                <tbody>
                {listOfElements}
                </tbody>
                </Table>
                <div>{prevButton}{nextButton}</div>
              </div>
            );
            document.getElementById('gameScreen').innerHTML = ReactDOMServer.renderToStaticMarkup(reactString);
          }
        })
    }else{ //use results instead
      var listOfElements = [];
      for (let i = start; i < Math.min(results.length,end); i++){
        listOfElements.push(<tr key = {i}><td>{i + 1}</td> <td> {results[i][0]} </td> <td> {results[i][1]} </td> <td> {results[i][2]}</td> <td> {results[i][3]}</td> </tr>)
      }
      var otherMetricButton;
      var personalScoresSwitchButton;
      if (rule === "myrecent"){
        otherMetricButton = (<Button onClick={getScoresPage("","mybest")}> My Best Scores </Button>)
        personalScoresSwitchButton = (<Button onClick={getScoresPage("","recent")}> All Recent Scores </Button>)
      }else if (rule === "mybest"){
        otherMetricButton = (<Button onClick={getScoresPage("","myrecent")}> My Recent Scores </Button>)
        personalScoresSwitchButton = (<Button onClick={getScoresPage("","best")}> All Best Scores </Button>)
      }else if (rule === "recent"){
        if (cookies.get("id")){
          personalScoresSwitchButton = (<Button onClick={getScoresPage("","myrecent")}> My Recent Scores </Button>)
        }
        otherMetricButton =  (<Button onClick={getScoresPage("","best")}> All Best Scores </Button>)
      }else if (rule === "best" || rule===""){
        if (cookies.get("id")){
          personalScoresSwitchButton = (<Button onClick={getScoresPage("","mybest")}> My Best Scores </Button>)
        }
        otherMetricButton =  (<Button onClick={getScoresPage("","recent")}> All Recent Scores </Button>)
      }
      var nextButton, prevButton;
      if (end < results.length){
        nextButton = (<Button onClick={getScoresPage("",rule,results,start + 10, end + 10)}> Next </Button>)
      }
      if (start > 0){
        prevButton = (<Button onClick={getScoresPage("",rule,results,Math.min(start - 10), Math.max(end - 10,10))}> Previous </Button>)
      }
      var reactString = (
        <div>
          <h1> {scoreTitle} </h1>
          <div><Button id='backButton'>Back Button</Button></div>
          <div> {otherMetricButton} {personalScoresSwitchButton} </div>
          <Table>
          <thead> <tr> <th> # </th> <th> Username </th> <th> Score </th> <th> Time </th> <th> Time Submitted </th> </tr> </thead>
          <tbody>
          {listOfElements}
          </tbody>
          </Table>
          <div>{prevButton}{nextButton}</div>
        </div>
      );
      document.getElementById('gameScreen').innerHTML = ReactDOMServer.renderToStaticMarkup(reactString);
      document.getElementById('backButton').onclick = getFrontPage();
    }
  }
  function getFrontPage(){
    document.getElementById('gameScreen').innerHTML = ReactDOMServer.renderToStaticMarkup(
      <div className='gameScreen' id='gameScreen'>
        <h1> Tetris </h1>
        <Button id='startGameButton' >Start Game</Button><br></br>
        <Button id='instructionsButton'>Read Instructions</Button><br></br>
        <Button id='scoresButton'>Scores</Button><br></br>
      </div>
    );
      document.getElementById("startGameButton").onclick = startGame();
      document.getElementById("instructionsButton").onclick = readInstructions();
      document.getElementById("scoresButton").onclick = getScoresPage();
  }

  return (
    <div className='gameScreen' id='gameScreen'>
      <h1> Tetris </h1>
      <Button onClick={()=>{startGame()}}>Start Game</Button><br></br>
      <Button onClick={()=>{readInstructions()}}>Read Instructions</Button><br></br>
      <Button onClick={()=>{getScoresPage()}}>Scores</Button><br></br>
    </div>
  )
}

export default Tetris;
