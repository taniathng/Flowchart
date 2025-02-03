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
      <h1 style={{ fontSize: '32px' , marginBottom: '40px'}}>Create Your Workflow</h1>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <QueryInput query={query} setQuery={setQuery} onSend={handleSend} />
        <p style={{ fontSize: '15px', color: 'gray', marginTop: '4px' , paddingLeft: '13px'}}>  
          Eg. Create a workflow for phishing detection  
        </p>
      </div>
    </div>
  );
}
