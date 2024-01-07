import React, { createContext, useState, useContext, ReactNode } from "react";
import initialData from "../data/initialData.json";

interface Position {
  x: number;
  y: number;
}

interface Pin {
  id: string;
  type: string;
}

interface Node {
  id: string;
  type: string;
  selected: boolean;
  position: Position;
  dataPins: {
    input?: Pin[];
    output?: Pin[];
  };
  execPins: {
    input?: Pin[];
    output?: Pin[];
    error?: Pin[];
  };
}

interface Edge {
  fromPin: string;
  toPin: string;
}

export interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

export interface Offset {
  x: number;
  y: number;
}

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
  activeGraph: any;
  setActiveGraph: (activeGraph: any) => void;
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
  const [activeGraph, setActiveGraph] = useState<GraphData>(initialData);

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
        activeGraph,
        setActiveGraph,
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
