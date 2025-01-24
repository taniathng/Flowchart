import React from 'react';
import { StepNode } from '../nodes/types';

type SidebarProps = {
  selectedNode: StepNode | null;
  onClose: () => void;
};

export default function Sidebar({ selectedNode, onClose }: SidebarProps) {
  if (!selectedNode) return null;

  return (
    <div style={{
      width: '300px',
      backgroundColor: '#f4f4f4',
      borderLeft: '1px solid #ddd',
      padding: '16px',
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 0,
    }}>
      <button
        style={{
          backgroundColor: 'red',
          color: 'white',
          border: 'none',
          padding: '8px 12px',
          marginBottom: '12px',
          cursor: 'pointer',
        }}
        onClick={onClose}
      >
        Close
      </button>
      <h3>Node Details</h3>
      <p><strong>ID:</strong> {selectedNode.id}</p>
      <p><strong>Label:</strong> {selectedNode.data.label}</p>
      <p><strong>Position:</strong> x: {selectedNode.position.x}, y: {selectedNode.position.y}</p>
      <p><strong>Description:</strong> {selectedNode.data.description || 'No description available'}</p>
    </div>
  );
}
