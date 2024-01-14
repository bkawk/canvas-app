import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

export interface Position {
  x: number;
  y: number;
}
export interface Size {
  width: number;
  height: number;
}

export interface CanvasContextProps {
  zoomLevel: number;
  offset: Position;
  mouseButton: "left" | "right" | null;
  dragStart: Position;
  dragEnd: Position | null;
  keyPressed: "escape" | "shift" | "backspace" | null;
  eventType: "click" | "drag" | null;
  canvasSize: Size;
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
    mouseButton: null,
    dragStart: { x: 0, y: 0 },
    dragEnd: { x: 0, y: 0 },
    keyPressed: null,
    eventType: null,
    canvasSize: { width: 0, height: 0 },
  });

  useEffect(() => {
    localStorage.setItem("Graph", JSON.stringify(canvasState.Graph));
  }, [canvasState.Graph]);

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

export default useCanvasContext;
