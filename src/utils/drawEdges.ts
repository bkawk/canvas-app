import { findPinPosition } from "./graphUtils";

import { Position, Node, Edge } from "../context/useActiveGraphContext";

export const drawEdges = (
  ctx: CanvasRenderingContext2D,
  edges: Edge[],
  nodes: Node[],
  zoomLevel: number,
  offset: Position
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

      // Check if the output pin has an error
      const fromNode = nodes.find((node) =>
        node.pins.output?.some((pin) => pin.id === edge.fromPin)
      );
      const hasError = fromNode?.pins.output?.find(
        (pin) => pin.id === edge.fromPin
      )?.error;

      ctx.strokeStyle = hasError ? "#C62828" : "#496F98";
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }
  });
};
