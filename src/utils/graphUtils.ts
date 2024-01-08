import { Node, Position, Offset } from "../context/useCanvasContext";

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

export const findPinPosition = (
  pinId: string,
  isOutput: boolean,
  nodes: Node[],
  zoomLevel: number,
  offset: Offset,
  nodeHeight: number
) => {
  const node = nodes.find((node) =>
    (isOutput ? node.pins.output : node.pins.input)?.some(
      (pin) => pin.id === pinId
    )
  );

  if (!node) return null;

  const pinArray = isOutput ? node.pins.output : node.pins.input;
  if (!pinArray) return null;

  const pinIndex = pinArray.findIndex((pin) => pin.id === pinId);
  if (pinIndex === -1) return null;

  const spacing = 20 * zoomLevel;
  const radius = 6 * zoomLevel;
  const posX =
    node.position.x * zoomLevel + offset.x + pinIndex * spacing + radius;
  const posY =
    node.position.y * zoomLevel +
    offset.y +
    (isOutput ? nodeHeight * zoomLevel + radius * 2 : -(radius * 2));

  return { x: posX, y: posY };
};
