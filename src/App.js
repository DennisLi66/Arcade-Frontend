import './App.css';
import React from "react";
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Button from 'react-bootstrap/Button'
import Cookies from 'universal-cookie';
import Snake from './games/Snake';
require('dotenv').config();
//logout causes crash
//Update adding timeduration to Login
function App() {

  const [navBar,changeNavbar] = React.useState(

  );
  const [body,changeBody] = React.useState()
  const cookies = React.useMemo(() => {return new Cookies()},[])

  const getHome = React.useCallback(
    (confMsg = "") => {
      //Nav Changers
      function changeNavbarToLoggedIn(){
        changeNavbar(
          (
            <Navbar bg='light' expand="lg" className='loggedOutBar'>
            <Navbar.Brand>QuickiePost</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
            <Nav className="mr-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll>
              <Nav.Link onClick={()=>{getHome()}}>Home</Nav.Link>
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
            <Navbar bg='light' expand="lg" className='loggedOutBar'>
            <Navbar.Brand>QuickiePost</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
            <Nav className="mr-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll>
              <Nav.Link onClick={()=>{getHome()}}>Home</Nav.Link>
              <Nav.Link onClick={()=>{getRegisterPage()}}>Register</Nav.Link>
              <Nav.Link onClick={()=>{getLoginPage()}}>Log In</Nav.Link>
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
        getHome();
      }
      //games
      function openGame(gameTitle){
        if (gameTitle === "Snake"){
          changeBody(Snake())
        }
      }
      //Detect Stuff Here
      if (cookies.get("name")){
        changeNavbarToLoggedIn()
      }else{
        changeNavbarToLoggedOut();
      }
      if (cookies.get("redirect")){
        if (cookies.get("redirect") === "Snake"){
          openGame("Snake");
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
                <Button  onClick={() => {openGame("Snake")}}>Play Snake</Button>
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
