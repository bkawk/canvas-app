import { Node, Position, Offset } from "../context/useCanvasContext";

export function findNodeAtClick(
  position: Position,
  nodes: Node[]
): Node | null {
  const { x, y } = position;
  // TODO: move this size to a config or the node definition
  const nodeWidth = 150;
  const nodeHeight = 60;

  for (const node of nodes) {
    if (
      x >= node.position.x &&
      x <= node.position.x + nodeWidth &&
      y >= node.position.y &&
      y <= node.position.y + nodeHeight
    ) {
      return node;
    }
  }

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
  const nodeWidth = 150 * zoomLevel;

  const calculatePinXPosition = (index: number, totalPins: number) => {
    const totalSpacing = (totalPins - 1) * spacing;
    const pinsWidth = totalPins * radius * 2 + totalSpacing;
    const start =
      node.position.x * zoomLevel +
      offset.x +
      (nodeWidth - pinsWidth) / 2 +
      radius;
    return start + index * (spacing + radius * 2);
  };

  const posX = calculatePinXPosition(pinIndex, pinArray.length);
  const posY =
    node.position.y * zoomLevel +
    offset.y +
    (isOutput ? nodeHeight * zoomLevel + radius * 2 : -(radius * 2));

  return { x: posX, y: posY };
};
