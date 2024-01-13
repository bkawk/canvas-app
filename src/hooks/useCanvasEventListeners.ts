import { useEffect, RefObject } from "react";
import { clearSelection } from "../utils/selectionUtils";

function throttle(callback: (...args: any[]) => void, delay: number) {
  let lastCall = 0;
  return function (...args: any[]) {
    const now = new Date().getTime();
    if (now - lastCall < delay) return;
    lastCall = now;
    return callback(...args);
  };
}

const useCanvasEventListeners = (
  canvasRef: RefObject<HTMLCanvasElement>,
  handleContextMenu: (event: MouseEvent) => void,
  handleWheel: (event: WheelEvent) => void,
  handleMouseDown: (event: MouseEvent) => void,
  handleMouseMove: (event: MouseEvent) => void,
  handleMouseUp: (event: MouseEvent) => void
) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const throttledMouseMove = throttle(handleMouseMove, 100);
      canvas.addEventListener("contextmenu", handleContextMenu, {
        passive: false,
      });
      canvas.addEventListener("wheel", handleWheel, { passive: false });
      canvas.addEventListener("mousedown", handleMouseDown);
      canvas.addEventListener("mousemove", throttledMouseMove);
      canvas.addEventListener("mouseup", handleMouseUp);

      return () => {
        canvas.removeEventListener("contextmenu", handleContextMenu);
        canvas.removeEventListener("wheel", handleWheel);
        canvas.removeEventListener("mousedown", handleMouseDown);
        canvas.removeEventListener("mousemove", throttledMouseMove);
        canvas.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [
    canvasRef,
    handleContextMenu,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  ]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        clearSelection();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return null;
};

export default useCanvasEventListeners;
