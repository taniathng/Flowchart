import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QueryInput from '../components/QueryInput';

export default function QueryPage() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSend = () => {
    if (query.trim()) {
      localStorage.setItem('userQuery', query);
      console.log('Query saved:', query);
      navigate('/CuratedWorkflow');
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
      <h1>Create Your Workflow</h1>
      <h2>Enter Your Query</h2>
      <p style={{ fontSize: '11px', color: 'gray' }}> Eg. Create a workflow for phishing detection</p>
      <QueryInput query={query} setQuery={setQuery} onSend={handleSend} />
    </div>
  );
}
