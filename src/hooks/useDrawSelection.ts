import { useEffect, RefObject, useCallback } from "react";
import { useCanvasContext } from "../context/useCanvasContext";

interface CanvasSize {
  width: number;
  height: number;
}

interface Offset {
  x: number;
  y: number;
}

const useDrawSelection = (
  canvasRef: RefObject<HTMLCanvasElement>,
  zoomLevel: number,
  offset: Offset,
  canvasSize: CanvasSize
) => {
  const { canvasState } = useCanvasContext();
  const { selectionStart, selectionEnd, mouseButton } = canvasState;

  const drawSelection = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      // Clear any previous drawing on the canvas
      ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

      if (mouseButton === "left" && selectionStart && selectionEnd) {
        // Calculate scaled positions
        const startX = selectionStart.x * zoomLevel + offset.x;
        const startY = selectionStart.y * zoomLevel + offset.y;
        const endX = selectionEnd.x * zoomLevel + offset.x;
        const endY = selectionEnd.y * zoomLevel + offset.y;

        // Draw white dashed selection rectangle
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.rect(startX, startY, endX - startX, endY - startY);
        ctx.stroke();
      }
    }
  }, [
    canvasRef,
    selectionStart,
    selectionEnd,
    mouseButton,
    zoomLevel,
    offset,
    canvasSize,
  ]);

  useEffect(() => {
    drawSelection();
  }, [drawSelection]);

  return drawSelection;
};

export default useDrawSelection;
