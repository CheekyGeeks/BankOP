import React, { useState } from 'react';
import { Box, Container, Grid, Typography, Card } from '@mui/material';
import Marquee from 'react-fast-marquee';

const FeatureShowcase = () => {
  const features = [
    { name: 'Blockchain Login', image: 'src/assets/blockchain.jpg' },
    { name: 'Device & Network-Based Authentication', image: 'src/assets/token.jpg' },
    { name: 'AI-Based Security Bot', image: 'src/assets/bot.svg' },
    { name: 'Biometric Face Recognition Authentication', image: 'src/assets/biometric.jpg' },
  ];

  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <Box 
      sx={{ 
        py: 10, 
        // Mirrored gradient direction from the HeroSection (135deg → 315deg)
        background: 'linear-gradient(315deg, #1E1E2F 0%, #2A2A45 100%)',
        position: 'relative',
        overflow: 'hidden',
        marginTop: '-1px', // Ensures no gap between sections
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          // Mirrored position (10% 90% → 90% 10%)
          background: 'radial-gradient(circle at 90% 10%, rgba(138, 43, 226, 0.15), transparent 40%)',
          zIndex: 1
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          // Mirrored position (90% 10% → 10% 90%)
          background: 'radial-gradient(circle at 10% 90%, rgba(123, 104, 238, 0.15), transparent 40%)',
          zIndex: 1
        }
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Typography 
          variant="h2" 
          component="h2" 
          align="center" 
          sx={{ 
            mb: 2, 
            fontSize: { xs: '2.5rem', sm: '3rem', md: '3.75rem' },
            fontWeight: 800,
            color: '#FFFFFF',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
            background: 'linear-gradient(90deg, #FFFFFF 0%, #E0E0FF 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.5px',
            lineHeight: 1.2
          }}
        >
          Empowering Your Financial Future
        </Typography>
        <Typography
          variant="body1"
          align="center"
          sx={{ 
            mb: 8, 
            maxWidth: 700, 
            mx: 'auto', 
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: { xs: '1rem', md: '1.1rem' },
            lineHeight: 1.8,
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
          }}
        >
          Discover the Transformative Power of PayNova's Payment Solutions. Our platform is designed to streamline your financial operations and increase customer satisfaction.
        </Typography>

        <Marquee gradient={false} speed={50} pauseOnHover={true}>
          {features.map((feature, index) => (
            <Box
              key={index}
              sx={{
                position: 'relative',
                mx: 2,
                width: 250,
                height: 200,
                borderRadius: 4,
                overflow: 'hidden',
                boxShadow: '0 15px 30px rgba(138, 43, 226, 0.4)',
                transition: 'all 0.6s cubic-bezier(0.33, 1, 0.68, 1)',
                transform: 'scale(0.98) translateY(0)',
                '&:hover': {
                  transform: 'scale(1.02) translateY(-10px)',
                  boxShadow: '0 25px 40px rgba(138, 43, 226, 0.5)'
                }
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Box
                component="img"
                src={feature.image}
                alt={feature.name}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              
              {/* Only show title on hover */}
              {hoveredIndex === index && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    // Mirrored gradient for the overlay
                    background: 'linear-gradient(315deg, rgba(42, 42, 69, 0.85), rgba(30, 30, 47, 0.7))',
                    backdropFilter: 'blur(3px)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: '#FFFFFF',
                    textAlign: 'center',
                    p: 2,
                  }}
                >
                  <Typography 
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                      background: 'linear-gradient(90deg, #FFFFFF 0%, #E0E0FF 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {feature.name}
                  </Typography>
                </Box>
              )}
            </Box>
          ))}
        </Marquee>
      </Container>
    </Box>
  );
};

export default FeatureShowcase;