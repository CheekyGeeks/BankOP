import React from 'react';
import { Box, Container, Typography, TextField, Button, Paper, InputAdornment, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const SignInPage = () => {
  return (
    <Box
      sx={{
        py: 6,
        px: 2,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0F1225 0%, #1E2146 100%)',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 5,
            borderRadius: 3,
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
            background: '#1A1F3A',
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{
              mb: 1,
              fontWeight: 700,
              textAlign: 'center',
              color: '#ffffff',
            }}
          >
            Welcome Back
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: 4,
              textAlign: 'center',
              color: '#B8B9C3',
            }}
          >
            Please enter your credentials to continue
          </Typography>
          
          <Box component="form" sx={{ mt: 3 }}>
            <Box sx={{ mb: 3 }}>
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  mb: 1, 
                  fontWeight: 600,
                  color: '#ffffff' 
                }}
              >
                Customer ID
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter your Customer ID"
                variant="outlined"
                InputProps={{
                  sx: {
                    borderRadius: 2,
                    backgroundColor: '#242847',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#353A5F',
                    },
                    color: '#ffffff',
                  },
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineOutlinedIcon sx={{ color: '#7B68EE' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            
            <Box sx={{ mb: 1 }}>
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  mb: 1, 
                  fontWeight: 600,
                  color: '#ffffff' 
                }}
              >
                Token
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter your Token"
                variant="outlined"
                type="password"
                InputProps={{
                  sx: {
                    borderRadius: 2,
                    backgroundColor: '#242847',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#353A5F',
                    },
                    color: '#ffffff',
                  },
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: '#7B68EE' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, mb: 3 }}>
              <Link
                component="button"
                variant="body2"
                sx={{
                  color: '#A288E3',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  }
                }}
              >
                Forgot your Token?
              </Link>
            </Box>
            
            <Button
              component={RouterLink}
              to="/signup"
              variant="text"
              sx={{
                width: '100%',
                py: 1.5,
                mb: 2,
                fontWeight: 600,
                color: '#A288E3',
                '&:hover': {
                  backgroundColor: 'rgba(162, 136, 227, 0.1)',
                }
              }}
            >
              Don't have an account? Sign up
            </Button>
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                py: 1.5,
                borderRadius: 2,
                background: 'linear-gradient(90deg, #7B68EE 0%, #9370DB 100%)',
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(123, 104, 238, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 6px 15px rgba(123, 104, 238, 0.5)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              Continue
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default SignInPage;