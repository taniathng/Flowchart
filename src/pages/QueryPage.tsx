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
      // backgroundImage: 'url("/images/background.jpg")', 
      // backgroundSize: 'cover',
      // backgroundPosition: 'center',
      // backgroundRepeat: 'no-repeat',
    }}>
      <h1>Create Your Playbook</h1>
      <h2>Enter Your Query</h2>
      <p style={{ fontSize: '11px', color: 'gray' }}> Eg. Create a playbook for phishing detection</p>
      <QueryInput query={query} setQuery={setQuery} onSend={handleSend} />
    </div>
  );
}
