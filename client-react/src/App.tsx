// Main App Component
// Provides routing via RouterProvider
// Wrapped by Redux Provider + Apollo Provider in index.tsx
import React from "react";
import { RouterProvider } from "react-router-dom";
import router from "./router";

export default function App() {
  
  return <RouterProvider router={router} />;
}
