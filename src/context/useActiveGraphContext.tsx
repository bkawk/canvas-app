import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
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

const ActiveGraphContext = createContext<
  | {
      activeGraph: GraphData;
      setActiveGraph: React.Dispatch<React.SetStateAction<GraphData>>;
    }
  | undefined
>(undefined);

const ActiveGraphProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [activeGraph, setActiveGraph] = useState<GraphData>(initialData);

  useEffect(() => {
    localStorage.setItem("activeGraph", JSON.stringify(activeGraph));
  }, [activeGraph]);

  return (
    <ActiveGraphContext.Provider value={{ activeGraph, setActiveGraph }}>
      {children}
    </ActiveGraphContext.Provider>
  );
};

const useActiveGraphContext = () => {
  const context = useContext(ActiveGraphContext);
  if (!context) {
    throw new Error(
      "useActiveGraphContext must be used within an ActiveGraphProvider"
    );
  }
  return context;
};

export { ActiveGraphProvider, useActiveGraphContext };
