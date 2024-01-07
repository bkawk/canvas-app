import React, { useRef, useCallback } from "react";
import { useCanvasContext } from "../context/useCanvasContext";
import {
  clearSelection,
  addToSelection,
  addMultipleToSelection,
} from "../utils/selectionUtils";
import { findNodeAtClick, findNodesInSelectionBox } from "../utils/graphUtils";

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
  const selectionBoxStart = useRef({ x: 0, y: 0 });
  const selectionBoxEnd = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (event.button === 2 || event.ctrlKey) {
        isPanning.current = true;
        setIsPanning(true);
        startPanPosition.current = { ...cursorPositions.raw }; // Use raw position for panning
      } else {
        const { x, y } = cursorPositions.transformed;
        const clickedNode = findNodeAtClick(x, y);
        if (clickedNode) {
          if (event.shiftKey) {
            addToSelection(clickedNode);
          } else {
            // Replace selection
            addToSelection([clickedNode]);
          }
        } else {
          isSelecting.current = true;
          selectionBoxStart.current = { x, y };
          setIsSelecting(true);
          setSelectionStart({ x, y });
          setSelectionEnd({ x, y });
        }
      }
    },
    [
      cursorPositions,
      setSelectionStart,
      setSelectionEnd,
      setIsSelecting,
      setIsPanning,
      // Include any other dependencies needed for your selection logic
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
        selectionBoxEnd.current = {
          ...cursorPositions.transformed,
        };
        setSelectionEnd({
          ...cursorPositions.transformed,
        });
      }
    },
    [cursorPositions, offset, setOffset, setSelectionEnd]
  );

  const handleMouseUp = useCallback(() => {
    const wasSelecting = isSelecting.current;
    setIsPanning(false);
    isPanning.current = false;
    setIsSelecting(false);
    isSelecting.current = false;

    if (wasSelecting) {
      const selectedNodes = findNodesInSelectionBox(
        selectionBoxStart.current,
        selectionBoxEnd.current
      );
      addMultipleToSelection(selectedNodes);
    }
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
