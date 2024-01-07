import { Node, Position } from "../context/useCanvasContext";

export function findNodeAtClick(position: Position): Node | null {
  const { x, y } = position;
  console.log("Finding node at click:", x, y);
  // Implementation to find and return the node at the given position
  return null;
}

export function findNodesInSelectionBox(
  startPosition: Position,
  endPosition: Position
): Node[] | null {
  const { x: startX, y: startY } = startPosition;
  const { x: endX, y: endY } = endPosition;
  console.log("Finding nodes in selection box:", startX, startY, endX, endY);
  // Implementation to find and return the nodes within the selection box
  return null;
}

export function deleteNode(node: Node): void {
  console.log("deleteNode");
  // TODO: Implement node deletion logic and also delete edges connected to this node
}
