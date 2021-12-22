import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Game from "./Components/Game";
import Dashboard from "./Components/Dashboard";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Podium from "./Components/Podium";

function App() {

  const NotFound = () => {
    return (<h1>404 smh</h1>)
  }

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/play" element={<Game/>} />
          <Route path="/podio" element={<Podium/>} />
          <Route path="/stats" element={<Dashboard/>} />
          <Route path="*" element={<NotFound/>} />
      
        </Routes>
      </Router>
    </>
  );
}

export default App;
