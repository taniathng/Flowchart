import React from 'react';

type QueryInputProps = {
  query: string;
  setQuery: (value: string) => void;
  onSend: () => void;
  disabled?: boolean; 
}

export default function QueryInput({ query, setQuery, onSend, disabled = false }: QueryInputProps) {
  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <input
        type="text"
        placeholder="Enter your query..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          padding: '12px',
          borderRadius: '6px',
          border: '1px solid #ccc',
          width: '400px', 
          height: '30px', 
          fontSize: '16px', 
          flex: 1,
        }}
      />
      <button
        onClick={onSend}
        style={{
          padding: '19px 40px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '16px', 
        }}
      >
        Send
      </button>
    </div>
  );
}
