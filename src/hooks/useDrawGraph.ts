import { useEffect, RefObject, useCallback } from "react";
import {
  useCanvasContext,
  Offset,
  Node,
  InputPin,
  OutputPin,
} from "../context/useCanvasContext";
import { drawEdges } from "../utils/drawEdges";
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
      ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

      activeGraph.nodes.forEach((node: Node) => {
        const nodeWidth = 150;
        const nodeHeight = 60;

        const posX = node.position.x * zoomLevel + offset.x;
        const posY = node.position.y * zoomLevel + offset.y;
        const width = nodeWidth * zoomLevel;
        const height = nodeHeight * zoomLevel;

        ctx.strokeStyle = "black";
        ctx.fillStyle = "rgba(0, 128, 128, 0.5)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.rect(posX, posY, width, height);
        ctx.fill();
        ctx.stroke();

        const radius = 6 * zoomLevel;
        const spacing = 20 * zoomLevel;

        node.pins.input?.forEach((input: InputPin, index: number) => {
          const circlePosX = posX + index * spacing + radius;
          const circlePosY = posY - radius * 2;

          ctx.fillStyle = "#BDBDBF";
          ctx.beginPath();
          ctx.arc(circlePosX, circlePosY, radius, 0, Math.PI * 2);
          ctx.fill();
        });

        node.pins.output?.forEach((output: OutputPin, index: number) => {
          const circlePosX = posX + index * spacing + radius;
          const circlePosY = posY + height + radius * 2;

          ctx.fillStyle = "#BDBDBF";
          ctx.beginPath();
          ctx.arc(circlePosX, circlePosY, radius, 0, Math.PI * 2);
          ctx.fill();
        });

        if (ctx) {
          drawEdges(
            ctx,
            activeGraph.edges,
            activeGraph.nodes,
            zoomLevel,
            offset,
            nodeHeight
          );
        }
      });
    }
  }, [canvasRef, activeGraph, zoomLevel, offset, canvasSize]);

  useEffect(() => {
    drawGraph();
  }, [drawGraph]);

  return drawGraph;
};

export default useDrawGraph;
