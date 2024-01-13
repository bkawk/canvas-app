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
  cursorPositions: CursorPositions
): CanvasInteractions => {
  const { canvasState, setCanvasState } = useCanvasContext();
  const { zoomLevel } = canvasState;

  const mouseButton = useRef<"left" | "right" | null>(null);
  const startPanPosition = useRef({ x: 0, y: 0 });
  const selectionBoxStart = useRef({ x: 0, y: 0 });
  const selectionBoxEnd = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback(
    (event: MouseEvent) => {
      const transformedPos = {
        x: roundToTwoDecimals(cursorPositions.transformed.x),
        y: roundToTwoDecimals(cursorPositions.transformed.y),
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
        startPanPosition.current = { ...cursorPositions.raw };
      } else {
        mouseButton.current = "left";
        selectionBoxStart.current = transformedPos;
        setCanvasState((prevState) => ({
          ...prevState,
          dragStart: transformedPos,
          dragEnd: transformedPos,
        }));
      }
      setCanvasState((prevState) => ({
        ...prevState,
        downTime: roundToTwoDecimals(event.timeStamp),
      }));
    },
    [cursorPositions, setCanvasState]
  );

  const handleMouseMove = useCallback(() => {
    if (canvasState.mouseButton === "right") {
      const dx = cursorPositions.raw.x - startPanPosition.current.x;
      const dy = cursorPositions.raw.y - startPanPosition.current.y;
      setCanvasState((prevState) => ({
        ...prevState,
        offset: {
          x: roundToTwoDecimals(prevState.offset.x + dx),
          y: roundToTwoDecimals(prevState.offset.y + dy),
        },
      }));
      startPanPosition.current = { ...cursorPositions.raw };
    } else if (mouseButton.current === "left") {
      const transformedPos = {
        x: roundToTwoDecimals(cursorPositions.transformed.x),
        y: roundToTwoDecimals(cursorPositions.transformed.y),
      };
      selectionBoxEnd.current = transformedPos;
      setCanvasState((prevState) => ({
        ...prevState,
        dragEnd: transformedPos,
      }));
    }
  }, [cursorPositions, setCanvasState, canvasState.mouseButton]);

  const handleMouseUp = useCallback(
    (event: MouseEvent) => {
      setCanvasState((prevState) => ({
        ...prevState,
        mouseButton: null,
        upTime: roundToTwoDecimals(event.timeStamp),
      }));
      mouseButton.current = null;
    },
    [setCanvasState]
  );

  const handleWheel = useCallback(
    (event: WheelEvent) => {
      event.preventDefault();
      const zoomSpeed = 0.01;
      const zoomIncrement = event.deltaY * -zoomSpeed;
      let newZoomLevel = zoomLevel + zoomIncrement;
      newZoomLevel = Math.max(newZoomLevel, 0.6);
      newZoomLevel = Math.min(newZoomLevel, 1.6);

      if (newZoomLevel !== zoomLevel) {
        const transformedPos = {
          x: roundToTwoDecimals(cursorPositions.transformed.x),
          y: roundToTwoDecimals(cursorPositions.transformed.y),
        };
        const newOffsetX =
          cursorPositions.raw.x - transformedPos.x * newZoomLevel;
        const newOffsetY =
          cursorPositions.raw.y - transformedPos.y * newZoomLevel;
        setCanvasState((prevState) => ({
          ...prevState,
          zoomLevel: roundToTwoDecimals(newZoomLevel),
          offset: {
            x: roundToTwoDecimals(newOffsetX),
            y: roundToTwoDecimals(newOffsetY),
          },
        }));
      }
      setCanvasState((prevState) => ({
        ...prevState,
        upTime: event.timeStamp,
      }));
    },
    [cursorPositions, setCanvasState, zoomLevel]
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
          downTime: roundToTwoDecimals(event.timeStamp),
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
        upTime: roundToTwoDecimals(event.timeStamp),
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
