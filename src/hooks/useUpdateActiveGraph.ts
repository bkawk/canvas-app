import { useEffect, useRef } from "react";
import {
  useCanvasContext,
  CanvasContextProps,
} from "../context/useCanvasContext";
import {
  useActiveGraphContext,
  Position,
  GraphData,
  Node,
} from "../context/useActiveGraphContext";

function deepEqual<T>(obj1: T, obj2: T): boolean {
  if (obj1 === obj2) {
    return true;
  }

  if (
    typeof obj1 !== "object" ||
    obj1 === null ||
    typeof obj2 !== "object" ||
    obj2 === null
  ) {
    return false;
  }

  const keys1 = Object.keys(obj1) as (keyof T)[];
  const keys2 = Object.keys(obj2) as (keyof T)[];
  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key] as T, obj2[key] as T)) {
      return false;
    }
  }

  return true;
}

const useUpdateActiveGraph = () => {
  const { canvasState } = useCanvasContext();
  const { activeGraph, setActiveGraph } = useActiveGraphContext();

  const prevCanvasState = useRef<CanvasContextProps>();
  const prevActiveGraph = useRef<GraphData>();
  const dragStartRef = useRef<Position | null>(null);
  const dragEndRef = useRef<Position | null>(null);

  useEffect(() => {
    if (canvasState.dragStart) {
      dragStartRef.current = canvasState.dragStart;
    }
    if (canvasState.dragEnd) {
      dragEndRef.current = canvasState.dragEnd;
    }
    if (
      deepEqual(prevCanvasState.current, canvasState) &&
      deepEqual(prevActiveGraph.current, activeGraph)
    ) {
      return;
    }

    const findClickedNode = (
      canvasState: CanvasContextProps,
      activeGraph: GraphData
    ): Node | null => {
      for (const node of activeGraph.nodes) {
        if (isClickInsideNode(canvasState, node)) {
          return node;
        }
      }
      return null;
    };
    if (canvasState.eventType === "click") {
      const clickedNode = findClickedNode(canvasState, activeGraph);

      if (clickedNode) {
        setActiveGraph({
          ...activeGraph,
          nodes: activeGraph.nodes.map((node) =>
            node.id === clickedNode.id ? { ...node, selected: true } : node
          ),
        });
      }
    }

    if (
      canvasState.eventType === "drag" &&
      canvasState.dragStart &&
      canvasState.dragEnd
    ) {
      const selectedNode = activeGraph.nodes.find((node) => node.selected);
      if (selectedNode) {
        const newPosition = calculateNewPosition(canvasState, selectedNode);
        setActiveGraph({
          ...activeGraph,
          nodes: activeGraph.nodes.map((node) =>
            node.id === selectedNode.id
              ? { ...node, position: newPosition }
              : node
          ),
        });
      }
    }

    prevCanvasState.current = canvasState;
    prevActiveGraph.current = activeGraph;
  }, [canvasState, activeGraph, setActiveGraph]);

  const isClickInsideNode = (
    canvasState: CanvasContextProps,
    node: Node
  ): boolean => {
    if (canvasState.dragStart) {
      const { x, y } = canvasState.dragStart;
      return (
        x >= node.position.x &&
        x <= node.position.x + 150 &&
        y >= node.position.y &&
        y <= node.position.y + 60
      );
    }
    return false;
  };

  const calculateNewPosition = (
    canvasState: CanvasContextProps,
    selectedNode: Node
  ): Position => {
    if (canvasState.dragEnd && canvasState.dragStart) {
      const deltaX = canvasState.dragEnd.x - canvasState.dragStart.x;
      const deltaY = canvasState.dragEnd.y - canvasState.dragStart.y;
      canvasState.dragStart = canvasState.dragEnd;

      return {
        x: selectedNode.position.x + deltaX,
        y: selectedNode.position.y + deltaY,
      };
    }
    return selectedNode.position;
  };
};

export default useUpdateActiveGraph;
