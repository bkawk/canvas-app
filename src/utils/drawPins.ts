import {
  Node,
  Position,
  OutputPin,
  InputPin,
} from "../context/useGraphContext";

export const drawPins = (
  ctx: CanvasRenderingContext2D,
  node: Node,
  zoomLevel: number,
  offset: Position
) => {
  const nodeWidth = 150;
  const nodeHeight = 60;
  const radius = 6 * zoomLevel;
  const spacing = 20 * zoomLevel;
  const smallCircleRadius = 2;

  const posX = node.position.x * zoomLevel + offset.x;
  const posY = node.position.y * zoomLevel + offset.y;

  ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
  ctx.shadowBlur = 5 * zoomLevel;
  ctx.shadowOffsetX = 3 * zoomLevel;
  ctx.shadowOffsetY = 3 * zoomLevel;

  const calculatePinXPosition = (index: number, totalPins: number) => {
    const totalSpacing = (totalPins - 1) * spacing;
    const pinsWidth = totalPins * radius * 2 + totalSpacing;
    const start = posX + (nodeWidth * zoomLevel - pinsWidth) / 2 + radius;
    return start + index * (spacing + radius * 2);
  };

  const drawSmallCircle = (circlePosX: number, circlePosY: number) => {
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.beginPath();
    ctx.arc(circlePosX, circlePosY, smallCircleRadius, 0, Math.PI * 2);
    ctx.fill();
  };

  node.pins.input?.forEach((input: InputPin, index: number) => {
    const circlePosX = calculatePinXPosition(
      index,
      node.pins.input?.length ?? 0
    );
    const circlePosY = posY - radius * 2;

    ctx.fillStyle = "#BDBDBF";
    ctx.beginPath();
    ctx.arc(circlePosX, circlePosY, radius, 0, Math.PI * 2);
    ctx.fill();
    drawSmallCircle(circlePosX, circlePosY);
  });

  node.pins.output?.forEach((output: OutputPin, index: number) => {
    const circlePosX = calculatePinXPosition(
      index,
      node.pins.output?.length ?? 0
    );
    const circlePosY = posY + nodeHeight * zoomLevel + radius * 2;

    ctx.fillStyle = output.error ? "#E57373" : "#BDBDBF";
    ctx.beginPath();
    ctx.arc(circlePosX, circlePosY, radius, 0, Math.PI * 2);
    ctx.fill();
    drawSmallCircle(circlePosX, circlePosY);

    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  });
};
