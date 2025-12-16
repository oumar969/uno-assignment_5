// ==============================================================
// React Router Configuration
// ==============================================================
// Routes:
//   / → Lobby (create/join game)
//   /login → Player login
//   /game/:id → Active game board
//   /pending/:id → Waiting room before game starts
// ==============================================================

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
