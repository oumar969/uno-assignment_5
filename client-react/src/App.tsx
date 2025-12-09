import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Lobby from "./pages/Lobby";
import GameBoard from "./pages/GameBoard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Lobby />} />
        <Route path="/game/:id" element={<GameBoard />} />
      </Routes>
    </BrowserRouter>
  );
}
