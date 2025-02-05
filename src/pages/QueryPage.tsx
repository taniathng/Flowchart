import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QueryInput from '../components/QueryInput';
import { fetchQueryData } from '../api/api_calls';
import { CircularProgress } from '@mui/material'; // Import loading spinner

export default function QueryPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Retrieve query from localStorage when the page loads
  useEffect(() => {
    const storedQuery = localStorage.getItem('userQuery');
    if (storedQuery) {
      setQuery(storedQuery);
    }
  }, []);

  // Fetch and store API data
  const fetchData = async (query: string) => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      const data = await fetchQueryData(query); // API call based on query
      console.log("API Data:", data);

      if (data && typeof data === 'object' && 'attackType' in data && 'incidentHandlingStep' in data) {
        localStorage.setItem('attackType', data.attackType || 'Unknown');
        localStorage.setItem('incidentHandlingStep', data.incidentHandlingStep || 'Unknown');
        console.log("Stored Attack Type:", data.attackType);
        console.log("Stored Incident Handling Step:", data.incidentHandlingStep);
      } else {
        console.error("Invalid API response format:", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (query.trim()) {
      setLoading(true); // Show loading indicator
      localStorage.setItem('userQuery', query);
      await fetchData(query); // Fetch data before navigating
      navigate('/CuratedWorkflow'); // Navigate after loading is complete
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
      <h1 style={{ fontSize: '32px', marginBottom: '40px' }}>Create Your Workflow</h1>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <CircularProgress size={50} style={{ marginBottom: '20px' }} />
          <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#1976D2' }}>Loading, please wait...</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <QueryInput query={query} setQuery={setQuery} onSend={handleSend} disabled={loading} />
          <p style={{ fontSize: '15px', color: 'gray', marginTop: '4px', paddingLeft: '13px' }}>
            Eg. Create a workflow for phishing detection identification.
          </p>
        </div>
      )}
    </div>
  );
}
