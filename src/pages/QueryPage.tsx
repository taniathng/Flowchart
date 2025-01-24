import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QueryInput from '../components/QueryInput';

export default function QueryPage() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSend = () => {
    if (query.trim()) {
      localStorage.setItem('userQuery', query);
      navigate('/references');
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
    }}>
      <h1>Enter Your Query</h1>
      <QueryInput query={query} setQuery={setQuery} onSend={handleSend} />
    </div>
  );
}
