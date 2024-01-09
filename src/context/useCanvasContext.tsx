import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import initialData from "../data/initialData.json";

export interface Position {
  x: number;
  y: number;
}

export interface InputPin {
  id: string;
  type: string;
}

export interface OutputPin {
  id: string;
  type: string;
  solved: boolean;
  value?: any;
  error?: any;
}

export interface ErrorPin {
  id: string;
  type: string;
  solved: boolean;
  value: any;
}

export interface Node {
  id: string;
  type: string;
  function?: string;
  selected: boolean;
  position: Position;
  pins: {
    input?: InputPin[];
    output?: OutputPin[];
  };
}

export interface Edge {
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
  offset: Offset;
  setOffset: (offset: Offset) => void;
  selectionStart: Position | null;
  setSelectionStart: (selectionStart: Position | null) => void;
  selectionEnd: Position | null;
  setSelectionEnd: (selectionEnd: Position | null) => void;
  isSelecting: boolean;
  setIsSelecting: (isSelecting: boolean) => void;
  isPanning: boolean;
  setIsPanning: (isPanning: boolean) => void;
  activeGraph: GraphData;
  setActiveGraph: (activeGraph: GraphData) => void;
}

const CanvasContext = createContext<CanvasContextProps | undefined>(undefined);

const CanvasProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [offset, setOffset] = useState<Offset>({
    x: 0,
    y: 0,
  });
  const [selectionStart, setSelectionStart] = useState<Position | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<Position | null>(null);
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [isPanning, setIsPanning] = useState<boolean>(false);

  const [activeGraph, setActiveGraph] = useState<GraphData>(() => {
    const savedData = localStorage.getItem("activeGraph");
    return savedData ? JSON.parse(savedData) : initialData;
  });

  useEffect(() => {
    localStorage.setItem("activeGraph", JSON.stringify(activeGraph));
  }, [activeGraph]);

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
