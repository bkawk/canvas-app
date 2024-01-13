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
  offset: Offset;
  activeGraph: GraphData;

  mouseButton: "left" | "right" | null;
  selectionStart: Position | null;
  selectionEnd: Position | null;
}

const CanvasContext = createContext<
  | {
      canvasState: CanvasContextProps;
      setCanvasState: React.Dispatch<React.SetStateAction<CanvasContextProps>>;
    }
  | undefined
>(undefined);

const CanvasProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [canvasState, setCanvasState] = useState<any>({
    zoomLevel: 1,
    offset: { x: 0, y: 0 },
    activeGraph: localStorage.getItem("activeGraph")
      ? JSON.parse(localStorage.getItem("activeGraph") as string)
      : initialData,
    mouseButton: null,
    selectionStart: null,
    selectionEnd: null,
  });

  useEffect(() => {
    localStorage.setItem(
      "activeGraph",
      JSON.stringify(canvasState.activeGraph)
    );
  }, [canvasState.activeGraph]);

  return (
    <CanvasContext.Provider value={{ canvasState, setCanvasState }}>
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
