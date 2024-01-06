import React, { useState, useEffect } from "react";

interface Offset {
  x: number;
  y: number;
}

interface CursorPositions {
  raw: { x: number; y: number };
  transformed: { x: number; y: number };
}

export function useCursorPositions(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  zoomLevel: number,
  offset: Offset
): CursorPositions {
  const [cursorPositions, setCursorPositions] = useState<CursorPositions>({
    raw: { x: 0, y: 0 },
    transformed: { x: 0, y: 0 },
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const rawX = event.clientX - rect.left;
        const rawY = event.clientY - rect.top;
        const transformedX = (rawX - offset.x) / zoomLevel;
        const transformedY = (rawY - offset.y) / zoomLevel;

        setCursorPositions({
          raw: { x: rawX, y: rawY },
          transformed: { x: transformedX, y: transformedY },
        });
      }
    };

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [canvasRef, zoomLevel, offset]);

  return cursorPositions;
}

export default useCursorPositions;
