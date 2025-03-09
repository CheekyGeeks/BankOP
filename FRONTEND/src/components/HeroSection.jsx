import React from 'react';
import { Box, Container, Grid, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    navigate('/signup');
  };

  return (
    <Box
      sx={{
        py: 10,
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #1E1E2F 0%, #2A2A45 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 10% 90%, rgba(138, 43, 226, 0.15), transparent 40%)',
          zIndex: 1
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 90% 10%, rgba(123, 104, 238, 0.15), transparent 40%)',
          zIndex: 1
        }
      }}
    >
      {/* Import Google Fonts */}
      <Box
        component="style"
        dangerouslySetInnerHTML={{
          __html: `
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap');
          `
        }}
      />
      
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Grid container spacing={6} alignItems="center" justifyContent="space-between">
          <Grid item xs={12} md={6} sx={{ order: { xs: 2, md: 1 } }}>
            <Box
              component="img"
              src="src/assets/payments.svg"
              alt="PayNova Card"
              sx={{
                width: '100%',
                maxWidth: 600,
                height: 'auto',
                filter: 'drop-shadow(0 15px 30px rgba(138, 43, 226, 0.4))',
                transition: 'all 0.6s cubic-bezier(0.33, 1, 0.68, 1)',
                transform: 'scale(0.95) translateY(0)',
                '&:hover': {
                  transform: 'scale(1.02) translateY(-10px)',
                  filter: 'drop-shadow(0 25px 40px rgba(138, 43, 226, 0.5))'
                }
              }}
            />
            {/* Decorative elements */}
            <Box
              sx={{
                position: 'absolute',
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(138, 43, 226, 0.2) 0%, transparent 70%)',
                top: '30%',
                left: '5%',
                filter: 'blur(40px)',
                zIndex: -1
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                width: 150,
                height: 150,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(123, 104, 238, 0.15) 0%, transparent 70%)',
                bottom: '20%',
                left: '25%',
                filter: 'blur(40px)',
                zIndex: -1
              }}
            />
          </Grid>
          <Grid item xs={12} md={6} sx={{ order: { xs: 1, md: 2 } }}>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                mb: 2,
                fontSize: { xs: '2.3rem', sm: '2.8rem', md: '3.4rem' },
                fontWeight: 800,
                color: '#FFFFFF',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                background: 'linear-gradient(90deg, #FFFFFF 0%, #E0E0FF 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.2px',
                lineHeight: 1.2,
                fontFamily: "'Montserrat', sans-serif",
                wordBreak: 'break-word',
                hyphens: 'auto'
              }}
            >
              Secure Transactions, <br /> Limitless Business
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 4,
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: { xs: '1rem', md: '1.1rem' },
                lineHeight: 1.8,
                maxWidth: '90%',
                position: 'relative',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 300,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: '-20px',
                  top: '0',
                  width: '3px',
                  height: '100%',
                  background: 'linear-gradient(180deg, #8A2BE2, rgba(123, 104, 238, 0.3))',
                  borderRadius: '3px'
                }
              }}
            >
              Seamlessly secure transactions at your fingertips. PayNova transforms how you pay — elegant, instant, and protected by next-gen encryption that keeps your money where it belongs.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, mt: 6 }}>
              <Button
                variant="contained"
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
                  transition: 'all 0.3s ease',
                  fontFamily: "'Poppins', sans-serif",
                  '&:hover': {
                    boxShadow: '0 6px 25px rgba(138, 43, 226, 0.5)',
                    transform: 'translateY(-3px)'
                  }
                }}
                onClick={handleGetStarted}
              >
                Get Started
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: '28px',
                  borderColor: 'rgba(138, 43, 226, 0.5)',
                  color: '#FFFFFF',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  fontFamily: "'Poppins', sans-serif",
                  '&:hover': {
                    borderColor: '#8A2BE2',
                    background: 'rgba(138, 43, 226, 0.1)'
                  }
                }}
              >
                Learn More
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection;