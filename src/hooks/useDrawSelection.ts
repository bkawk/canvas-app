import { useEffect, RefObject, useCallback } from "react";
import { useCanvasContext } from "../context/useCanvasContext";

const useDrawSelection = (canvasRef: RefObject<HTMLCanvasElement>) => {
  const { canvasState } = useCanvasContext();
  const {
    dragStart,
    dragEnd,
    mouseButton,
    zoomLevel,
    offset,
    canvasSize,
    eventType,
  } = canvasState;

  const drawSelection = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

      if (
        mouseButton === "left" &&
        dragStart &&
        dragEnd &&
        eventType === "drag"
      ) {
        const startX = dragStart.x * zoomLevel + offset.x;
        const startY = dragStart.y * zoomLevel + offset.y;
        const endX = dragEnd.x * zoomLevel + offset.x;
        const endY = dragEnd.y * zoomLevel + offset.y;

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
    dragStart,
    dragEnd,
    mouseButton,
    zoomLevel,
    offset,
    canvasSize,
    eventType,
  ]);

  useEffect(() => {
    drawSelection();
  }, [drawSelection]);

  return drawSelection;
};

export default useDrawSelection;
