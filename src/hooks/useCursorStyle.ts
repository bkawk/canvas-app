import { useEffect } from "react";
import { useCanvasContext } from "../context/useCanvasContext";

const useCursorStyle = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  const { isPanning, isSelecting } = useCanvasContext();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      if (isPanning) {
        canvas.style.cursor = "grabbing";
      } else if (isSelecting) {
        canvas.style.cursor = "crosshair";
      } else {
        canvas.style.cursor = "default";
      }
    }
  }, [canvasRef, isPanning, isSelecting]);
};

export default useCursorStyle;
