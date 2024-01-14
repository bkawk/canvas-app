import { useEffect, RefObject, useCallback } from "react";
import { useGraphContext, Node } from "../context/useGraphContext";
import { drawNodes } from "../utils/drawNodes";
import { drawPins } from "../utils/drawPins";
import { drawEdges } from "../utils/drawEdges";
import { useCanvasContext } from "../context/useCanvasContext";

const useDrawGraph = (canvasRef: RefObject<HTMLCanvasElement>) => {
  const { graph } = useGraphContext();
  const { canvasState } = useCanvasContext();
  const { zoomLevel, offset, canvasSize } = canvasState;

  const drawGraph = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx && graph?.nodes) {
      ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
      graph.nodes.forEach((node: Node) => {
        if (ctx) drawNodes(ctx, node, zoomLevel, offset);
        if (ctx) drawPins(ctx, node, zoomLevel, offset);
        if (ctx) drawEdges(ctx, graph.edges, graph.nodes, zoomLevel, offset);
      });
    }
  }, [canvasRef, graph, zoomLevel, offset, canvasSize]);

  useEffect(() => {
    drawGraph();
  }, [drawGraph]);

  return drawGraph;
};

export default useDrawGraph;
