import React from 'react';
import { Box, Container, Grid, Typography, Button } from '@mui/material';

const IntegrationSection = () => {
  return (
    <Box sx={{ py: 10, bgcolor: '#FFFFFF' }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={5}>
            <Typography variant="h3" component="h2" sx={{ mb: 3, fontWeight: 700, color: '#0F172A' }}>
              Seamless Integration for Your
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, color: 'rgba(15, 23, 42, 0.7)' }}>
              Elevate Your Payment Capabilities with PayNova's Seamless Integration. Our platform easily connects with your existing systems
            </Typography>
            <Button
              variant="outlined"
              size="large"
              sx={{ 
                px: 3, 
                py: 1, 
                borderRadius: 28,
                color: '#8A2BE2',
                borderColor: '#8A2BE2',
              }}
            >
              Explore Our Solutions
            </Button>
          </Grid>
          <Grid item xs={12} md={7}>
            <Box
              component="img"
              src="/images/integration.png"
              alt="Integration Dashboard"
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 4,
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default IntegrationSection;