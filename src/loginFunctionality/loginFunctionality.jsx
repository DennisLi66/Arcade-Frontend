import React from "react";
import Button from 'react-bootstrap/Button'
import ReactDOMServer from 'react-dom/server';
import Cookies from 'universal-cookie';
require('dotenv').config();

function loginFunctionality(gameData){
  const cookies = new Cookies();
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
  function handleForgotPassword(){

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
          cookies.set('name',data.username,{path:'/'});
          cookies.set('id',data.userID,{path:'/'});
          cookies.set('sessionID',data.sessionID,{path:'/'});
          cookies.set('redirect','Snake',{path:'/'});
          window.reload();
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
