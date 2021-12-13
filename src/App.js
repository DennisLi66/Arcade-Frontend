import './App.css';
import React from "react";
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Button from 'react-bootstrap/Button'
// import Cookies from 'universal-cookie';
require('dotenv').config();

function App() {

  const [navBar,changeNavbar] = React.useState(

  );
  const [body,changeBody] = React.useState()

  const getHome = React.useCallback(
    () => {
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
      function getRegisterPage(){
        changeBody((
          <div>
            <h1> Welcome to the Registration Page</h1>
            <form onSubmit={(event)=>{handleRegistration(event)}}>
              Enter in these details to register.<br></br>
              <label htmlFor='userEmail'>Email:</label><br></br>
              <input type='email' name='userEmail' id='userEmail' autocomplete="off" required></input><br></br>
              <label htmlFor='username'>Username:</label><br></br>
              <input name='username' id='username' autocomplete="off" required></input><br></br>
              <label htmlFor='password'>Password:</label><br></br>
              <input type='password' name='password' id='password' autocomplete="off" minLength='8'></input><br></br>
              <label htmlFor='confPass'>Confirm Password</label><br></br>
              <input type='password' name='confPass' id='confPass' autocomplete="off" minLength='8'></input><br></br><br></br>
              <Button type='submit'>Submit</Button>
            </form>
            <Button onClick={()=>{getLoginPage()}}>Already Have An Account?</Button>
          </div>
        ))
      }
      function handleRegistration(event){
        event.preventDefault();
        console.log("Reg")
      }
      //
      function getLoginPage(){
        changeBody((
          <div>
            <h1> Welcome to the Login Page </h1>
            Enter in these details to login.
            <form onSubmit={(event)=>{handleLogin(event)}}>
              <label htmlFor='userEmail'>Email:</label><br></br>
              <input name='userEmail' id='userEmail' required></input><br></br>
              <label htmlFor='password'>Password:</label><br></br>
              <input type='password' name='password' id='password' autocomplete='off' required></input><br></br>
              <Button type='submit'>Submit</Button>
            </form>
            <Button onClick={()=>{getRegisterPage()}}>Don't Already Have An Account?</Button>
          </div>
        ))
      }
      function handleLogin(event){
        event.preventDefault();
        ///change nav to logged in
      }
      function getForgotPasswordPage(){
        changeBody((
          <div>
            <h1> Welcome to the Change Password Page </h1>
            <form>

            </form>
          </div>
        ))
      }
      function logOut(){
        //FIX THIS: KILL COOKIES
        changeNavbarToLoggedOut();
        getHome();
      }

      //Detect Stuff Here
      changeNavbarToLoggedOut();
      changeBody((
        <div>
          Welcome to Dennis' Arcade!
        </div>
      ));
  },[])

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
