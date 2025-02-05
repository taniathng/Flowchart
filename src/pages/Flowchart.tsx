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

import { initialNodes, nodeTypes } from '../nodes';
import { initialEdges, edgeTypes } from '../edges';
import { AppNode, StepNode } from '../nodes/types';

import { fetchFlowData, BASE_URL } from '../api/api_calls'; 
import { convertToNode, getLayoutedElements } from '../utils/NodeHelper';
import { CircularProgress } from '@mui/material'; // Import loading spinner
import { useNavigate } from 'react-router-dom';


// Terminal-style log window
const LogWindow = ({ logs, onClose }: { logs: string[], onClose: () => void }) => (
  <div className="log-window">
    <div className="log-header">
      <span>Logs</span>
      <button onClick={onClose}>X</button>
    </div>
    <div className="log-content">
      {logs.map((log, index) => (
        <p key={index}>{log}</p>
      ))}
    </div>
  </div>
);

export default function FlowchartPage() {
  var [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  var [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<StepNode | null>(null);
  const attackType = localStorage.getItem('attackType') || '';
  const incidentHandlingStep = localStorage.getItem('incidentHandlingStep') || '';
  const [loading, setLoading] = useState(true); // To track the loading state
  const [logs, setLogs] = useState<string[]>([]); 
  const [logsReady, setLogsReady] = useState(false); // Ensures logs complete before showing flowchart
  const [showLogs, setShowLogs] = useState(true); // Toggle log visibility
  const navigate = useNavigate();



  useEffect(() => {
    // Fetch and stream logs from backend
    const eventSource = new EventSource(`${BASE_URL}/api/logs`);

    eventSource.onmessage = (event) => {
      console.log("📡 Received log from backend:", event.data);
      if (event.data !== "[heartbeat]") {
        setLogs((prevLogs) => [...prevLogs, event.data]);
      }
    };

    return () => eventSource.close();  // Cleanup on unmount
  }, []);


  // Fetch the flowchart data from the backend API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // setLogs((prev) => [...prev, "Fetching flowchart data..."]);
        // setLogs((prev) => [...prev, "Data received, processing nodes and edges..."]);
        const data = await fetchFlowData()
        const [receiveNodes, receivedEdges,receivedSubnodesDict, receivedSequentialEdges] = convertToNode(data);
        const [layoutedNodes, layoutedEdges, layoutedSubnodesDict, layoutedSequentialEdges] = getLayoutedElements(receiveNodes, receivedEdges, receivedSubnodesDict, receivedSequentialEdges);
        console.log(layoutedSubnodesDict)
        // setLogs((prev) => [...prev, "Applying layout adjustments..."]);
        Object.values(layoutedSubnodesDict).forEach(list => {
          list?.forEach(value => layoutedNodes.push(value));
        });
        setNodes(layoutedNodes);
        setEdges([...layoutedEdges, ...layoutedSequentialEdges]);
        // setLogs((prev) => [...prev, "Flowchart successfully loaded."]);
        setLoading(false); // Mark loading as completes
        navigate('/Flowchart');
      } catch (error) {
        console.error("Error fetching flowchart data:", error);
        // setLogs((prev) => [...prev, "Error fetching flowchart data."]);
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
      <h1 style = {{paddingLeft: '20px'}}>
        {attackType && incidentHandlingStep
          ? `Workflow for ${attackType}: ${incidentHandlingStep} phase` 
          : "Workflow"}
      </h1>
      </header>
      <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
    }}> 
  
      {/* Loading UI with spinner */}
      {/* {loading || !logsReady ? ( */}
      {loading ? (
        <div> <h1 style={{ fontSize: '32px', marginBottom: '40px' }}>Hang on while your workflow is generating</h1>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: "20px" }}>
          <CircularProgress size={50} style={{ marginBottom: '20px' }} />
          <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#1976D2' }}>Loading, please wait...</p>
        {/* Log Window
        {showLogs && logs.length > 0 && <LogWindow logs={logs} onClose={() => setShowLogs(false)} />} */}
        </div>
        </div>
      ) : (
        <>
          {/* Flowchart */}
            <div className="flowchart-container">
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
        </>
      )}
    </div>
    </div>
  );
}