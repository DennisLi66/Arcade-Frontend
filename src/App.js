import './App.css';
import React from "react";
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
require('dotenv').config();

function App() {

  const [navBar,changeNavbar] = React.useState(
    (
      <Navbar bg='light' expand="lg" className='loggedOutBar'>
      <Navbar.Brand>QuickiePost</Navbar.Brand>
      <Navbar.Toggle aria-controls="navbarScroll" />
      <Navbar.Collapse id="navbarScroll">
      <Nav
        className="mr-auto my-2 my-lg-0"
        style={{ maxHeight: '100px' }}
        navbarScroll
      >
        <Nav.Link onClick={()=>{getHome()}}>Home</Nav.Link>
        <Nav.Link>Log In</Nav.Link>
      </Nav>
      </Navbar.Collapse>
      </Navbar>
    )
  );
  const [body,changeBody] = React.useState()
  function changeNavbarToLoggedIn(){

  }
  function changeNavbarToLoggedOut(){

  }
  const getHome = React.useCallback(
    () => {changeBody(
      (
        <div>
          Welcome to Dennis' Arcade!
        </div>
      )
    )
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
