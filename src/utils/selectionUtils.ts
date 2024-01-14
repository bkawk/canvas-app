import { Node, GraphData } from "../context/useActiveGraphContext";

export function addToSelection(
  node: Node,
  setActiveGraph: (graphData: GraphData) => void,
  activeGraph: GraphData
): void {
  console.log("addToSelection");

  // Clone the activeGraph to avoid direct state mutation
  const updatedGraph = { ...activeGraph, nodes: [...activeGraph.nodes] };

  // Find the node in the activeGraph and toggle its selected state
  const nodeIndex = updatedGraph.nodes.findIndex((n) => n.id === node.id);
  if (nodeIndex !== -1) {
    const isCurrentlySelected = updatedGraph.nodes[nodeIndex].selected;
    updatedGraph.nodes[nodeIndex] = {
      ...updatedGraph.nodes[nodeIndex],
      selected: !isCurrentlySelected, // Toggle the selection
    };
  }

  // Save the updated graph back using setActiveGraph
  setActiveGraph(updatedGraph);
}

export function addMultipleToSelection(node: Node[]): void {
  console.log("addMultipleToSelection");
  // Your logic to add a node to the current selection
}

export function clearSelection(): void {
  console.log("delesecting all nodes");
}
