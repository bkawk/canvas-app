import { useRef } from "react";
import useCursorStyle from "../hooks/useCursorStyle";
import useCanvasInteractions from "../hooks/useCanvasInteractions";
import useDrawBackground from "../hooks/useDrawBackground";
import useDrawSelection from "../hooks/useDrawSelection";
import useDrawGraph from "../hooks/useDrawGraph";
import useCanvasEventListeners from "../hooks/useCanvasEventListeners";
import useSolveGraph from "../hooks/useSolveGraph";
import useUpdateGraph from "../hooks/useUpdateGraph";
import useCanvasContext from "../context/useCanvasContext";

const Canvas = () => {
  const selectionCanvasRef = useRef<HTMLCanvasElement>(null);
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const backgroundCanvasRef = useRef<HTMLCanvasElement>(null);

  const { canvasState } = useCanvasContext();
  const { canvasSize } = canvasState;
  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
    handleContextMenu,
    handleKeyDown,
    handleKeyUp,
    handleResize,
  } = useCanvasInteractions(selectionCanvasRef);

  useCanvasEventListeners(
    selectionCanvasRef,
    handleContextMenu,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleKeyDown,
    handleKeyUp,
    handleResize
  );

  useCursorStyle(selectionCanvasRef);
  useDrawBackground(backgroundCanvasRef);
  useDrawSelection(selectionCanvasRef);
  useDrawGraph(mainCanvasRef);
  useSolveGraph();
  useUpdateGraph();

  return (
    <div className="canvas-container">
      <canvas
        ref={backgroundCanvasRef}
        className="background-canvas"
        width={canvasSize.width}
        height={canvasSize.height}
      />
      <canvas
        ref={mainCanvasRef}
        className="main-canvas"
        width={canvasSize.width}
        height={canvasSize.height}
      />
      <canvas
        ref={selectionCanvasRef}
        className="selection-canvas"
        width={canvasSize.width}
        height={canvasSize.height}
      />
    </div>
  );
};

export default Canvas;
