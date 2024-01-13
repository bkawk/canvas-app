import { useEffect } from "react";
import { CanvasContextProps } from "../context/useCanvasContext";

const useGraphEditor = (
  canvasState: CanvasContextProps,
  setCanvasState: React.Dispatch<React.SetStateAction<CanvasContextProps>>
) => {
  useEffect(() => {
    const { mouseButton, dragStart, dragEnd, downTime, upTime } = canvasState;
    const movementThreshold = 5;
    const clickMaxDuration = 200;

    // Check if dragStart and dragEnd are not null before continuing
    if (dragStart && dragEnd && downTime !== null && upTime !== null) {
      const movementX = Math.abs(dragStart.x - dragEnd.x);
      const movementY = Math.abs(dragStart.y - dragEnd.y);
      const duration = upTime - downTime;

      if (mouseButton === "left") {
        const isClick =
          movementX <= movementThreshold &&
          movementY <= movementThreshold &&
          duration <= clickMaxDuration;

        if (isClick) {
          console.log("Simple left click detected", {
            x: dragStart.x,
            y: dragStart.y,
          });
          // Click logic here...
        }
      }

      const isDrag =
        (movementX > movementThreshold || movementY > movementThreshold) &&
        duration > clickMaxDuration;

      if (isDrag) {
        console.log("Drag event detected", {
          startX: dragStart.x,
          startY: dragStart.y,
          endX: dragEnd.x,
          endY: dragEnd.y,
        });
        // Drag logic here...
      }
    }
  }, [canvasState]);
};

export default useGraphEditor;
