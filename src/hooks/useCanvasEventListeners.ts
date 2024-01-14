import { useEffect, RefObject } from "react";

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
  handleMouseUp: (event: MouseEvent) => void,
  handleKeyDown: (event: KeyboardEvent) => void,
  handleKeyUp: (event: KeyboardEvent) => void
) => {
  // Memoize the handleMouseMove function

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const throttledMouseMove = throttle(handleMouseMove, 20);

      canvas.addEventListener("contextmenu", handleContextMenu, {
        passive: false,
      });
      canvas.addEventListener("wheel", handleWheel, { passive: false });
      canvas.addEventListener("mousedown", handleMouseDown);
      canvas.addEventListener("mousemove", throttledMouseMove);
      canvas.addEventListener("mouseup", handleMouseUp);

      // Cleanup function for the effect
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
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Cleanup function for the effect
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return null;
};

export default useCanvasEventListeners;
