import React from "react";
import Canvas from "./components/Canvas";
import { CanvasProvider } from "./context/useCanvasContext";

import "./App.css";

function App() {
  return (
    <CanvasProvider>
      <div className="App">
        <header>
          <h1>Canvas App</h1>
        </header>

        <div className="content-container">
          <aside className="left-sidebar">Left Sidebar</aside>
          <div>
            <Canvas />
          </div>
          <aside className="right-sidebar">Right Sidebar</aside>
        </div>

        <footer>
          <p>&copy; 2024 Canvas App</p>
        </footer>
      </div>
    </CanvasProvider>
  );
}

export default App;
