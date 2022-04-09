import './App.scss';
import './games/scss/Snake.scss';
import './games/scss/Tetris.scss';
import './games/scss/Wordle.scss';
import './games/scss/MineSweeper.scss'
import './games/scss/Frogger.scss'
import './games/scss/2048.scss'
import React from "react";
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Button from 'react-bootstrap/Button'
import Cookies from 'universal-cookie';
import Snake from './games/Snake';
import Tetris from './games/Tetris';
import Wordle from './games/Wordle';
import MineSweeper from './games/MineSweeper';
import Frogger from './games/Frogger'
import Two048 from './games/2048'
import snakeImage from "./images/SnakeGameImage.jpg";
import tetrisImage from "./images/TetrisGameImage.jpg";
import wordleImage from "./images/WordleGameImage.jpg";
import mineImage from "./images/MinesweeperGameImage.JPG";
import froggerImage from "./images/FroggerGameImage.JPG";
import two048Image from "./images/2048GameImage.JPG";
require('dotenv').config();

//COuld do puyo puyo or match 3
//logout causes crash?
//Update adding timeduration to Login
//login needs to set a redirection then reload
function App() {
  const [navBar,changeNavbar] = React.useState(
    <Navbar bg='light' expand="lg" className='loggedOutBar'>
    </Navbar>
  );
  const [body,changeBody] = React.useState()
  const cookies = React.useMemo(() => {return new Cookies()},[])

  const getHome = React.useCallback(
    (confMsg = "") => {
      //Visual Stuff
      function hoverImage(imageName){
        if (imageName === 'snake'){
          document.getElementById("snakeWords").style.visibility = 'visible';
        } else if (imageName === 'wordle'){
          document.getElementById("wordleWords").style.visibility = 'visible';
        } else if (imageName === 'tetris'){
          document.getElementById("tetrisWords").style.visibility = 'visible';
        }else if (imageName === "minesweeper"){
          document.getElementById("mineWords").style.visibility = "visible";
        }else if (imageName === "frogger"){
          document.getElementById("froggerWords").style.visibility = "visible";
        }else if (imageName === "two048"){
          document.getElementById("two048Words").style.visibility = "visible";
        }
      }
      function hoverOff(){
        document.getElementById("snakeWords").style.visibility = 'hidden';
        document.getElementById("wordleWords").style.visibility = 'hidden';
        document.getElementById("tetrisWords").style.visibility = 'hidden';
        document.getElementById("mineWords").style.visibility = "hidden";
        document.getElementById("froggerWords").style.visibility = "hidden";
        document.getElementById("two048Words").style.visibility = "hidden";
      }
      //Nav Changers
      function changeNavbarToLoggedIn(){
        changeNavbar(
          (
            <Navbar key='out' bg='light' expand="lg" className='loggedOutBar'>
            <Navbar.Brand>Dennis' Arcade</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
            <Nav className="mr-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll>
              <Nav.Link onClick={()=>{window.location.reload()}}>Home</Nav.Link>
              <Nav.Link onClick={()=>{logOut()}}>Log Out</Nav.Link>
            </Nav>
            </Navbar.Collapse>
            </Navbar>
          )
        )
      }
      function changeNavbarToLoggedOut(){
        changeNavbar(
          (
            <Navbar key='in' bg='light' expand="lg" className='loggedOutBar'>
            <Navbar.Brand onClick={()=>{window.location.reload()}}>Dennis' Arcade</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
            <Nav className="mr-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll>
              <Nav.Link onClick={()=>{window.location.reload()}}>Home</Nav.Link>
              <Nav.Link onClick={()=>{
                cookies.set("redirect","Register");
                window.location.reload();
              }}>Register</Nav.Link>
              <Nav.Link onClick={()=>{
                cookies.set("redirect","Login");
                window.location.reload();
              }}>Log In</Nav.Link>
            </Nav>
            </Navbar.Collapse>
            </Navbar>
          )
        )
      }
      //Registration Page
      function getRegisterPage(error = ""){
        var errMsg;
        if (error !== ""){
          errMsg = (<div className='errMsg'>{error}</div>)
        }
        changeBody((
          <div>
            {errMsg}
            <h1> Welcome to the Registration Page</h1>
            <form onSubmit={(event)=>{handleRegistration(event)}}>
              Enter in these details to register.<br></br>
              <label htmlFor='userEmail'>Email:</label><br></br>
              <input type='email' name='userEmail' id='userEmail' autoComplete="off" required></input><br></br>
              <label htmlFor='username'>Username:</label><br></br>
              <input name='username' id='username' autoComplete="off" required></input><br></br>
              <label htmlFor='password'>Password:</label><br></br>
              <input type='password' name='password' id='password' autoComplete="off" minLength='8' required></input><br></br>
              <label htmlFor='confPass'>Confirm Password</label><br></br>
              <input type='password' name='confPass' id='confPass' autoComplete="off" minLength='8' required></input><br></br><br></br>
              <Button type='submit'>Register</Button>
            </form>
            <Button onClick={()=>{getLoginPage()}}>Already Have An Account?</Button>
          </div>
        ))
      }
      function handleRegistration(event){
        event.preventDefault();
        var userPassword = document.getElementById('password').value;
        var confPassword = document.getElementById('confPass').value;
        var email = document.getElementById('userEmail').value;
        var username = document.getElementById('username').value;
        if (userPassword !== confPassword){
          getRegisterPage("Your passwords did not match.")
        }else{
          const requestSetup = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({email: email, username: username,password:userPassword})
          };
          fetch(process.env.REACT_APP_SERVERLOCATION + "/register",requestSetup)
            .then(response => response.json())
            .then(data => {
              if (data.status === -1){
                getRegisterPage(data.message)
              }else{
                getLoginPage("","You have successfully registered!");
              }
            })
        }
      }
      //Login and Passwords Stuffs
      function getLoginPage(error="",conf=""){
        var errMsg, confMsg;
        if (error !== ""){
          errMsg = (<div className='errMsg'>{error}</div>)
        }
        if (conf !== ""){
          confMsg = (<div className='confMsg'>{conf}</div>)
        }
        changeBody((
          <div>
            {errMsg}
            {confMsg}
            <h1> Welcome to the Login Page </h1>
            Enter in these details to login.
            <form onSubmit={(event)=>{handleLogin(event)}}>
              <label htmlFor='userEmail'>Email:</label><br></br>
              <input name='userEmail' id='userEmail' type='email' required></input><br></br>
              <label htmlFor='password'>Password:</label><br></br>
              <input type='password' name='password' id='password' autoComplete='off' required></input><br></br>
              <br></br><br></br>
              <label htmlFor="rememberMe"> Remember Me?</label><br></br>
              <label className="switch">
              <input type="checkbox" id='rememberMe'
              ></input>
              <span className="slider round"></span>
              </label>
              <br></br><br></br>
              <Button type='submit'>Login</Button>
            </form>
            <Button onClick={()=>{getRegisterPage()}}>Don't Already Have An Account?</Button><br></br>
            <Button onClick={()=>{getForgotPasswordPage()}}>Forgot Your Password?</Button>
          </div>
        ))
      }
      function handleLogin(event){
        event.preventDefault();
        var email = document.getElementById("userEmail").value;
        var password = document.getElementById("password").value;
        var timeDuration = document.getElementById("rememberMe").checked ? "forever" : "hour";
        const requestSetup = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({email: email, password:password,timeDuration:timeDuration})
        }
        fetch(process.env.REACT_APP_SERVERLOCATION + "/login",requestSetup)
          .then(response => response.json())
          .then(data => {
            if (data.status === -1){
              getLoginPage(data.message,"")
            }else if (data.status === 0){
              cookies.set('id',data.userID,{path:'/'});
              cookies.set('sessionID',data.sessionID,{path:'/'});
              //cookies.set('expireTime',rememberMe === 'hour' ? Date.now() + 3600000 : "forever",{path:"/"});
              changeNavbarToLoggedIn();
              getHome("You have successfully logged in.")
            }
          })
        ///change nav to logged in
      }
      function getForgotPasswordPage(error=""){
        var errMsg = "";
        if (error !== ""){
          errMsg = (<div className='errMsg'>{error}</div>)
        }
        changeBody((
          <div>
            {errMsg}
            <h1> Welcome to the Forgot Password Page </h1>
            Enter your email below to send a recovery email.
            <form onSubmit={(event)=>{handleForgotPassword(event)}}>
              <label htmlFor='userEmail'>Email:</label><br></br>
              <input name='userEmail' id='userEmail' type='email' required></input><br></br>
              <Button type='submit'>Submit</Button>
            </form>
          </div>
        ))
      }
      function handleForgotPassword(event){
        event.preventDefault();
        var email = document.getElementById("userEmail").value;
        const requestSetup = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({email: email})
        }
        fetch(process.env.REACT_APP_SERVERLOCATION + "/forgotpassword",requestSetup)
          .then(response => response.json())
          .then(data=>{
            if (data.status === -1){
              getForgotPasswordPage(data.message);
            }else if (data.status === 0){
              changeBody(
                <div>
                  If the email, {email}, exists in our database, it should have just received an email with an activation code in it.<br></br>
                  Enter that code in below:<br></br>
                  <form onSubmit={(event)=>{handleCodeSubmission(event,3,email)}}>
                  Chances Remaining: 3 <br></br>
                  <label htmlFor='code'>Code:</label><br></br>
                  <input name='code' id='code' autoComplete='off' required></input><br></br>
                  <Button type='submit'>Submit</Button>
                  </form>
                </div>
              )
            }
          })
      }
      function handleCodeSubmission(event,chances,email){
        event.preventDefault();
        var code = document.getElementById('code').value;
        const requestSetup = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({code:code,email:email})
        }
        fetch(process.env.REACT_APP_SERVERLOCATION + "/forgotpasswordcode",requestSetup)
          .then(response => response.json())
          .then(data => {
            if (data.status === 0){
              showChangePasswordPage(email,"",code);
            }else if (data.status === -1){
              changeBody(
                <div>
                  <div className='errMsg'>{data.message}</div>
                  If the email, {email}, exists in our database, it should have just received an email with an activation code in it.<br></br>
                  Enter that code in below:<br></br>
                  <form onSubmit={(event)=>{handleCodeSubmission(event,chances,email)}}>
                  Chances Remaining: {chances} <br></br>
                  <label htmlFor='code'>Code:</label><br></br>
                  <input name='code' id='code' autoComplete='off' required></input><br></br>
                  <Button type='submit'>Submit</Button>
                  </form>
                </div>
              )
            }
            else if (data.status === -2){
              if (chances === 1){
                getForgotPasswordPage("You've run out of chances.")
              }else{
                changeBody(
                  <div>
                    <div className='errMsg'> That was not correct. </div>
                    If the email, {email}, exists in our database, it should have just received an email with an activation code in it.<br></br>
                    Enter that code in below:<br></br>
                    <form onSubmit={(event)=>{handleCodeSubmission(event,chances - 1,email)}}>
                    Chances Remaining: {chances - 1} <br></br>
                    <label htmlFor='code'>Code:</label><br></br>
                    <input name='code' id='code' autoComplete='off' required></input><br></br>
                    <Button type='submit'>Submit</Button>
                    </form>
                  </div>
                )
              }
            }
          })
      }
      function showChangePasswordPage(email,error = "",code){
        var errMsg;
        if (error !== ""){
          errMsg = (<div className='errMsg'>{error}</div>)
        }
        changeBody(
          <div>
            {errMsg}
            <h1>Change Your Password</h1>
            You may now change your password.
            <form onSubmit={(event)=>{handleNewPassword(event,email,code)}}>
              <label htmlFor="newPass">New Password</label><br></br>
              <input type="password" name="newPass" id="newPass" required minLength='8'></input><br></br>
              <label htmlFor="confPass">Confirm Password</label><br></br>
              <input type="password" name="confPass" id="confPass" required minLength='8'></input><br></br>
              <Button type='submit'>Submit</Button>
            </form>
          </div>
        )
      }
      function handleNewPassword(event,email,code){
        event.preventDefault();
        var password = document.getElementById("newPass").value;
        var confPass = document.getElementById("confPass").value;
        if (password !== confPass){
          showChangePasswordPage(email,"Those passwords did not match.",code)
        }else{
          const requestSetup = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({email:email,code:code,password:password})
          }
          fetch(process.env.REACT_APP_SERVERLOCATION + "/changepassword",requestSetup)
            .then(response => response.json())
            .then(data=>{
              if (data.status === -1){
                showChangePasswordPage(email,data.message)
              }else if (data.status === 0){
                if (cookies.get("id")){
                  //FIX THIS
                }else{
                  getLoginPage("","You have successfully changed your password.")
                }
              }
            })
        }
      }
      function logOut(){
        cookies.remove('name');
        cookies.remove('id');
        cookies.remove('sessionID');
        changeNavbarToLoggedOut();
        //FIX THIS: WILL NEED CHANGES ON CERTAIN PAGES reload page with a cookie that tracks last page
      }
      //games
      function openGame(gameTitle){
        if (gameTitle === "Snake"){
          changeBody(Snake());
        }else if (gameTitle === "Tetris"){
          changeBody(Tetris());
        }else if (gameTitle === "Wordle"){
          changeBody(Wordle());
        }else if (gameTitle === "MineSweeper"){
          changeBody(MineSweeper());
        }else if (gameTitle === "Frogger"){
          changeBody(Frogger())
        }else if (gameTitle === "2048"){
          changeBody(Two048());
        }
      }
      //Detect Stuff Here
      if (cookies.get("name")){
        changeNavbarToLoggedIn();
      }else{
        changeNavbarToLoggedOut();
      }
      if (cookies.get("redirect")){
        if (cookies.get("redirect") === "Snake"){
          cookies.remove("redirect");
          openGame("Snake");
        }else if (cookies.get("redirect") === "Tetris"){
          cookies.remove("redirect");
          openGame("Tetris");
        }else if (cookies.get("redirect") === "Login"){
          cookies.remove("redirect");
          getLoginPage();
        }else if (cookies.get("redirect") === "Register"){
          cookies.remove("redirect");
          getRegisterPage();
        }
      }else{
        var conf;
        if (confMsg !== ""){
          conf = (<div className='confMsg'>{confMsg}</div>)
        }
        changeBody((
          <div>
            {conf}
            <h1>Welcome to Dennis' Arcade!</h1>
            <div>
              <div className="gameBox">
                  <img className="gameImage snake" src={snakeImage} alt="Play Snake Button" onMouseOver={()=>{hoverImage("snake")}}></img>
                  <div className='gameImage snake' id='snakeWords' onMouseOut={()=>{hoverOff()}} onClick={() => {openGame("Snake")}}><h1>Snake</h1></div>

                  <img className="gameImage tetris" src={tetrisImage} alt="Play Tetris Button" onMouseOver={()=>{hoverImage("tetris")}}></img>
                  <div className='gameImage tetris' id='tetrisWords' onMouseOut={()=>{hoverOff()}} onClick={() => {openGame("Tetris")}}><h1>Tetris</h1></div>

                  <img className="gameImage wordle" src={wordleImage} alt="Play Wordle Button" onMouseOver={()=>{hoverImage("wordle")}}></img>
                  <div className='gameImage wordle' id='wordleWords' onMouseOut={()=>{hoverOff()}} onClick={() => {openGame("Wordle")}}><h1>Wordle</h1></div>

                  <img className='gameImage minesweeper' src={mineImage} alt="Play Minesweeper Button" onMouseOver={()=>{hoverImage("minesweeper")}}></img>
                  <div className='gameImage minesweeper' id='mineWords' onMouseOut={()=>{hoverOff()}} onClick={()=>{openGame('MineSweeper')}}><h1>Minesweeper</h1></div>

                  <img className='gameImage frogger' src={froggerImage} alt="Play Frogger Button" onMouseOver={()=>{hoverImage("frogger")}}></img>
                  <div className='gameImage frogger' id='froggerWords' onMouseOut={()=>{hoverOff()}} onClick={()=>{openGame("Frogger")}}><h1>Frogger</h1></div>

                  <img className='gameImage two048' src={two048Image} alt="Play 2048 Button" onMouseOver={()=>{hoverImage("two048")}}></img>
                  <div className='gameImage two048' id='two048Words' onMouseOut={()=>{hoverOff()}} onClick={()=>{openGame("2048")}}><h1>2048</h1></div>
              </div>
            </div>
          </div>
        ));
      }
  },[cookies])

  React.useEffect(() => {
    getHome();
  },[getHome])

  return (
    <div className="App">
      {navBar}
      {body}
    </div>
  );
}

export default App;
