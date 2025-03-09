import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

// Enhanced water drop logo with gradient
const PayNovaLogo = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="dropGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8A2BE2" />
        <stop offset="100%" stopColor="#7B68EE" />
      </linearGradient>
    </defs>
    <path 
      d="M12 21C16.4183 21 20 17.4183 20 13C20 8.58172 12 2 12 2C12 2 4 8.58172 4 13C4 17.4183 7.58172 21 12 21Z" 
      fill="url(#dropGradient)" 
      filter="drop-shadow(0px 2px 4px rgba(138, 43, 226, 0.3))"
    />
  </svg>
);

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [anchorElNav, setAnchorElNav] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const navItems = ['Home', 'About', 'Solutions', 'Contact'];

  return (
    <AppBar 
      position="fixed" 
      elevation={scrolled ? 4 : 0} 
      sx={{ 
        background: scrolled 
          ? 'linear-gradient(90deg, rgba(30, 30, 47, 0.95) 0%, rgba(42, 42, 69, 0.95) 100%)' 
          : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        transition: 'all 0.3s ease',
        borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
        py: scrolled ? 0.5 : 1
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo - visible on all screens */}
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <PayNovaLogo />
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{
                ml: 1,
                fontWeight: 700,
                color: 'white',
                textDecoration: 'none',
                background: 'linear-gradient(90deg, #FFFFFF 0%, #E0E0FF 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '0.5px'
              }}
            >
              PayNova
            </Typography>
          </Box>

          {/* Mobile menu */}
          {isMobile && (
            <>
              <Box sx={{ flexGrow: 1 }} />
              <IconButton
                size="large"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                  '& .MuiPaper-root': {
                    backgroundColor: 'rgba(30, 30, 47, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 2,
                    mt: 1
                  }
                }}
              >
                {navItems.map((page) => (
                  <MenuItem key={page} onClick={handleCloseNavMenu} component={RouterLink} to={page === 'Home' ? '/' : `/${page.toLowerCase()}`}>
                    <Typography textAlign="center" sx={{ color: 'white' }}>{page}</Typography>
                  </MenuItem>
                ))}
                <MenuItem>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ 
                      borderRadius: 28,
                      background: 'linear-gradient(45deg, #8A2BE2 30%, #7B68EE 90%)',
                      textTransform: 'none',
                      fontWeight: 600
                    }}
                  >
                    Get Started
                  </Button>
                </MenuItem>
              </Menu>
            </>
          )}

          {/* Desktop menu */}
          {!isMobile && (
            <>
              <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                {navItems.map((page) => (
                  <Button
                    key={page}
                    component={RouterLink}
                    to={page === 'Home' ? '/' : `/${page.toLowerCase()}`}
                    sx={{ 
                      mx: 2, 
                      color: 'white',
                      fontSize: '0.95rem',
                      textTransform: 'none',
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        width: '0%',
                        height: '2px',
                        bottom: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'linear-gradient(90deg, #8A2BE2, #7B68EE)',
                        transition: 'width 0.3s ease',
                        borderRadius: '2px'
                      },
                      '&:hover::after': {
                        width: '70%'
                      }
                    }}
                  >
                    {page}
                  </Button>
                ))}
              </Box>
              
              <Button
                variant="contained"
                sx={{ 
                  borderRadius: 28,
                  px: 3,
                  py: 1,
                  background: 'linear-gradient(45deg, #8A2BE2 30%, #7B68EE 90%)',
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: '0 4px 20px rgba(138, 43, 226, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 6px 25px rgba(138, 43, 226, 0.5)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Get Started
              </Button>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;