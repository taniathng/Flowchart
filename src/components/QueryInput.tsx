import React from 'react';

type QueryInputProps = {
  query: string;
  setQuery: (value: string) => void;
  onSend: () => void;
};

export default function QueryInput({ query, setQuery, onSend }: QueryInputProps) {
  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <input
        type="text"
        placeholder="Enter your query..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          padding: '8px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          flex: 1,
        }}
      />
      <button
        onClick={onSend}
        style={{
          padding: '8px 16px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Send
      </button>
    </div>
  );
}
