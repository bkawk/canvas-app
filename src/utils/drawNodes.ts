import { Node, Offset } from "../context/useCanvasContext";

export const drawNodes = (
  ctx: CanvasRenderingContext2D,
  node: Node,
  zoomLevel: number,
  offset: Offset
) => {
  const nodeWidth = 150;
  const nodeHeight = 60;
  const borderRadius = 8 * zoomLevel;

  const posX = node.position.x * zoomLevel + offset.x;
  const posY = node.position.y * zoomLevel + offset.y;
  const width = nodeWidth * zoomLevel;
  const height = nodeHeight * zoomLevel;

  ctx.strokeStyle = "rgba(0, 0, 0, 0.60)";
  ctx.fillStyle = "rgba(189, 189, 191, 0.80)";
  ctx.lineWidth = 1;

  ctx.beginPath();
  ctx.moveTo(posX + borderRadius, posY);
  ctx.lineTo(posX + width - borderRadius, posY);
  ctx.quadraticCurveTo(posX + width, posY, posX + width, posY + borderRadius);
  ctx.lineTo(posX + width, posY + height - borderRadius);
  ctx.quadraticCurveTo(
    posX + width,
    posY + height,
    posX + width - borderRadius,
    posY + height
  );
  ctx.lineTo(posX + borderRadius, posY + height);
  ctx.quadraticCurveTo(posX, posY + height, posX, posY + height - borderRadius);
  ctx.lineTo(posX, posY + borderRadius);
  ctx.quadraticCurveTo(posX, posY, posX + borderRadius, posY);
  ctx.closePath();

  ctx.fill();
  ctx.stroke();
};
