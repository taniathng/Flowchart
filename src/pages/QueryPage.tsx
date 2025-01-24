import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function QueryPage() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSend = () => {
    if (query.trim() !== '') {
      // Store the query in localStorage or pass it via route state (optional)
      localStorage.setItem('userQuery', query);
      navigate('/References');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Enter Your Query</h1>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Type your query here..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border rounded p-2 w-72"
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}
