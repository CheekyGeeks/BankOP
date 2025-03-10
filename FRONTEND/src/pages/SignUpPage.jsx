import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, TextField, Button, Checkbox, FormControlLabel, MenuItem, Grid, Paper } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import BiometricAuthentication from './BiometricAuthentication';

const SignUpPage = () => {
  const navigate = useNavigate();
  
  // Add step state for multi-step form
  const [currentStep, setCurrentStep] = useState('form'); // 'form' or 'biometric'
  
  // Form state management
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    phoneNumber: '',
    aadharNumber: '',
    consumerId: '',
    bankName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    softwareDownloaded: false
  });
  
  // Error state management
  const [errors, setErrors] = useState({
    userName: false,
    email: false,
    phoneNumber: false,
    aadharNumber: false,
    consumerId: false,
    bankName: false,
    cardNumber: false,
    expiryDate: false,
    cvv: false
  });
  
  // Loading state for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: false
      });
    }
  };
  
  // Handle checkbox change
  const handleCheckboxChange = (e) => {
    setFormData({
      ...formData,
      softwareDownloaded: e.target.checked
    });
  };
  
  // Validate email format
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  
  // Validate phone number format
  const isValidPhone = (phone) => {
    return /^\d{10}$/.test(phone);
  };
  
  // Handle form submission - modified to move to biometric step
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {
      userName: !formData.userName,
      email: !formData.email || !isValidEmail(formData.email),
      phoneNumber: !formData.phoneNumber || !isValidPhone(formData.phoneNumber),
      aadharNumber: !formData.aadharNumber,
      consumerId: !formData.consumerId,
      bankName: !formData.bankName,
      cardNumber: !formData.cardNumber,
      expiryDate: !formData.expiryDate,
      cvv: !formData.cvv
    };
    
    setErrors(newErrors);
    
    // Check if any errors exist
    if (Object.values(newErrors).some(error => error) || !formData.softwareDownloaded) {
      return;
    }
    
    // Proceed to biometric authentication instead of submitting form
    setCurrentStep('biometric');
  };
  
  // Handle final submission after biometric authentication
  const handleFinalSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Example API call (replace with your actual API call)
      // const response = await fetch('/api/signup', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData),
      // });
      
      // if (!response.ok) {
      //   throw new Error('Signup failed');
      // }
      
      // Mock successful submission
      setTimeout(() => {
        console.log('Form submitted successfully:', formData);
        setIsSubmitting(false);
        // Redirect to signin page on success
        navigate('/signin');
      }, 1500);
      
    } catch (error) {
      setIsSubmitting(false);
      console.error('Error submitting form:', error);
      // Handle error (show error message)
    }
  };
  
  // Function to go back to form from biometric step
  const handleBackToForm = () => {
    setCurrentStep('form');
  };
  
  // Handle navigation to sign in page
  const handleSignInClick = () => {
    navigate('/signin');
  };

  // Render form step
  const renderFormStep = () => {
    return (
      <Box
        sx={{
          py: 6,
          px: 2,
          minHeight: 'calc(100vh - 128px)', // Account for navbar and footer
          position: 'relative',
        }}
      >
        <Container maxWidth="md">
          <Paper
            elevation={6}
            sx={{
              p: 4,
              borderRadius: 3,
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
              background: 'rgba(30, 41, 59, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(138, 43, 226, 0.1)',
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              sx={{
                mb: 1,
                fontWeight: 700,
                textAlign: 'center',
                background: 'linear-gradient(90deg, #FFFFFF 0%, rgba(162, 155, 254, 0.8) 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Create Your Account
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 4,
                textAlign: 'center',
                color: 'text.secondary',
              }}
            >
              Complete the form below to get started with Pay Flow
            </Typography>
            
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              {/* Personal Information Section - 2 Column Layout */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 3 }}>
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        mb: 1, 
                        fontWeight: 600 
                      }}
                    >
                      User Name
                    </Typography>
                    <TextField
                      fullWidth
                      name="userName"
                      value={formData.userName}
                      onChange={handleChange}
                      placeholder="Enter your full name (Required)"
                      variant="outlined"
                      error={errors.userName}
                      helperText={errors.userName ? "User name is required" : ""}
                      InputProps={{
                        sx: {
                          borderRadius: 2,
                        }
                      }}
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 3 }}>
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        mb: 1, 
                        fontWeight: 600 
                      }}
                    >
                      Email
                    </Typography>
                    <TextField
                      fullWidth
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email (Required)"
                      variant="outlined"
                      error={errors.email}
                      helperText={errors.email ? "Valid email is required" : ""}
                      InputProps={{
                        sx: {
                          borderRadius: 2,
                        }
                      }}
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 3 }}>
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        mb: 1, 
                        fontWeight: 600 
                      }}
                    >
                      Phone Number
                    </Typography>
                    <TextField
                      fullWidth
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="10-digit phone number (Required)"
                      variant="outlined"
                      error={errors.phoneNumber}
                      helperText={errors.phoneNumber ? "Valid 10-digit phone number is required" : ""}
                      InputProps={{
                        sx: {
                          borderRadius: 2,
                        }
                      }}
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 3 }}>
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        mb: 1, 
                        fontWeight: 600 
                      }}
                    >
                      Aadhar Number
                    </Typography>
                    <TextField
                      fullWidth
                      name="aadharNumber"
                      value={formData.aadharNumber}
                      onChange={handleChange}
                      placeholder="XXXX-XXXX-XXXX (Required)"
                      variant="outlined"
                      error={errors.aadharNumber}
                      helperText={errors.aadharNumber ? "Aadhar number is required" : ""}
                      InputProps={{
                        sx: {
                          borderRadius: 2,
                        }
                      }}
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 3 }}>
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        mb: 1, 
                        fontWeight: 600 
                      }}
                    >
                      Consumer ID
                    </Typography>
                    <TextField
                      fullWidth
                      name="consumerId"
                      value={formData.consumerId}
                      onChange={handleChange}
                      placeholder="Enter your Consumer ID (Required)"
                      variant="outlined"
                      error={errors.consumerId}
                      helperText={errors.consumerId ? "Consumer ID is required" : ""}
                      InputProps={{
                        sx: {
                          borderRadius: 2,
                        }
                      }}
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 3 }}>
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        mb: 1, 
                        fontWeight: 600 
                      }}
                    >
                      Bank Name
                    </Typography>
                    <TextField
                      select
                      fullWidth
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleChange}
                      placeholder="Select your bank"
                      variant="outlined"
                      error={errors.bankName}
                      helperText={errors.bankName ? "Bank name is required" : ""}
                      InputProps={{
                        sx: {
                          borderRadius: 2,
                        }
                      }}
                    >
                      <MenuItem value="">Select your bank (Required)</MenuItem>
                      <MenuItem value="hdfc">HDFC Bank</MenuItem>
                      <MenuItem value="sbi">State Bank of India</MenuItem>
                      <MenuItem value="axis">Axis Bank</MenuItem>
                      <MenuItem value="icici">ICICI Bank</MenuItem>
                    </TextField>
                  </Box>
                </Grid>
              </Grid>
              
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  mt: 4, 
                  mb: 2, 
                  fontWeight: 700,
                  color: 'primary.light'
                }}
              >
                Debit Card Information
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box sx={{ mb: 3 }}>
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        mb: 1, 
                        fontWeight: 600 
                      }}
                    >
                      Card Number
                    </Typography>
                    <TextField
                      fullWidth
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      placeholder="XXXX-XXXX-XXXX-XXXX (Required)"
                      variant="outlined"
                      error={errors.cardNumber}
                      helperText={errors.cardNumber ? "Card number is required" : ""}
                      InputProps={{
                        sx: {
                          borderRadius: 2,
                        }
                      }}
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      mb: 1, 
                      fontWeight: 600 
                    }}
                  >
                    Expiry Date
                  </Typography>
                  <TextField
                    fullWidth
                    name="expiryDate"
                    type="month"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    placeholder="MM/YYYY (Required)"
                    variant="outlined"
                    error={errors.expiryDate}
                    helperText={errors.expiryDate ? "Expiry date is required" : ""}
                    InputProps={{
                      sx: {
                        borderRadius: 2,
                      }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      mb: 1, 
                      fontWeight: 600 
                    }}
                  >
                    CVV
                  </Typography>
                  <TextField
                    fullWidth
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleChange}
                    placeholder="*** (Required)"
                    variant="outlined"
                    error={errors.cvv}
                    helperText={errors.cvv ? "CVV is required" : ""}
                    InputProps={{
                      sx: {
                        borderRadius: 2,
                      }
                    }}
                  />
                </Grid>
              </Grid>
              
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  mt: 4, 
                  mb: 2, 
                  fontWeight: 700,
                  color: 'primary.light'
                }}
              >
                Required Software
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box sx={{ mb: 2 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<CloudDownloadOutlinedIcon />}
                      sx={{
                        py: 1.5,
                        borderRadius: 2,
                        background: 'linear-gradient(45deg, #4169E1 30%, #6495ED 90%)',
                        fontWeight: 600,
                        boxShadow: '0 4px 12px rgba(65, 105, 225, 0.3)',
                        transition: 'all 0.3s ease',
                        justifyContent: 'center',
                        '&:hover': {
                          boxShadow: '0 6px 15px rgba(65, 105, 225, 0.5)',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      Download Required Software
                    </Button>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5, ml: 1 }}>
                      <InfoOutlinedIcon sx={{ fontSize: 16, color: 'primary.light', mr: 0.5 }} />
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: 'primary.light',
                        }}
                      >
                        Why download this?
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
              
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={formData.softwareDownloaded}
                    onChange={handleCheckboxChange}
                    sx={{
                      color: 'primary.main',
                      '&.Mui-checked': {
                        color: 'primary.main',
                      },
                    }}
                  />
                }
                label={
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'text.secondary',
                    }}
                  >
                    I have downloaded and installed the required software
                  </Typography>
                }
              />
              
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} md={6}>
                  <Button
                    type="button"
                    onClick={handleSignInClick}
                    variant="outlined"
                    sx={{
                      width: '100%',
                      py: 1.5,
                      fontWeight: 600,
                      color: '#7B68EE',
                      borderColor: '#7B68EE',
                      borderRadius: 2,
                      '&:hover': {
                        borderColor: '#7B68EE',
                        backgroundColor: 'rgba(123, 104, 238, 0.05)',
                      }
                    }}
                  >
                    Already have an account? Sign in
                  </Button>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    startIcon={<PersonOutlineOutlinedIcon />}
                    disabled={isSubmitting || 
                      !formData.userName || 
                      !formData.email ||
                      !formData.phoneNumber ||
                      !formData.aadharNumber || 
                      !formData.consumerId || 
                      !formData.bankName || 
                      !formData.cardNumber || 
                      !formData.expiryDate || 
                      !formData.cvv ||
                      !formData.softwareDownloaded}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      background: 'linear-gradient(45deg, #00A36C 30%, #00C78C 90%)',
                      fontWeight: 600,
                      boxShadow: '0 4px 12px rgba(0, 163, 108, 0.3)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 6px 15px rgba(0, 163, 108, 0.5)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    Continue to Verification
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Container>
      </Box>
    );
  };

  return (
    <>
      {currentStep === 'form' ? (
        renderFormStep()
      ) : (
        <BiometricAuthentication 
          formData={formData} 
          onBackClick={handleBackToForm}
          onComplete={handleFinalSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </>
  );
};

export default SignUpPage;