// hooks/useSolveGraph.ts
import { useCallback } from "react";
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

const useSolveGraph = () => {
  const { activeGraph, setActiveGraph } = useCanvasContext();

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

    setActiveGraph(graphCopy);
  }, [activeGraph, executeNode, setActiveGraph]);

  return solveGraph;
};

export default useSolveGraph;
