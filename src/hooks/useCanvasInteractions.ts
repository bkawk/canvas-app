import React, { useRef, useCallback } from "react";
import { useCanvasContext } from "../context/useCanvasContext";

interface CanvasInteractions {
  handleMouseDown: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  handleMouseMove: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  handleMouseUp: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  handleWheel: (event: WheelEvent) => void;
  handleContextMenu: (event: MouseEvent) => void;
}

interface CursorPositions {
  raw: { x: number; y: number };
  transformed: { x: number; y: number };
}

const useCanvasInteractions = (
  cursorPositions: CursorPositions
): CanvasInteractions => {
  const {
    zoomLevel,
    setZoomLevel,
    offset,
    setOffset,
    setSelectionStart,
    setSelectionEnd,
    setIsSelecting,
    setIsPanning,
  } = useCanvasContext();
  const isSelecting = useRef(false);
  const isPanning = useRef(false);
  const startPanPosition = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (event.button === 2 || event.ctrlKey) {
        isPanning.current = true;
        setIsPanning(true);
        startPanPosition.current = { ...cursorPositions.raw }; // Use raw position for panning
      } else {
        isSelecting.current = true;
        setIsSelecting(true);
        setSelectionStart({ ...cursorPositions.transformed }); // Use transformed position for selection
        setSelectionEnd({ ...cursorPositions.transformed });
      }
    },
    [
      cursorPositions,
      setSelectionStart,
      setSelectionEnd,
      setIsSelecting,
      setIsPanning,
    ]
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (isPanning.current) {
        const dx = cursorPositions.raw.x - startPanPosition.current.x;
        const dy = cursorPositions.raw.y - startPanPosition.current.y;
        setOffset({
          x: offset.x + dx,
          y: offset.y + dy,
        });
        startPanPosition.current = { ...cursorPositions.raw };
      } else if (isSelecting.current) {
        setSelectionEnd({ ...cursorPositions.transformed });
      }
    },
    [cursorPositions, offset, setOffset, setSelectionEnd]
  );

  const handleMouseUp = useCallback(() => {
    if (isPanning.current) {
      setIsPanning(false); // Update context state when panning stops
    }
    isPanning.current = false;
    isSelecting.current = false;
    setIsSelecting(false);
  }, [setIsSelecting, setIsPanning]);

  const handleWheel = useCallback(
    (event: WheelEvent) => {
      event.preventDefault(); // Prevent the default scroll behavior

      const zoomSensitivity = 0.01; // Adjust this value to change zoom speed
      const zoomIncrement = event.deltaY * -zoomSensitivity;

      // Calculate new zoom level and clamp it within the desired range
      let newZoomLevel = zoomLevel + zoomIncrement;
      newZoomLevel = Math.max(newZoomLevel, 0.6);
      newZoomLevel = Math.min(newZoomLevel, 1.6);

      if (newZoomLevel !== zoomLevel) {
        const canvasX = (cursorPositions.raw.x - offset.x) / zoomLevel;
        const canvasY = (cursorPositions.raw.y - offset.y) / zoomLevel;

        const newOffsetX = cursorPositions.raw.x - canvasX * newZoomLevel;
        const newOffsetY = cursorPositions.raw.y - canvasY * newZoomLevel;

        setZoomLevel(newZoomLevel);
        setOffset({ x: newOffsetX, y: newOffsetY });
      }
    },
    [cursorPositions.raw, zoomLevel, setZoomLevel, offset, setOffset]
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
  };
};

export default useCanvasInteractions;
