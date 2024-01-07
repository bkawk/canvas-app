import { Node } from "../context/useCanvasContext";

export function addToSelection(node: Node): void {
  console.log("addToSelection");
  // Your logic to add a node to the current selection
}

export function addMultipleToSelection(node: Node[]): void {
  console.log("addMultipleToSelection");
  // Your logic to add a node to the current selection
}

export function clearSelection(): void {
  console.log("delesecting all nodes");
}
