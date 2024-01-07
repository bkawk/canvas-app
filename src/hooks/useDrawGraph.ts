import { useEffect, RefObject, useCallback } from "react";
import {
  useCanvasContext,
  GraphData,
  Offset,
} from "../context/useCanvasContext";
import { CanvasSize } from "./useCanvasResizer";

const useDrawGraph = (
  canvasRef: RefObject<HTMLCanvasElement>,
  zoomLevel: number,
  offset: Offset,
  canvasSize: CanvasSize
) => {
  const { activeGraph } = useCanvasContext();

  const drawGraph = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx && activeGraph?.nodes) {
      // Clear any previous drawing on the canvas
      ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

      activeGraph.nodes.forEach((node: GraphData["nodes"][number]) => {
        const nodeWidth = 150;
        const nodeHeight = 60;

        // Calculate scaled positions and size
        const posX = node.position.x * zoomLevel + offset.x;
        const posY = node.position.y * zoomLevel + offset.y;
        const width = nodeWidth * zoomLevel;
        const height = nodeHeight * zoomLevel;

        // Draw a rectangle for each node
        ctx.strokeStyle = "black";
        ctx.fillStyle = "rgba(0, 128, 128, 0.5)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.rect(posX, posY, width, height);
        ctx.fill();
        ctx.stroke();
      });
    }
  }, [canvasRef, activeGraph, zoomLevel, offset, canvasSize]);

  useEffect(() => {
    drawGraph();
  }, [drawGraph]);

  return drawGraph;
};

export default useDrawGraph;
