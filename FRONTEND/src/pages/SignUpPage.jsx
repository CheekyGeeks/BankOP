import React from 'react';
import { Box, Container, Typography, TextField, Button, Checkbox, FormControlLabel, MenuItem, Grid, Paper } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';

const SignUpPage = () => {
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
          
          <Box component="form" sx={{ mt: 3 }}>
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
                    placeholder="Enter your full name"
                    variant="outlined"
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
                    placeholder="XXXX-XXXX-XXXX"
                    variant="outlined"
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
                    placeholder="Enter your Consumer ID"
                    variant="outlined"
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
                    defaultValue=""
                    placeholder="Select your bank"
                    variant="outlined"
                    InputProps={{
                      sx: {
                        borderRadius: 2,
                      }
                    }}
                  >
                    <MenuItem value="">Select your bank</MenuItem>
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
                    placeholder="XXXX-XXXX-XXXX-XXXX"
                    variant="outlined"
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
                  placeholder="MM/YY"
                  variant="outlined"
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
                  placeholder="***"
                  variant="outlined"
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
              <Grid item xs={12} md={6}>
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
                    Download Software 1
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
              
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
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
                    Download Software 2
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
                  I have downloaded and installed both the softwares
                </Typography>
              }
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              startIcon={<PersonOutlineOutlinedIcon />}
              sx={{
                mt: 4,
                py: 1.5,
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
              Sign Up
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default SignUpPage;