import React, { useCallback, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type OnConnect,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

import { initialNodes, nodeTypes } from '../nodes';
import { initialEdges, edgeTypes } from '../edges';
import { AppNode, StepNode } from '../nodes/types';


export default function FlowchartPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<StepNode | null>(null);
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
      <header className="app-header">
        <h1>Playbook</h1>
      </header>
      <div className="app-main">
        <div className="app-flowchart">
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
          <div className="app-sidebar">
            <h3>Selected Node</h3>
            <p>ID: {selectedNode.id}</p>
            <p>Label: {selectedNode.data.label}</p>
            <p>
              Position: {`x: ${selectedNode.position.x}, y: ${selectedNode.position.y}`}
            </p>
            <p>Description: {selectedNode.data.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
