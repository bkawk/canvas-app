import { useEffect } from "react";
import { useCanvasContext } from "../context/useCanvasContext";
import { useGraphContext } from "../context/useGraphContext";

const useUpdateGraph = () => {
  const { canvasState, setCanvasState } = useCanvasContext();
  const { graph, setGraph } = useGraphContext();

  useEffect(() => {
    console.log("canvasState.mouseButton", canvasState.mouseButton);
    console.log("canvasState.eventType", canvasState.eventType);
    console.log("--------");
    if (
      canvasState.mouseButton === "left" &&
      canvasState.eventType === "click"
    ) {
      // Log the position where the user clicked
      console.log("Left click position:", canvasState.dragStart);
    }
  }, [
    canvasState.mouseButton,
    canvasState.eventType,
    canvasState.dragStart,
    graph,
    setGraph,
    setCanvasState,
  ]);

  return null;
};

export default useUpdateGraph;
