import { useEffect, useRef } from "react";
import { useCanvasContext } from "../context/useCanvasContext";

const useCursorStyle = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  const { canvasState } = useCanvasContext();
  const { mouseButton, zoomLevel } = canvasState;
  const zoomTimeoutRef = useRef<number | null>(null);
  const lastZoomLevel = useRef<number>(zoomLevel);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateCursorForMouseButton = () => {
      if (mouseButton === "right") {
        canvas.style.cursor = "grabbing";
      } else if (mouseButton === "left") {
        canvas.style.cursor = "crosshair";
      } else {
        canvas.style.cursor = "default";
      }
    };

    updateCursorForMouseButton();

    if (zoomLevel !== lastZoomLevel.current) {
      canvas.style.cursor =
        zoomLevel > lastZoomLevel.current ? "zoom-in" : "zoom-out";
      lastZoomLevel.current = zoomLevel;

      if (zoomTimeoutRef.current) {
        clearTimeout(zoomTimeoutRef.current);
      }

      zoomTimeoutRef.current = window.setTimeout(() => {
        updateCursorForMouseButton();
      }, 60);
    }
  }, [canvasRef, mouseButton, zoomLevel]);

  useEffect(() => {
    return () => {
      if (zoomTimeoutRef.current) {
        clearTimeout(zoomTimeoutRef.current);
      }
    };
  }, []);
};

export default useCursorStyle;
