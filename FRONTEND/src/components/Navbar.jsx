import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Container,
} from '@mui/material';

// Water drop icon component
const WaterDropIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21C16.4183 21 20 17.4183 20 13C20 8.58172 12 2 12 2C12 2 4 8.58172 4 13C4 17.4183 7.58172 21 12 21Z" 
      fill="white" />
  </svg>
);

const Navbar = () => {
  return (
    <AppBar position="static" elevation={0} sx={{ background: 'transparent', py: 1 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <WaterDropIcon />
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{
                ml: 1,
                fontWeight: 700,
                color: 'white',
                textDecoration: 'none',
              }}
            >
              PayNova
            </Typography>
          </Box>
          
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            {['Home', 'About', 'Solutions', 'Contact'].map((page) => (
              <Button
                key={page}
                component={RouterLink}
                to={page === 'Home' ? '/' : `/${page.toLowerCase()}`}
                sx={{ 
                  mx: 2, 
                  color: 'white',
                }}
              >
                {page}
              </Button>
            ))}
          </Box>
          
          <Button
            variant="contained"
            color="primary"
            sx={{ 
              borderRadius: 28,
              px: 3,
            }}
          >
            Get Started
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;  // Don’t forget to export the component!