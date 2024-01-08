import { Node, InputPin, OutputPin, Offset } from "../context/useCanvasContext";

export const drawPins = (
  ctx: CanvasRenderingContext2D,
  node: Node,
  zoomLevel: number,
  offset: Offset
) => {
  const nodeWidth = 150;
  const nodeHeight = 60;
  const radius = 6 * zoomLevel;
  const spacing = 20 * zoomLevel;

  const posX = node.position.x * zoomLevel + offset.x;
  const posY = node.position.y * zoomLevel + offset.y;

  node.pins.input?.forEach((input: InputPin, index: number) => {
    const circlePosX = posX + index * spacing + radius;
    const circlePosY = posY - radius * 2;

    ctx.fillStyle = "#BDBDBF";
    ctx.beginPath();
    ctx.arc(circlePosX, circlePosY, radius, 0, Math.PI * 2);
    ctx.fill();
  });

  node.pins.output?.forEach((output: OutputPin, index: number) => {
    const circlePosX = posX + index * spacing + radius;
    const circlePosY = posY + nodeHeight * zoomLevel + radius * 2;

    ctx.fillStyle = "#BDBDBF";
    ctx.beginPath();
    ctx.arc(circlePosX, circlePosY, radius, 0, Math.PI * 2);
    ctx.fill();
  });
};
