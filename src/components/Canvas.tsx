import React, { useRef, useEffect } from "react";
import useCanvasResizer from "../hooks/useCanvasResizer";
import useCursorPositions from "../hooks/useCursorPositions";
import useCursorStyle from "../hooks/useCursorStyle";
import useCanvasInteractions from "../hooks/useCanvasInteractions";
import useDrawBackground from "../hooks/useDrawBackground";
import useDrawSelection from "../hooks/useDrawSelection";
import { useCanvasContext } from "../context/useCanvasContext";

const Canvas = () => {
  const { zoomLevel, offset } = useCanvasContext();

  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const backgroundCanvasRef = useRef<HTMLCanvasElement>(null);

  const cursorPositions = useCursorPositions(mainCanvasRef, zoomLevel, offset);
  const canvasSize = useCanvasResizer(mainCanvasRef);

  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
    handleContextMenu,
  } = useCanvasInteractions(cursorPositions);

  useCursorStyle(mainCanvasRef);
  useDrawBackground(backgroundCanvasRef, zoomLevel, offset, canvasSize);
  useDrawSelection(mainCanvasRef, zoomLevel, offset, canvasSize);

  useEffect(() => {
    const canvas = mainCanvasRef.current;
    if (canvas) {
      const handleContextMenuListener = (event: Event) =>
        handleContextMenu(event as MouseEvent);
      const handleWheelListener = (event: Event) =>
        handleWheel(event as WheelEvent);

      canvas.addEventListener("contextmenu", handleContextMenuListener, {
        passive: false,
      });
      canvas.addEventListener("wheel", handleWheelListener, { passive: false });

      return () => {
        canvas.removeEventListener("contextmenu", handleContextMenuListener);
        canvas.removeEventListener("wheel", handleWheelListener);
      };
    }
  }, [handleContextMenu, handleWheel]);

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
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </div>
  );
};

export default Canvas;
