import { useCallback, useEffect, useState } from "react";

export interface CanvasSize {
  width: number;
  height: number;
}

const useCanvasResizer = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  onResize?: () => void
): CanvasSize => {
  const [canvasSize, setCanvasSize] = useState<CanvasSize>({
    width: 0,
    height: 0,
  });

  const updateCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      setCanvasSize({ width, height });
      canvas.width = width;
      canvas.height = height;

      if (onResize) {
        onResize();
      }
    }
  }, [canvasRef, onResize]);

  useEffect(() => {
    window.addEventListener("resize", updateCanvasSize);
    updateCanvasSize();

    return () => window.removeEventListener("resize", updateCanvasSize);
  }, [updateCanvasSize]);

  return canvasSize;
};

export default useCanvasResizer;
