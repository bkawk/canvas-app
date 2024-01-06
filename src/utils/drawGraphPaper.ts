interface CanvasSize {
  width: number;
  height: number;
}

export function drawGraphPaper(
  canvas: HTMLCanvasElement,
  canvasSize: CanvasSize,
  zoom: number,
  offset: { x: number; y: number }
) {
  console.log(
    "Drawing grid with offset:",
    offset,
    "and canvas size:",
    canvasSize
  );
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const gridSize = 20;
  const primaryLineColor = "#161616";
  const secondaryLineColor = "#353535";
  const primaryLineWidth = 2;
  const secondaryLineWidth = 1;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const scaledGridSize = gridSize / zoom;

  // Extend the grid beyond the visible area
  const buffer = Math.max(canvasSize.width, canvasSize.height); // A larger buffer

  // Calculate the starting and ending coordinates for the grid lines
  const startLineX =
    Math.floor((-offset.x - buffer) / scaledGridSize) * scaledGridSize;
  const endLineX =
    startLineX +
    Math.ceil((canvasSize.width + 2 * buffer) / scaledGridSize) *
      scaledGridSize;

  const startLineY =
    Math.floor((-offset.y - buffer) / scaledGridSize) * scaledGridSize;
  const endLineY =
    startLineY +
    Math.ceil((canvasSize.height + 2 * buffer) / scaledGridSize) *
      scaledGridSize;

  // Background color
  ctx.fillStyle = "#262626";
  ctx.fillRect(
    startLineX,
    startLineY,
    endLineX - startLineX,
    endLineY - startLineY
  );

  // Draw function for grid lines
  const drawLine = (
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    isPrimary: boolean
  ) => {
    ctx.beginPath();
    ctx.strokeStyle = isPrimary ? primaryLineColor : secondaryLineColor;
    ctx.lineWidth = isPrimary ? primaryLineWidth : secondaryLineWidth;
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
  };

  // Draw secondary grid lines
  for (let x = startLineX; x < endLineX; x += scaledGridSize) {
    if (Math.floor(x / scaledGridSize) % 10 !== 0) {
      drawLine(x, startLineY, x, endLineY, false);
    }
  }
  for (let y = startLineY; y < endLineY; y += scaledGridSize) {
    if (Math.floor(y / scaledGridSize) % 10 !== 0) {
      drawLine(startLineX, y, endLineX, y, false);
    }
  }

  // Draw primary grid lines
  for (let x = startLineX; x < endLineX; x += scaledGridSize) {
    if (Math.floor(x / scaledGridSize) % 10 === 0) {
      drawLine(x, startLineY, x, endLineY, true);
    }
  }
  for (let y = startLineY; y < endLineY; y += scaledGridSize) {
    if (Math.floor(y / scaledGridSize) % 10 === 0) {
      drawLine(startLineX, y, endLineX, y, true);
    }
  }
}
