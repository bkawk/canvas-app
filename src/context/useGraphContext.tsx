import React, { createContext, useState, useContext, ReactNode } from "react";
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
  solved: boolean;
}

const GraphContext = createContext<
  | {
      graph: GraphData;
      setGraph: React.Dispatch<React.SetStateAction<GraphData>>;
    }
  | undefined
>(undefined);

const GraphProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [graph, setGraph] = useState<GraphData>(initialData);

  return (
    <GraphContext.Provider value={{ graph, setGraph }}>
      {children}
    </GraphContext.Provider>
  );
};

const useGraphContext = () => {
  const context = useContext(GraphContext);
  if (!context) {
    throw new Error("useGraphContext must be used within an GraphProvider");
  }
  return context;
};

export { GraphProvider, useGraphContext };
