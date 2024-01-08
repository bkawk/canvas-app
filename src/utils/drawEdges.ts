import { Edge, Node, Offset } from "../context/useCanvasContext";
import { findPinPosition } from "./graphUtils";

export const drawEdges = (
  ctx: CanvasRenderingContext2D,
  edges: Edge[],
  nodes: Node[],
  zoomLevel: number,
  offset: Offset
) => {
  edges.forEach((edge: Edge) => {
    const nodeHeight = 60;
    const outputPos = findPinPosition(
      edge.fromPin,
      true,
      nodes,
      zoomLevel,
      offset,
      nodeHeight
    );
    const inputPos = findPinPosition(
      edge.toPin,
      false,
      nodes,
      zoomLevel,
      offset,
      nodeHeight
    );

    if (outputPos && inputPos) {
      ctx.beginPath();
      ctx.moveTo(outputPos.x, outputPos.y);
      const curveDistance = 40;
      const controlPointX1 =
        outputPos.x + curveDistance * Math.sign(inputPos.x - outputPos.x);
      const controlPointY1 = outputPos.y;
      const controlPointX2 =
        inputPos.x - curveDistance * Math.sign(inputPos.x - outputPos.x);
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
};
