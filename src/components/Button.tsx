import React from 'react';

type ButtonPageContentProps = {
  onClick: () => void;
};

export default function ButtonPageContent({ onClick }: ButtonPageContentProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
    }}>
      <h1 style={{ marginBottom: '16px' }}>Proceed to the Flowchart</h1>
      <button
        onClick={onClick}
        style={{
          padding: '12px 24px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px',
        }}
      >
        Go to Flowchart
      </button>
    </div>
  );
}
