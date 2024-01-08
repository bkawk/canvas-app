import { useCallback } from "react";
import { useCanvasContext, Node, GraphData } from "../context/useCanvasContext";
import multiplyAxB from "../functions/multiplyAxB";

const useSolveGraph = () => {
  const { activeGraph, setActiveGraph } = useCanvasContext();

  const executeNode = useCallback(
    (node: Node, nodes: Node[]): void => {
      switch (node.type) {
        case "Multiply":
          const inputs = node.pins.input?.map((inputPin) => {
            const edge = activeGraph.edges.find(
              (edge: any) => edge.toPin === inputPin.id
            );
            const fromNode = activeGraph.nodes.find((n: any) =>
              n.pins.output?.some((p: any) => p.id === edge?.fromPin)
            );
            return fromNode?.pins.output?.find(
              (p: any) => p.id === edge?.fromPin
            )?.value;
          });

          if (inputs && inputs.length === 2) {
            const result = multiplyAxB(inputs[0], inputs[1]);
            const outputPin = node.pins.output?.[0];
            if (outputPin) {
              outputPin.value = result;
              outputPin.solved = true;
            }
          }
          break;

        default:
          break;
      }
    },
    [activeGraph]
  );

  const solveGraph = useCallback(() => {
    if (!activeGraph) return;
    const graphCopy: GraphData = JSON.parse(JSON.stringify(activeGraph));

    graphCopy.nodes.forEach((node) => {
      if (node.type !== "Input") {
        executeNode(node, graphCopy.nodes);
      }
    });

    setActiveGraph(graphCopy);
  }, [activeGraph, executeNode, setActiveGraph]);

  return solveGraph;
};

export default useSolveGraph;
