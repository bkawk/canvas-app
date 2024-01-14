import { useCallback, useEffect } from "react";
import { multiplyAxB } from "../functions/multiplyAxB";
import { useGraphContext, Node } from "../context/useGraphContext";

type NodeFunctionName = "multiplyAxB";

const functionMap: Record<NodeFunctionName, (inputs: number[]) => number> = {
  multiplyAxB,
};

const useSolveGraph = () => {
  const { graph, setGraph } = useGraphContext();

  const executeNode = useCallback(
    (node: Node): void => {
      const nodeFunction = functionMap[node.function as NodeFunctionName];
      if (nodeFunction) {
        const inputValues = node.pins.input?.map((inputPin) => {
          const edge = graph.edges.find((edge) => edge.toPin === inputPin.id);
          const fromNode = graph.nodes.find((n) =>
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
    [graph]
  );

  const solveGraph = useCallback(() => {
    if (!graph || graph.solved) return;

    const graphCopy = JSON.parse(JSON.stringify(graph));

    graphCopy.nodes.forEach((node: Node) => {
      if (node.function && node.function in functionMap) {
        executeNode(node);
      }
    });

    graphCopy.solved = true;
    setGraph(graphCopy);
  }, [graph, executeNode, setGraph]);

  useEffect(() => {
    if (!graph.solved) {
      solveGraph();
    }
  }, [solveGraph, graph.solved]);

  return solveGraph;
};

export default useSolveGraph;
