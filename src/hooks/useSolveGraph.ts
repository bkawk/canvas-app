import { useRef, useCallback } from "react";
import {
  GraphData,
  Node,
  useActiveGraphContext,
} from "../context/useActiveGraphContext";
import { multiplyAxB } from "../functions/multiplyAxB";

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
type NodeFunctionName = "multiplyAxB";

const functionMap: Record<NodeFunctionName, (inputs: number[]) => number> = {
  multiplyAxB,
};

export const useSolveGraph = () => {
  const { activeGraph, setActiveGraph } = useActiveGraphContext();
  const previousGraphRef = useRef<GraphData | undefined>(undefined);

  const executeNode = useCallback(
    (node: Node, nodes: Node[]): void => {
      const nodeFunction = functionMap[node.function as NodeFunctionName];
      if (nodeFunction) {
        const inputValues = node.pins.input?.map((inputPin) => {
          const edge = activeGraph.edges.find(
            (edge) => edge.toPin === inputPin.id
          );
          const fromNode = activeGraph.nodes.find((n) =>
            n.pins.output?.some((p) => p.id === edge?.fromPin)
          );
          return fromNode?.pins.output?.find((p) => p.id === edge?.fromPin)
            ?.value;
        });

        if (inputValues) {
          const result = nodeFunction(inputValues as number[]);
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
    const graphCopy = JSON.parse(JSON.stringify(activeGraph));

    graphCopy.nodes.forEach((node: Node) => {
      if (node.function && node.function in functionMap) {
        executeNode(node, graphCopy.nodes);
      }
    });

    if (
      previousGraphRef.current === undefined ||
      !deepEqual(previousGraphRef.current, graphCopy)
    ) {
      setActiveGraph(graphCopy);
      previousGraphRef.current = graphCopy;
    }
  }, [activeGraph, executeNode, setActiveGraph]);

  return solveGraph;
};

export default useSolveGraph;
