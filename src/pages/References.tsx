import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Card, CardContent, CardMedia, Typography, Button } from '@mui/material';

const references = [
  { id: 1, title: 'IRM-Main', description: 'Phishing Detection', image: '/images/IRMPhoto.png', link: '/IRM-main.pdf' },
  { id: 2, title: 'Scottish Government' , description: 'Phishing', image: '/images/ScottishPhoto.png', link: '/ScottishGovernment.pdf' },
  { id: 3, title: 'Incident Response', description: 'Phishing', image: 'images/IRPhoto.png', link: '/IncidentResponse.pdf' },
  // Add more references as needed
];

export default function References() {
  const navigate = useNavigate();

  const handleCreatePlaybook = () => {
    navigate('/Flowchart');
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" align="center" gutterBottom>
        References
      </Typography>

      {/* Grid Layout for Cards */}
      <Grid container spacing={4}>
        {references.map((ref) => (
          <Grid item xs={12} sm={6} md={4} key={ref.id}>
            <Card style={{ height: '100%', cursor: 'pointer' }} onClick={() => window.open(ref.link, '_blank')}>
              <CardMedia
                component="img"
                image={ref.image}
                alt={ref.title}
                style={{ height: 140 }}
              />
              <CardContent>
                <Typography variant="h6">{ref.title}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {ref.description}
                </Typography>
              </CardContent>
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
          Create My Playbook
        </Button>
      </div>
    </div>
  );
}
