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
  handleKeyUp: (event: KeyboardEvent) => void,
  handleResize: (event: UIEvent) => void
) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    const throttledResize = throttle(handleResize, 500);

    if (canvas) {
      const throttledMouseMove = throttle(handleMouseMove, 30);
      const throttledWheel = throttle(handleWheel, 30);
      const handleLoad = () => throttledResize(new UIEvent("resize"));
      canvas.addEventListener("contextmenu", handleContextMenu, {
        passive: false,
      });
      canvas.addEventListener("wheel", throttledWheel, { passive: false });
      canvas.addEventListener("mousedown", handleMouseDown);
      canvas.addEventListener("mousemove", throttledMouseMove);
      canvas.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("load", handleLoad);

      return () => {
        canvas.removeEventListener("contextmenu", handleContextMenu);
        canvas.removeEventListener("wheel", throttledWheel);
        canvas.removeEventListener("mousedown", handleMouseDown);
        canvas.removeEventListener("mousemove", throttledMouseMove);
        canvas.removeEventListener("mouseup", handleMouseUp);
        window.removeEventListener("load", handleLoad);
      };
    }
  }, [
    canvasRef,
    handleContextMenu,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleResize,
  ]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("resize", handleResize);

    // Cleanup function for the effect
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("resize", handleResize);
    };
  }, [handleKeyDown, handleKeyUp, handleResize]);

  return null;
};

export default useCanvasEventListeners;
