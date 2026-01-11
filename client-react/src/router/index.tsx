// Routes:
//  createBrowserRouter
// "/" -> slash
//  : 

import { createBrowserRouter } from "react-router-dom";
import Lobby from "../pages/Lobby";
import GameBoard from "../pages/GameBoard";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Lobby />,
  },

  {
    path: "/game/:id",
    element: <GameBoard />,
  },

]);

export default router;
