import React from "react";
import Button from 'react-bootstrap/Button'
import ReactDOMServer from 'react-dom/server';
import Cookies from 'universal-cookie';
require('dotenv').config();

function loginFunctionality(gameData){
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
  function handleLogin(){
    //once logged in refresh the page after submitting score
  }
  function handleRegistration(){
    //once logged in refresh the page after submitting score
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
