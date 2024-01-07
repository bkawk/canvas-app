import { useEffect, RefObject } from "react";
import { clearSelection } from "../utils/selectionUtils";

const useCanvasEventListeners = (
  canvasRef: RefObject<HTMLCanvasElement>,
  handleContextMenu: (event: MouseEvent) => void,
  handleWheel: (event: WheelEvent) => void
) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const handleContextMenuListener = (event: MouseEvent) =>
        handleContextMenu(event);
      const handleWheelListener = (event: WheelEvent) => handleWheel(event);

      canvas.addEventListener("contextmenu", handleContextMenuListener, {
        passive: false,
      });
      canvas.addEventListener("wheel", handleWheelListener, { passive: false });

      return () => {
        canvas.removeEventListener("contextmenu", handleContextMenuListener);
        canvas.removeEventListener("wheel", handleWheelListener);
      };
    }
  }, [canvasRef, handleContextMenu, handleWheel]);

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
};

export default useCanvasEventListeners;
