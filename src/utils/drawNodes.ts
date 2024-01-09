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

  ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
  ctx.shadowBlur = 5 * zoomLevel;
  ctx.shadowOffsetX = 3 * zoomLevel;
  ctx.shadowOffsetY = 3 * zoomLevel;

  ctx.strokeStyle = node.selected
    ? "rgba(255, 165, 0, 0.70)"
    : "rgba(0, 0, 0, 0.60)";
  ctx.fillStyle = "rgba(189, 189, 191, 0.80)";
  ctx.lineWidth = node.selected ? 2.5 : 1;

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

  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  const textPadding = 10 * zoomLevel;
  ctx.fillStyle = "rgba(189, 189, 191, 0.8)";
  ctx.font = `bold ${16 * zoomLevel}px Arial`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  let textYPos = posY + height / 2;
  ctx.fillText(node.type, posX + width + textPadding, textYPos);

  if (node.pins.output) {
    ctx.font = `${10 * zoomLevel}px Arial`;
    let textYPos = posY + height / 2 + 15 * zoomLevel;

    node.pins.output.forEach((pin) => {
      let pinText;
      if (pin.error !== undefined) {
        pinText = `Error: ${pin.error}`;
      } else if (pin.value !== undefined) {
        pinText = `Value: ${pin.value}`;
      } else {
        pinText = "No data";
      }
      ctx.fillText(pinText, posX + width + textPadding, textYPos);
      textYPos += 15 * zoomLevel;
    });
  }
};
