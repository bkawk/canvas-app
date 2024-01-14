import { useEffect, RefObject, useCallback } from "react";
import { useCanvasContext } from "../context/useCanvasContext";

const useDrawBackground = (
  backgroundCanvasRef: RefObject<HTMLCanvasElement>
) => {
  const { canvasState } = useCanvasContext();
  const { zoomLevel, offset, canvasSize } = canvasState;
  const drawGrid = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      gridSize: number,
      color: string,
      lineWidth: number
    ) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      const startX = offset.x % gridSize;
      const startY = offset.y % gridSize;

      // Draw vertical lines
      for (let x = startX; x < canvasSize.width; x += gridSize) {
        ctx.moveTo(Math.floor(x) + 0.5, 0);
        ctx.lineTo(Math.floor(x) + 0.5, canvasSize.height);
      }

      // Draw horizontal lines
      for (let y = startY; y < canvasSize.height; y += gridSize) {
        ctx.moveTo(0, Math.floor(y) + 0.5);
        ctx.lineTo(canvasSize.width, Math.floor(y) + 0.5);
      }

      ctx.stroke();
    },
    [offset, canvasSize]
  );

  const drawBackground = useCallback(() => {
    const ctx = backgroundCanvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
      ctx.fillStyle = "#262626";
      ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

      // Draw small grid
      drawGrid(ctx, 20 * zoomLevel, "#353535", 1);

      // Draw large grid
      drawGrid(ctx, 200 * zoomLevel, "#161616", 1.5);
    }
  }, [backgroundCanvasRef, drawGrid, canvasSize, zoomLevel]);

  useEffect(() => {
    drawBackground();
  }, [drawBackground]);

  return drawBackground;
};

export default useDrawBackground;
