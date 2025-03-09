import React from 'react';
import { Box, Container, Grid, Typography, Card } from '@mui/material';

const FeatureShowcase = () => {
  const features = [
    { name: 'Bayon Nova', image: '/images/feature1.png' },
    { name: 'Payaoniavera', image: '/images/feature2.png' },
    { name: 'Pay Nova', image: '/images/feature3.png' },
    { name: 'Pay Noova', image: '/images/feature4.png' },
  ];

  return (
    <Box sx={{ py: 10, bgcolor: '#0F172A' }}>
      <Container maxWidth="lg">
        <Typography variant="h2" component="h2" align="center" sx={{ mb: 2 }}>
          Empowering Your Financial Future
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 8, maxWidth: 700, mx: 'auto' }}>
          Discover the Transformative Power of PayNova's Payment Solutions. Our platform is designed to streamline your financial operations, increase customer satisfaction
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                sx={{ 
                  height: '100%', 
                  bgcolor: 'transparent',
                  boxShadow: 'none',
                  overflow: 'hidden',
                  borderRadius: 4,
                }}
              >
                <Box 
                  component="img" 
                  src={feature.image} 
                  alt={feature.name}
                  sx={{ width: '100%' }}
                />
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeatureShowcase;