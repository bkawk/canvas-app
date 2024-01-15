import { useEffect, useRef, useCallback, useState } from "react";
import { useCanvasContext } from "../context/useCanvasContext";
import { useGraphContext, Node, GraphData } from "../context/useGraphContext";

const useUpdateGraph = () => {
  const { canvasState } = useCanvasContext();
  const { graph, setGraph } = useGraphContext();

  const lastClickedNodeId = useRef<string | null>(null);
  const [toggleClick, setToggleClick] = useState(false);
  const getClickedNode = useCallback(
    (nodes: Node[], x: number, y: number): Node | null => {
      for (let node of nodes) {
        const { x: nodeX, y: nodeY } = node.position;
        const nodeWidth = 150;
        const nodeHeight = 60;

        if (
          x >= nodeX &&
          x <= nodeX + nodeWidth &&
          y >= nodeY &&
          y <= nodeY + nodeHeight
        ) {
          return node;
        }
      }
      return null;
    },
    []
  );

  const updateNodeSelection = useCallback(
    (clickedNode: Node) => {
      if (lastClickedNodeId.current !== clickedNode.id || !toggleClick) {
        setGraph((prevState: GraphData) => {
          const updatedNodes = prevState.nodes.map((node) =>
            node.id === clickedNode.id
              ? { ...node, selected: !node.selected }
              : node
          );

          lastClickedNodeId.current = clickedNode.id;
          setToggleClick(true);
          return { ...prevState, nodes: updatedNodes };
        });
      }
    },
    [setGraph, toggleClick]
  );

  useEffect(() => {
    if (
      canvasState.mouseButton === "left" &&
      canvasState.eventType === "click" &&
      canvasState.keyPressed === "shift"
    ) {
      const clickedNode = getClickedNode(
        graph.nodes,
        canvasState.dragStart.x,
        canvasState.dragStart.y
      );

      if (clickedNode) {
        updateNodeSelection(clickedNode);
      }
    }
  }, [canvasState, graph.nodes, getClickedNode, updateNodeSelection]);

  useEffect(() => {
    setToggleClick(false);
  }, [canvasState.dragStart]);

  return null;
};

export default useUpdateGraph;
