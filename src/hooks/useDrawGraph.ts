import { useEffect, RefObject, useCallback } from "react";
import { useCanvasContext, Offset, Node } from "../context/useCanvasContext";
import { drawNodes } from "../utils/drawNodes";
import { drawPins } from "../utils/drawPins";
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
        if (ctx) drawNodes(ctx, node, zoomLevel, offset);
        if (ctx) drawPins(ctx, node, zoomLevel, offset);
        if (ctx)
          drawEdges(
            ctx,
            activeGraph.edges,
            activeGraph.nodes,
            zoomLevel,
            offset
          );
      });
    }
  }, [canvasRef, activeGraph, zoomLevel, offset, canvasSize]);

  useEffect(() => {
    drawGraph();
  }, [drawGraph]);

  return drawGraph;
};

export default useDrawGraph;
