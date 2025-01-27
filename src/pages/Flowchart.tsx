import React, { useCallback, useState, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type OnConnect,
} from "@xyflow/react";

import "./Flowchart.css";
import "@xyflow/react/dist/style.css";

import { initialNodes, nodeTypes } from "../nodes";
import { initialEdges, edgeTypes } from "../edges";
import { AppNode, StepNode } from "../nodes/types";

import { fetchFlowData } from "../api/api_calls";
import { convertToNode } from "../utils/NodeHelper";

export default function FlowchartPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<StepNode | null>(null);

  const [loading, setLoading] = useState(true); // To track the loading state

  // Fetch the flowchart data from the backend API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchFlowData();
        const [nodes, edges] = convertToNode(data);
        console.log(data);
        setLoading(false); // Mark loading as complete
      } catch (error) {
        console.error("Error fetching flowchart data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this runs only once on mount

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((edges) => addEdge(connection, edges)),
    [setEdges]
  );

  const handleNodeClick = useCallback(
    (event: React.MouseEvent, clickedNode: AppNode) => {
      if (selectedNode === null) {
        setSelectedNode(clickedNode);
      } else {
        if (selectedNode.id === clickedNode.id) {
          setSelectedNode(null);
        } else {
          setSelectedNode(clickedNode);
        }
      }
    },
    [selectedNode, setNodes, setEdges]
  );

  return (
    <div className="flowchart-container">
      <header className="flowchart-header">
        <h1>Playbook</h1>
      </header>
      <div className="flowchart-main">
        <div className="flowchart-flowchart">
          <ReactFlow
            nodes={nodes}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            edges={edges}
            edgeTypes={edgeTypes}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={handleNodeClick}
            fitView
          >
            <Background />
            <MiniMap />
            <Controls />
          </ReactFlow>
        </div>
        {selectedNode && (
          <div className="flowchart-sidebar">
            <h3>{selectedNode.data.label}</h3>
            {/* <p>ID: {selectedNode.id}</p> */}
            {/* <p>Label: {selectedNode.data.label}</p> */}
            <p>
              {/* Position: {`x: ${selectedNode.position.x}, y: ${selectedNode.position.y}`} */}
            </p>
            {selectedNode.data.description && (
              <p>Description: {selectedNode.data.description}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
