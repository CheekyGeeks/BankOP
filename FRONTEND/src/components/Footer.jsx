import React from 'react';
import { Box, Container, Grid, Typography, Link, Stack } from '@mui/material';

// Water drop icon component
const WaterDropIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21C16.4183 21 20 17.4183 20 13C20 8.58172 12 2 12 2C12 2 4 8.58172 4 13C4 17.4183 7.58172 21 12 21Z" 
      fill="white" />
  </svg>
);

const Footer = () => {
  return (
    <Box sx={{ bgcolor: '#0F172A', color: 'white', py: 6 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <WaterDropIcon />
            </Box>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mt: 2 }}>
              © 2025 PayNova, Inc.<br />
              All rights reserved.
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              Quick Links
            </Typography>
            <Stack spacing={1}>
              {['Home', 'About', 'Solutions', 'Contact'].map((link) => (
                <Link
                  key={link}
                  href={link === 'Home' ? '/' : `/${link.toLowerCase()}`}
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                    textDecoration: 'none',
                    '&:hover': {
                      color: 'white',
                    },
                  }}
                >
                  {link}
                </Link>
              ))}
            </Stack>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              Resources
            </Typography>
            <Stack spacing={1}>
              {['FAQs', 'Guides', 'Whitepapers', 'Blog'].map((link) => (
                <Link
                  key={link}
                  href={`/${link.toLowerCase()}`}
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                    textDecoration: 'none',
                    '&:hover': {
                      color: 'white',
                    },
                  }}
                >
                  {link}
                </Link>
              ))}
            </Stack>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              Company
            </Typography>
            <Stack spacing={1}>
              {['About Us', 'Careers', 'Press', 'Contact'].map((link) => (
                <Link
                  key={link}
                  href={`/${link.toLowerCase().replace(' ', '-')}`}
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                    textDecoration: 'none',
                    '&:hover': {
                      color: 'white',
                    },
                  }}
                >
                  {link}
                </Link>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
