import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom';
import DragAndDropTable from "./Components/Game";
import Home from "./Components/Home";
import Dndtable from "./Components/Gamewithstyling";
import './Components/game.css';
export default function App(){
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Dndkit />} /> */}
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<DragAndDropTable />} />
        <Route path="/rctgame" element={<Dndtable />} />
        {/* <Route path="/rctgame" element={<Dndtable />} /> */}
      </Routes>
    </Router>
  );
}