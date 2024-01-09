// hooks/useSolveGraph.ts
import { useCallback, useRef } from "react";
import {
  useCanvasContext,
  Node,
  GraphData,
  Edge,
  OutputPin,
} from "../context/useCanvasContext";
import { multiplyAxB } from "../functions/multiplyAxB";

type NodeFunctionName = "multiplyAxB";

const functionMap: Record<NodeFunctionName, (inputs: number[]) => number> = {
  multiplyAxB: multiplyAxB,
};

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

const useSolveGraph = () => {
  const { activeGraph, setActiveGraph } = useCanvasContext();
  const previousGraphRef = useRef<GraphData | undefined>(undefined);

  const executeNode = useCallback(
    (node: Node, nodes: Node[]): void => {
      const nodeFunction = functionMap[node.function as NodeFunctionName];
      if (nodeFunction) {
        const inputValues = node.pins.input?.map((inputPin) => {
          const edge = activeGraph.edges.find(
            (edge: Edge) => edge.toPin === inputPin.id
          );
          const fromNode = activeGraph.nodes.find((n: Node) =>
            n.pins.output?.some((p: OutputPin) => p.id === edge?.fromPin)
          );
          return fromNode?.pins.output?.find(
            (p: OutputPin) => p.id === edge?.fromPin
          )?.value;
        });

        if (inputValues) {
          const result = nodeFunction(inputValues);
          const outputPin = node.pins.output?.[0];
          if (outputPin) {
            outputPin.value = result;
            outputPin.solved = true;
          }
        }
      } else {
        console.warn(`Function not found for node: ${node.id}`);
      }
    },
    [activeGraph]
  );

  const solveGraph = useCallback(() => {
    if (!activeGraph) return;
    const graphCopy: GraphData = JSON.parse(JSON.stringify(activeGraph));

    graphCopy.nodes.forEach((node) => {
      if (node.function && node.function in functionMap) {
        executeNode(node, graphCopy.nodes);
      }
    });

    if (
      previousGraphRef.current === undefined ||
      !deepEqual<GraphData>(previousGraphRef.current, graphCopy)
    ) {
      setActiveGraph(graphCopy);
      previousGraphRef.current = graphCopy;
    }
  }, [activeGraph, executeNode, setActiveGraph]);

  return solveGraph;
};

export default useSolveGraph;
