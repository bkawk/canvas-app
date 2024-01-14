import { Node, GraphData } from "../context/useGraphContext";

export function addToSelection(
  node: Node,
  setGraph: (graphData: GraphData) => void,
  Graph: GraphData
): void {
  console.log("addToSelection");

  // Clone the Graph to avoid direct state mutation
  const updatedGraph = { ...Graph, nodes: [...Graph.nodes] };

  // Find the node in the Graph and toggle its selected state
  const nodeIndex = updatedGraph.nodes.findIndex((n) => n.id === node.id);
  if (nodeIndex !== -1) {
    const isCurrentlySelected = updatedGraph.nodes[nodeIndex].selected;
    updatedGraph.nodes[nodeIndex] = {
      ...updatedGraph.nodes[nodeIndex],
      selected: !isCurrentlySelected, // Toggle the selection
    };
  }

  // Save the updated graph back using setGraph
  setGraph(updatedGraph);
}

export function addMultipleToSelection(node: Node[]): void {
  console.log("addMultipleToSelection");
  // Your logic to add a node to the current selection
}

export function clearSelection(): void {
  console.log("delesecting all nodes");
}
