import React, { createContext, useState, useContext, ReactNode } from "react";

// Step 1: Define the Context Interface
interface CanvasContextProps {
  zoomLevel: number;
  setZoomLevel: (zoomLevel: number) => void;
  offset: { x: number; y: number };
  setOffset: (offset: { x: number; y: number }) => void;
  selectionStart: { x: number; y: number } | null;
  setSelectionStart: (selectionStart: { x: number; y: number } | null) => void;
  selectionEnd: { x: number; y: number } | null;
  setSelectionEnd: (selectionEnd: { x: number; y: number } | null) => void;
  isSelecting: boolean;
  setIsSelecting: (isSelecting: boolean) => void;
  isPanning: boolean;
  setIsPanning: (isPanning: boolean) => void;
}

const CanvasContext = createContext<CanvasContextProps | undefined>(undefined);

const CanvasProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [offset, setOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [selectionStart, setSelectionStart] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [isPanning, setIsPanning] = useState<boolean>(false);

  return (
    <CanvasContext.Provider
      value={{
        zoomLevel,
        setZoomLevel,
        offset,
        setOffset,
        selectionStart,
        setSelectionStart,
        selectionEnd,
        setSelectionEnd,
        isSelecting,
        setIsSelecting,
        isPanning,
        setIsPanning,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

const useCanvasContext = () => {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error("useCanvasContext must be used within a CanvasProvider");
  }
  return context;
};

export { CanvasProvider, useCanvasContext, CanvasContext };
