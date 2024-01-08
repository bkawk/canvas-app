import { useEffect, RefObject, useCallback } from "react";
import {
  useCanvasContext,
  Offset,
  Node,
  InputPin,
  OutputPin,
  Edge,
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

        const findPinPosition = (pinId: string, isOutput: boolean) => {
          const node = activeGraph.nodes.find((node: Node) =>
            node.pins[isOutput ? "output" : "input"]?.some(
              (pin) => pin.id === pinId
            )
          );

          if (!node) return null;

          const pinIndex = node.pins[isOutput ? "output" : "input"].findIndex(
            (pin: any) => pin.id === pinId
          );
          const spacing = 20 * zoomLevel;
          const radius = 6 * zoomLevel;
          const posX =
            node.position.x * zoomLevel +
            offset.x +
            pinIndex * spacing +
            radius;
          const posY =
            node.position.y * zoomLevel +
            offset.y +
            (isOutput ? nodeHeight * zoomLevel + radius * 2 : -(radius * 2));

          return { x: posX, y: posY };
        };

        activeGraph.edges.forEach((edge: Edge) => {
          const outputPos = findPinPosition(edge.fromPin, true);
          const inputPos = findPinPosition(edge.toPin, false);

          if (outputPos && inputPos) {
            ctx.beginPath();
            ctx.moveTo(outputPos.x, outputPos.y);
            const controlPointX1 = (outputPos.x + inputPos.x) / 2;
            const controlPointY1 = outputPos.y;
            const controlPointX2 = (outputPos.x + inputPos.x) / 2;
            const controlPointY2 = inputPos.y;
            ctx.bezierCurveTo(
              controlPointX1,
              controlPointY1,
              controlPointX2,
              controlPointY2,
              inputPos.x,
              inputPos.y
            );
            ctx.strokeStyle = "#496F98";
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
    }
  }, [canvasRef, activeGraph, zoomLevel, offset, canvasSize]);

  useEffect(() => {
    drawGraph();
  }, [drawGraph]);

  return drawGraph;
};

export default useDrawGraph;
