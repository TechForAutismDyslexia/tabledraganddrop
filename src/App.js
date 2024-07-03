import React from "react";
import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom';
import DragAndDropTable from "./Components/Game";
import Home from "./Components/Home";
import './Components/game.css';
import Result from './Components/Result'
export default function App(){
  return (
    <Router basename="/games/tabledraganddrop">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<DragAndDropTable  />} />
        <Route path='/Result' element={<Result/>}  />
      </Routes>
    </Router>
  );
}