import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Card, CardContent, Typography, Button } from '@mui/material';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
const curatedWorkflow = [
  { id: 1, title: 'IRM-Main', description: 'Phishing Detection', image: '/images/IRMPhoto.png', link: '/IRM-main.pdf' },
  { id: 2, title: 'Scottish Government' , description: 'Phishing', image: '/images/ScottishPhoto.png', link: '/ScottishGovernment.pdf' },
  { id: 3, title: 'Incident Response', description: 'Phishing', image: 'images/IRPhoto.png', link: '/IncidentResponse.pdf' },
  // Add more references as needed
];

export default function CuratedWorkflow() {
  const navigate = useNavigate();
  const attackType = localStorage.getItem('attackType') || '';
  const incidentHandlingStep = localStorage.getItem('incidentHandlingStep') || '';
 
  const handleCreatePlaybook = () => {
    navigate('/Flowchart');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ fontSize: '39px' , marginBottom: '0px'}}> Relevant workflows from curated repositories
      </h2>
      <h2 style={{ fontSize: '27px' ,color: '#333', marginBottom: '0px'}}>Identified Attack Type: {attackType}</h2>
      <h2 style={{ fontSize: '27px' ,color: '#333', marginTop: '0px', marginBottom: '1px'}}>Incident Handling Phase: {incidentHandlingStep}</h2>
      <p style={{ fontSize: '15px', color: '#1976D2', marginTop: '4px' , paddingLeft: '3px'}}>  
        Click "Create my workflow" below to proceed </p>
      {/* Grid Layout for Cards */}
      <Grid container spacing={3}>
        {curatedWorkflow.map((ref) => (
          <Grid item xs={12} sm={12} md={6} key={ref.id}>
             <Card style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent>
                <Typography variant="h6">{ref.title}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {ref.description}
                </Typography>
              </CardContent>
              {/* Embedded PDF Viewer */}
              <div style={{ height: '400px', width: '100%', overflow: 'hidden', display: 'flex', justifyContent: 'center' }}>
                <Worker workerUrl={`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`}>
                  <Viewer fileUrl={ref.link} />
                </Worker>
              </div>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Button at the Bottom */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleCreatePlaybook}
        >
          Create My Workflow
        </Button>
      </div>
    </div>
  );
}
