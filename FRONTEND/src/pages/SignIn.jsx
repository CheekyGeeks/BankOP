import React, { useState } from 'react';
import { Box, Container, Typography, TextField, Button, Paper, InputAdornment, Link, Snackbar, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import FaceIcon from '@mui/icons-material/Face';

const SignInPage = () => {
  const navigate = useNavigate();
  const [customerId, setCustomerId] = useState('');
  const [token, setToken] = useState('');
  const [tokenRequested, setTokenRequested] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const isFormValid = customerId.trim() !== '' && (tokenRequested ? token.trim() !== '' : true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      setNotification({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'warning'
      });
      return;
    }
    
    if (!tokenRequested) {
      handleGenerateToken();
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const mockData = {
        token: 'mock-auth-token-123456',
        user: {
          id: customerId,
          name: 'Test User'
        }
      };
      localStorage.setItem('authToken', mockData.token);
      localStorage.setItem('userData', JSON.stringify(mockData.user));
      setNotification({
        open: true,
        message: 'Token authentication successful! Proceeding to face verification...',
        severity: 'success'
      });
      setTimeout(() => {
        // Navigate to face authentication instead of dashboard
        navigate('/face-auth', { state: { user: mockData.user } });
      }, 1000);
    } catch (err) {
      setError('Authentication failed. Please try again.');
      setNotification({
        open: true,
        message: 'Authentication failed. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setNotification({ ...notification, open: false });
  };

  const handleGenerateToken = () => {
    if (!customerId) {
      setNotification({
        open: true,
        message: 'Please enter your Customer ID first',
        severity: 'warning'
      });
      return;
    }
    setTokenRequested(true);
    setNotification({
      open: true,
      message: 'Token generation request submitted. Check your email.',
      severity: 'info'
    });
  };

  const handleTokenRequest = () => {
    if (!customerId) {
      setNotification({
        open: true,
        message: 'Please enter your Customer ID first',
        severity: 'warning'
      });
      return;
    }
    setNotification({
      open: true,
      message: 'New token request submitted. Check your email.',
      severity: 'info'
    });
  };

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  const handleContinueWithAuth = () => {
    if (!isFormValid) {
      setNotification({
        open: true,
        message: 'Please enter valid token first',
        severity: 'warning'
      });
      return;
    }
    
    setLoading(true);
    
    // Simulate token authentication
    setTimeout(() => {
      const mockData = {
        token: 'mock-auth-token-123456',
        user: {
          id: customerId,
          name: 'Test User'
        }
      };
      localStorage.setItem('authToken', mockData.token);
      localStorage.setItem('userData', JSON.stringify(mockData.user));
      
      // Navigate to face authentication
      navigate('/face-auth', { state: { user: mockData.user } });
      setLoading(false);
    }, 1500);
  };

  return (
    <Box sx={{ py: 6, px: 2, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0F1225 0%, #1E2146 100%)' }}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 5, borderRadius: 3, boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)', background: '#1A1F3A' }}>
          <Typography variant="h4" component="h1" sx={{ mb: 1, fontWeight: 700, textAlign: 'center', color: '#ffffff' }}>Welcome Back</Typography>
          <Typography variant="body1" sx={{ mb: 4, textAlign: 'center', color: '#B8B9C3' }}>Please enter your credentials to continue</Typography>
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField fullWidth placeholder="Enter your Customer ID" variant="outlined" value={customerId} onChange={(e) => setCustomerId(e.target.value)} InputProps={{ startAdornment: (<InputAdornment position="start"><PersonOutlineOutlinedIcon sx={{ color: '#7B68EE' }} /></InputAdornment>) }} required sx={{ mb: 3, backgroundColor: '#242847', color: '#ffffff' }} />
            
            {!tokenRequested ? (
              <Button 
                onClick={handleGenerateToken}
                variant="outlined" 
                fullWidth
                sx={{ 
                  py: 1.5, 
                  mb: 3, 
                  borderRadius: 2,
                  borderColor: '#7B68EE',
                  color: '#A288E3',
                  '&:hover': { 
                    borderColor: '#9370DB',
                    backgroundColor: 'rgba(162, 136, 227, 0.1)' 
                  }
                }}
              >
                Generate Token
              </Button>
            ) : (
              <>
                <TextField 
                  fullWidth 
                  placeholder="Enter Token" 
                  variant="outlined" 
                  type="password" 
                  value={token} 
                  onChange={(e) => setToken(e.target.value)} 
                  InputProps={{ 
                    startAdornment: (<InputAdornment position="start"><LockOutlinedIcon sx={{ color: '#7B68EE' }} /></InputAdornment>) 
                  }} 
                  required 
                  sx={{ mb: 3, backgroundColor: '#242847', color: '#ffffff' }} 
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                  <Link 
                    component="button" 
                    variant="body2" 
                    onClick={handleTokenRequest} 
                    sx={{ color: '#A288E3', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                  >
                    Didn't receive a Token?
                  </Link>
                </Box>

                {/* Continue with Face Authentication Button */}
                <Button 
                  onClick={handleContinueWithAuth}
                  fullWidth 
                  variant="contained" 
                  disabled={!token.trim() || loading} 
                  startIcon={<FaceIcon />}
                  sx={{ 
                    py: 1.5, 
                    mb: 3,
                    borderRadius: 2, 
                    background: 'linear-gradient(90deg, #7B68EE 0%, #9370DB 100%)', 
                    fontWeight: 600, 
                    boxShadow: '0 4px 12px rgba(123, 104, 238, 0.3)', 
                    transition: 'all 0.3s ease', 
                    '&:hover': { 
                      boxShadow: '0 6px 15px rgba(123, 104, 238, 0.5)', 
                      transform: 'translateY(-2px)' 
                    }, 
                    '&.Mui-disabled': { 
                      background: 'rgba(123, 104, 238, 0.4)', 
                      color: 'rgba(255, 255, 255, 0.7)' 
                    } 
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Continue with Face Verification'}
                </Button>
              </>
            )}
            
            <Button 
              onClick={handleSignUpClick}
              variant="text" 
              sx={{ width: '100%', py: 1.5, fontWeight: 600, color: '#A288E3', '&:hover': { backgroundColor: 'rgba(162, 136, 227, 0.1)' } }}
            >
              Don't have an account? Sign up
            </Button>
          </Box>
        </Paper>
      </Container>
      
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleNotificationClose} 
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleNotificationClose} 
          severity={notification.severity} 
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SignInPage;