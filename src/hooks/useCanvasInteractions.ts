import { useRef, useCallback } from "react";
import { useCanvasContext } from "../context/useCanvasContext";

interface CanvasInteractions {
  handleMouseDown: (event: MouseEvent) => void;
  handleMouseMove: (event: MouseEvent) => void;
  handleMouseUp: (event: MouseEvent) => void;
  handleWheel: (event: WheelEvent) => void;
  handleContextMenu: (event: MouseEvent) => void;
  handleKeyDown: (event: KeyboardEvent) => void;
  handleKeyUp: (event: KeyboardEvent) => void;
}

interface CursorPositions {
  raw: { x: number; y: number };
  transformed: { x: number; y: number };
}

const roundToTwoDecimals = (num: number) => Math.round(num * 100) / 100;

const useCanvasInteractions = (
  canvasRef: React.RefObject<HTMLCanvasElement>
): CanvasInteractions => {
  const { canvasState, setCanvasState } = useCanvasContext();

  const mouseButton = useRef<"left" | "right" | null>(null);
  const startPanPosition = useRef({ x: 0, y: 0 });
  const selectionBoxStart = useRef({ x: 0, y: 0 });
  const selectionBoxEnd = useRef({ x: 0, y: 0 });
  const downTime = useRef<number | null>(null);
  const eventType = useRef<"click" | "drag" | null>(null);
  const zoomLevelRef = useRef<number>(canvasState.zoomLevel);
  const offsetRef = useRef<{ x: number; y: number }>(canvasState.offset);

  const cursorPositions = useRef<CursorPositions>({
    raw: { x: 0, y: 0 },
    transformed: { x: 0, y: 0 },
  });

  const updateCursorPositions = useCallback(
    (event: MouseEvent) => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const rawX = event.clientX - rect.left;
        const rawY = event.clientY - rect.top;

        // Use the current values from the refs for zoomLevel and offset
        const transformedX = roundToTwoDecimals(
          (rawX - offsetRef.current.x) / zoomLevelRef.current
        );
        const transformedY = roundToTwoDecimals(
          (rawY - offsetRef.current.y) / zoomLevelRef.current
        );

        cursorPositions.current = {
          raw: { x: rawX, y: rawY },
          transformed: { x: transformedX, y: transformedY },
        };
      }
    },
    [canvasRef] // No dependencies needed as all values are refs or constants
  );

  const handleMouseDown = useCallback(
    (event: MouseEvent) => {
      downTime.current = event.timeStamp;
      const transformedPos = {
        x: roundToTwoDecimals(cursorPositions.current.transformed.x),
        y: roundToTwoDecimals(cursorPositions.current.transformed.y),
      };
      const buttonPressed =
        event.button === 2 || (event.ctrlKey && event.button === 0)
          ? "right"
          : "left";

      setCanvasState((prevState) => ({
        ...prevState,
        mouseButton: buttonPressed,
      }));

      if (buttonPressed === "right") {
        mouseButton.current = "right";
        startPanPosition.current = { ...cursorPositions.current.raw };
      } else {
        mouseButton.current = "left";
        selectionBoxStart.current = transformedPos;
        setCanvasState((prevState) => ({
          ...prevState,
          dragStart: transformedPos,
          dragEnd: transformedPos,
        }));
      }
    },
    [cursorPositions, setCanvasState]
  );

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      const canvasElement = canvasRef.current; // Ensure canvasRef is defined and refers to your canvas element
      if (canvasElement) {
        updateCursorPositions(event);

        if (mouseButton.current === "right") {
          // Logic for handling right mouse button movement (panning)
          const dx = cursorPositions.current.raw.x - startPanPosition.current.x;
          const dy = cursorPositions.current.raw.y - startPanPosition.current.y;

          const newOffsetX = offsetRef.current.x + dx;
          const newOffsetY = offsetRef.current.y + dy;

          if (
            newOffsetX !== offsetRef.current.x ||
            newOffsetY !== offsetRef.current.y
          ) {
            offsetRef.current = {
              x: newOffsetX,
              y: newOffsetY,
            };

            setCanvasState((prevState) => ({
              ...prevState,
              offset: {
                x: roundToTwoDecimals(newOffsetX),
                y: roundToTwoDecimals(newOffsetY),
              },
            }));
          }

          startPanPosition.current = { ...cursorPositions.current.raw };
        } else if (mouseButton.current === "left") {
          // Logic for handling left mouse button movement (selection or dragging)
          const dragDistance =
            Math.abs(
              cursorPositions.current.transformed.x -
                selectionBoxStart.current.x
            ) +
            Math.abs(
              cursorPositions.current.transformed.y -
                selectionBoxStart.current.y
            );
          if (eventType.current !== "drag" && dragDistance > 2) {
            eventType.current = "drag";
            setCanvasState((prevState) => ({
              ...prevState,
              eventType: "drag",
            }));
          }
          const transformedPos = {
            x: roundToTwoDecimals(cursorPositions.current.transformed.x),
            y: roundToTwoDecimals(cursorPositions.current.transformed.y),
          };
          selectionBoxEnd.current = transformedPos;

          setCanvasState((prevState) => ({
            ...prevState,
            dragEnd: transformedPos,
          }));
        }
        // Additional logic for handleMouseMove can be added here if needed
      }
    },
    [updateCursorPositions, setCanvasState, canvasRef] // Removed cursorPositions from dependencies as it's a ref
  );

  const handleMouseUp = useCallback(
    (event: MouseEvent) => {
      downTime.current = null;
      if (eventType.current !== "drag") {
        eventType.current = "click";
        setCanvasState((prevState) => ({
          ...prevState,
          eventType: "click",
          dragEnd: null,
        }));
      }
      setTimeout(() => {
        eventType.current = null;
        setCanvasState((prevState) => ({
          ...prevState,
          eventType: null,
        }));
      }, 30);
      setCanvasState((prevState) => ({
        ...prevState,
        mouseButton: null,
      }));
      mouseButton.current = null;
    },
    [setCanvasState]
  );

  const handleWheel = useCallback(
    (event: WheelEvent) => {
      if (!canvasRef.current) {
        return;
      }

      event.preventDefault();
      const zoomSpeed = 0.01;
      const zoomIncrement = event.deltaY * -zoomSpeed;

      // Calculate new zoom level
      let newZoomLevel = zoomLevelRef.current + zoomIncrement;
      newZoomLevel = Math.max(newZoomLevel, 0.6);
      newZoomLevel = Math.min(newZoomLevel, 1.6);

      if (newZoomLevel !== zoomLevelRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const cursorX = event.clientX - rect.left;
        const cursorY = event.clientY - rect.top;

        // Calculate the point on the canvas where the cursor is pointing, relative to the current zoom level and offset
        const pointX = (cursorX - offsetRef.current.x) / zoomLevelRef.current;
        const pointY = (cursorY - offsetRef.current.y) / zoomLevelRef.current;

        // Calculate the new offset to keep the point under the cursor stationary
        const newOffsetX = cursorX - pointX * newZoomLevel;
        const newOffsetY = cursorY - pointY * newZoomLevel;

        if (
          newZoomLevel !== zoomLevelRef.current ||
          newOffsetX !== offsetRef.current.x ||
          newOffsetY !== offsetRef.current.y
        ) {
          zoomLevelRef.current = newZoomLevel;
          offsetRef.current = {
            x: roundToTwoDecimals(newOffsetX),
            y: roundToTwoDecimals(newOffsetY),
          };

          setCanvasState((prevState) => ({
            ...prevState,
            zoomLevel: zoomLevelRef.current,
            offset: offsetRef.current,
          }));
        }
      }
    },
    [setCanvasState, canvasRef] // Dependencies updated
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const keyMap: { [key: string]: "escape" | "shift" | "backspace" | null } =
        {
          Escape: "escape",
          Shift: "shift",
          Backspace: "backspace",
        };
      const keyPressed = keyMap[event.key] || null;

      if (keyPressed) {
        setCanvasState((prevState) => ({
          ...prevState,
          keyPressed: keyPressed,
        }));
      }
    },
    [setCanvasState]
  );

  const handleKeyUp = useCallback(
    (event: KeyboardEvent) => {
      setCanvasState((prevState) => ({
        ...prevState,
        keyPressed: null,
      }));
    },
    [setCanvasState]
  );

  const handleContextMenu = useCallback((event: MouseEvent) => {
    event.preventDefault();
  }, []);

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
    handleContextMenu,
    handleKeyDown,
    handleKeyUp,
  };
};

export default useCanvasInteractions;
