import React from 'react';
import { Box, Container, Grid, Typography, Button } from '@mui/material';

const HeroSection = () => {
  return (
    <Box sx={{ 
      py: 10, 
      minHeight: '90vh', 
      display: 'flex', 
      alignItems: 'center',
      background: 'linear-gradient(135deg, #1E1E2F 0%, #1E1E2F 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box 
              sx={{
                overflow: 'hidden',
                borderRadius: 2,
                width: 600,
                maxWidth: 700,
                height: 500,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Box 
                component="img" 
                src="src\assets\payments.svg" 
                alt="PayNova Card"
                sx={{ 
                  width: 'auto',
                  height: 'auto',
                  transform: 'scale(0.9)',
                  transition: 'transform 0.5s ease',
                  '&:hover': {
                    transform: 'scale(1.1)', // Zoom out (appear larger) on hover
                  }
                }} 
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography 
              variant="h2" 
              component="h1" 
              sx={{ 
                mb: 2, 
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 700,
                color: '#FFFFFF'
              }}
            >
              Discover the<br />Power of Secure
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 4, 
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '1.1rem',
                lineHeight: 1.6
              }}
            >
              Experience the Future of Fintech with PayNova's Cutting-Edge Payment System. Our platform offers lightning-fast, highly secure transactions.
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              size="large" 
              sx={{ 
                px: 4, 
                py: 1.5,
                borderRadius: '28px',
                background: 'linear-gradient(45deg, #8A2BE2 30%, #7B68EE 90%)',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                boxShadow: '0 4px 20px rgba(138, 43, 226, 0.3)',
                '&:hover': {
                  boxShadow: '0 6px 25px rgba(138, 43, 226, 0.5)',
                }
              }}
            >
              Get Started
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection;
