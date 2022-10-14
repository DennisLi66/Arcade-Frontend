import React from "react";
import Button from 'react-bootstrap/Button'
import ReactDOMServer from 'react-dom/server';
import Cookies from 'universal-cookie';
require('dotenv').config();

function loginFunctionality(gameData){
  const cookies = new Cookies();
  function registrationCheckAllTextFilled(){
    //if anything is blank or invalid shut it down
    //FIX THIS: prevent user from using enter key to submit
    if (document.getElementById('userEmail').val.length > 0 && document.getElementById('username').val.length > 0
    && document.getElementById('password').val.length > 0 && document.getElementById('confPass').val.length > 0
    && document.getElementById('password').val === document.getElementById('confPass').val &&
    isValidPassword(document.getElementById("password").val)){
      document.getElementById("registrationCheckButton").style.visibility = 'visible';
    }
    else document.getElementById("registrationCheckButton").style.visibility = 'hidden';
  }
  function loginCheckAllTextFilled(){
    //if anything is blank or invalid shut it down
    //FIX THIS: prevent user from using enter key to submit
    if (document.getElementById('userEmail').val.length > 0 && document.getElementById('password').val.length
    && isAnEmail(document.getElementById("userEmail").val)){
      document.getElementById("loginFormButton").style.visibility = 'visible';
    }
    else document.getElementById("loginFormButton").style.visibility = 'hidden';
  }
  function getLoginPage(errMsg = "",confMsg = ""){
    var loginContent = (
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
    );
    document.getElementById("gameScreen").innerHTML = ReactDOMServer.renderToStaticMarkup(loginContent);
  }
  function getRegisterPage(error = ""){
    var errMsg;
    if (error !== ""){
      errMsg = (<div className='errMsg'>{error}</div>)
    }
    var registrationContent = (
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
    );
    document.getElementById("gameScreen").innerHTML = ReactDOMServer.renderToStaticMarkup(registrationContent);
  }
  function getForgotPasswordPage(error = ""){
    var errMsg = "";
    if (error !== ""){
      errMsg = (<div className='errMsg'>{error}</div>)
    }
    var forgotPasswordCode = (
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
    );
    document.getElementById("gameScreen").innerHTML = ReactDOMServer.renderToStaticMarkup(
      forgotPasswordCode
    )
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
          var fPassText = (
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
          document.getElementById("gameScreen").innerHTML = ReactDOMServer.renderToStaticMarkup(fPassText);
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
          document.getElementById("gameScreen").innerHTML = ReactDOMServer.renderToStaticMarkup(
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
            document.getElementById('gameScreen').innerHTML = ReactDOMServer.renderToStaticMarkup(
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
    document.getElementById("gameScreen").innerHTML = ReactDOMServer.renderToStaticMarkup(
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
  function handleLogin(event){
    //once logged in refresh the page after submitting score
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
          var request2Setup;
          if (gameData.score && gameData.time){
            request2Setup = {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({sessionID: data.sessionID,userID:data.userID,gameID:gameData.gameID,
                score: gameData.score, timeInMilliseconds: gameData.timeInMilliseconds
              })
            }
            fetch(process.env.REACT_APP_SERVERLOCATION + "/scoreswithtimes",request2Setup)
              .then(repsonse => repsonse.json())
              .then(daat => {
                if (data.status === -1){
                  getLoginPage(daat.message,"")
                }else{
                  cookies.set('name',data.username,{path:'/'});
                  cookies.set('id',data.userID,{path:'/'});
                  cookies.set('sessionID',data.sessionID,{path:'/'});
                  if(gameData.gameID === 1 || gameData.gameID === '1'){cookies.set('redirect','Snake',{path:'/'});}
                  window.reload();
                }
              })
          }
          else if (gameData.score){
            request2Setup = {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({sessionID: data.sessionID,userID:data.userID,gameID:gameData.gameID,
                score: gameData.score
              })
            }
            fetch(process.env.REACT_APP_SERVERLOCATION + "/scores",request2Setup)
              .then(repsonse => repsonse.json())
              .then(daat => {
                if (data.status === -1){
                  getLoginPage(daat.message,"")
                }else{
                  cookies.set('name',data.username,{path:'/'});
                  cookies.set('id',data.userID,{path:'/'});
                  cookies.set('sessionID',data.sessionID,{path:'/'});
                  //FIX THIS ADD GAMES
                  window.reload();
                }
              })
          }else if (gameData.time){
            request2Setup = {
              method: 'PUT',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({sessionID: data.sessionID,userID:data.userID,gameID:gameData.gameID,
  timeInMilliseconds: gameData.timeInMilliseconds})
            };
            fetch(process.env.REACT_APP_SERVERLOCATION + "/times",request2Setup)
              .then(repsonse => repsonse.json())
              .then(daat => {
                if (data.status === -1){
                  getLoginPage(daat.message,"")
                }else{
                  cookies.set('name',data.username,{path:'/'});
                  cookies.set('id',data.userID,{path:'/'});
                  cookies.set('sessionID',data.sessionID,{path:'/'});
                  //FIX THIS ADD GAMES
                  window.reload();
                }
              })
          }
        }
      })
  }
  function handleRegistration(event){
    //once logged in refresh the page after submitting score
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
  return (
    <div>
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
  )
}

export default loginFunctionality;
