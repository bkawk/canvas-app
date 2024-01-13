import React, { useRef } from "react";
import useCanvasResizer from "../hooks/useCanvasResizer";
import useCursorPositions from "../hooks/useCursorPositions";
import useCursorStyle from "../hooks/useCursorStyle";
import useCanvasInteractions from "../hooks/useCanvasInteractions";
import useDrawBackground from "../hooks/useDrawBackground";
import useDrawSelection from "../hooks/useDrawSelection";
import useDrawGraph from "../hooks/useDrawGraph";
import { useCanvasContext } from "../context/useCanvasContext";
import useCanvasEventListeners from "../hooks/useCanvasEventListeners";
import useGraphEditor from "../hooks/useGraphEditor";

const Canvas = () => {
  const selectionCanvasRef = useRef<HTMLCanvasElement>(null);
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const backgroundCanvasRef = useRef<HTMLCanvasElement>(null);

  const { canvasState, setCanvasState } = useCanvasContext();
  const { zoomLevel, offset } = canvasState;

  const cursorPositions = useCursorPositions(
    selectionCanvasRef,
    zoomLevel,
    offset
  );
  const canvasSize = useCanvasResizer(selectionCanvasRef);

  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
    handleContextMenu,
    handleKeyDown,
    handleKeyUp,
  } = useCanvasInteractions(cursorPositions);

  useCanvasEventListeners(
    selectionCanvasRef,
    handleContextMenu,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleKeyDown,
    handleKeyUp
  );

  useCursorStyle(selectionCanvasRef);
  useDrawBackground(backgroundCanvasRef, zoomLevel, offset, canvasSize);
  useDrawSelection(selectionCanvasRef, zoomLevel, offset, canvasSize);
  useDrawGraph(mainCanvasRef, zoomLevel, offset, canvasSize);

  useGraphEditor(canvasState, setCanvasState);

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
        style={{ position: "absolute", top: 0, left: 0, zIndex: 3 }}
        width={canvasSize.width}
        height={canvasSize.height}
      />
    </div>
  );
};

export default Canvas;
