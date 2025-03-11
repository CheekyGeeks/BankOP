import React, { useState } from 'react';
import { Box, Container, Typography, Button, Paper, Grid, Avatar, IconButton, Badge, Chip, Card, CardContent, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PaymentsIcon from '@mui/icons-material/Payments';
import ContactsIcon from '@mui/icons-material/Contacts';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Style constants
const COLORS = {
  primary: '#6B63FB',
  primaryHover: '#5A52E0',
  background: '#0F1225',
  cardBg: '#161A36',
  secondaryBg: '#242847',
  border: '#353A5F',
  textPrimary: '#FFFFFF',
  textSecondary: '#737680',
  error: '#FF6363'
};

// Custom styled components with updated colors
const PurpleButton = styled(Button)(({ theme }) => ({
  backgroundColor: COLORS.primary,
  color: COLORS.textPrimary,
  '&:hover': {
    backgroundColor: COLORS.primaryHover,
  },
  borderRadius: 25,
  padding: '8px 16px',
  fontWeight: 600,
  fontSize: '0.85rem',
}));

const DarkCard = styled(Card)(() => ({
  backgroundColor: COLORS.cardBg,
  borderRadius: 16,
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
}));

// Reusable components
const StyledChip = ({ label, isActive = false, color = COLORS.textSecondary, ...props }) => (
  <Chip 
    label={label} 
    size="small"
    sx={{ 
      bgcolor: COLORS.secondaryBg, 
      color: isActive ? COLORS.textPrimary : color,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 4,
      fontSize: '0.75rem',
      height: '24px',
      ...props.sx
    }} 
    {...props}
  />
);

const ContactItem = ({ contact }) => (
  <Box 
    sx={{ 
      p: 1.5, 
      bgcolor: COLORS.secondaryBg, 
      borderRadius: 2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Avatar sx={{ 
        bgcolor: contact.id % 2 === 0 ? COLORS.primary : COLORS.primaryHover, 
        color: COLORS.textPrimary, 
        mr: 2,
        width: 28,
        height: 28,
        fontSize: '0.8rem'
      }}>
        {contact.initial}
      </Avatar>
      <Typography variant="body2">{contact.name}</Typography>
    </Box>
    <IconButton size="small">
      <PaymentsIcon sx={{ color: COLORS.textSecondary, fontSize: '1.1rem' }} />
    </IconButton>
  </Box>
);

const MetricCard = ({ title, value, percentChange, isPositive = true }) => (
  <DarkCard>
    <CardContent sx={{ p: 2, pb: 2, '&:last-child': { pb: 2 } }}>
      <Typography variant="body2" color={COLORS.textSecondary}>
        {title}
      </Typography>
      <Typography variant="h5" fontWeight={700} sx={{ mt: 0.5, mb: 1 }}>
        {value}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Chip 
          label={`${isPositive ? '+' : ''}${percentChange}%`} 
          size="small" 
          sx={{ 
            bgcolor: isPositive ? 'rgba(107, 99, 251, 0.2)' : 'rgba(255, 99, 99, 0.2)', 
            color: isPositive ? COLORS.primary : COLORS.error,
            mr: 1,
            height: '18px',
            fontSize: '0.65rem'
          }} 
        />
        <Typography variant="caption" color={COLORS.textSecondary}>
          Since last month
        </Typography>
      </Box>
    </CardContent>
  </DarkCard>
);

// Dashboard Component
const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(18);
  const currentDate = new Date();
  const hours = currentDate.getHours();
  const userName = "Sarah Moller";
  
  // Greeting based on time of day
  let greeting = "Good morning";
  if (hours >= 12 && hours < 17) {
    greeting = "Good afternoon";
  } else if (hours >= 17) {
    greeting = "Good evening";
  }
  
  // Calendar days - full 31 days
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  
  // Contacts
  const contacts = [
    { id: 1, name: "Alex Johnson", initial: "A" },
    { id: 2, name: "Maria Garcia", initial: "M" },
    { id: 3, name: "David Chen", initial: "D" },
    { id: 4, name: "Sophie Kim", initial: "S" },
    { id: 5, name: "Omar Ahmed", initial: "O" }
  ];
  
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: COLORS.background, 
      color: COLORS.textPrimary,
      pb: 3
    }}>
      {/* Top navigation - simplified with only Payment */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        px: 3,
        py: 1.5,
        borderBottom: `1px solid ${COLORS.border}`
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box component="img" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeD0iMiIgeT0iMiIgd2lkdGg9IjgiIGhlaWdodD0iOCIgcng9IjIiIGZpbGw9IiM2QjYzRkIiLz4KPHJlY3QgeD0iMTQiIHk9IjIiIHdpZHRoPSI4IiBoZWlnaHQ9IjgiIHJ4PSIyIiBmaWxsPSIjRkZGRkZGIiBmaWxsLW9wYWNpdHk9IjAuNSIvPgo8cmVjdCB4PSIyIiB5PSIxNCIgd2lkdGg9IjgiIGhlaWdodD0iOCIgcng9IjIiIGZpbGw9IiNGRkZGRkYiIGZpbGwtb3BhY2l0eT0iMC41Ii8+CjxyZWN0IHg9IjE0IiB5PSIxNCIgd2lkdGg9IjgiIGhlaWdodD0iOCIgcng9IjIiIGZpbGw9IiNGRkZGRkYiIGZpbGwtb3BhY2l0eT0iMC41Ii8+Cjwvc3ZnPg==" alt="Logo" sx={{ width: 24, height: 24, mr: 2 }} />
          
          <Box sx={{ display: 'flex', mx: 3 }}>
            <Button 
              size="small"
              sx={{ 
                color: COLORS.textPrimary,
                bgcolor: COLORS.primary,
                borderRadius: 4, 
                px: 1.5,
                py: 0.5,
                fontSize: '0.8rem',
                minWidth: 'auto'
              }}
            >
              Payment
            </Button>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Badge badgeContent={3} color="error" sx={{ mr: 2 }}>
            <NotificationsIcon sx={{ fontSize: '1.1rem' }} />
          </Badge>
          <Box sx={{ display: 'flex', alignItems: 'center', borderRadius: 28, bgcolor: COLORS.primary, color: COLORS.textPrimary, p: 0.5, pl: 1 }}>
            <Typography variant="body2" sx={{ mr: 1, fontWeight: 500, fontSize: '0.8rem' }}>{userName}</Typography>
            <Avatar sx={{ width: 28, height: 28, bgcolor: COLORS.primaryHover, fontSize: '0.7rem' }}>SM</Avatar>
          </Box>
          <IconButton size="small" sx={{ ml: 1 }}>
            <SettingsIcon sx={{ color: COLORS.textSecondary, fontSize: '1.1rem' }} />
          </IconButton>
        </Box>
      </Box>

      {/* Main content */}
      <Container maxWidth="xl" sx={{ mt: 3 }}>
        {/* Enhanced Greeting */}
        <Box sx={{ 
          mb: 3, 
          textAlign: 'center',
          background: `linear-gradient(120deg, ${COLORS.primary}, ${COLORS.primaryHover})`,
          borderRadius: 3,
          p: 2.5,
          boxShadow: '0 8px 16px rgba(107, 99, 251, 0.15)'
        }}>
          <Typography variant="h3" fontWeight={700} sx={{ 
            mb: 0.5,
            textShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
            background: 'linear-gradient(to right, #ffffff, #e0e0ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {greeting}, {userName.split(' ')[0]}!
          </Typography>
          <Typography variant="h6" sx={{ 
            color: 'rgba(255, 255, 255, 0.9)',
            fontWeight: 500
          }}>
            It's {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </Typography>
        </Box>

        {/* Key metric - only Available Balance */}
        <Grid container sx={{ mb: 2 }}>
          <Grid item xs={12}>
            <DarkCard sx={{ mb: 2 }}>
              <CardContent sx={{ p: 2, pb: '16px !important' }}>
                <Typography variant="body2" color={COLORS.textSecondary}>
                  Available Balance
                </Typography>
                <Typography variant="h5" fontWeight={700} sx={{ mt: 0.5, mb: 1 }}>
                  Rs. 860,513
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Chip 
                    label="+2.45%" 
                    size="small" 
                    sx={{ 
                      bgcolor: 'rgba(107, 99, 251, 0.2)',
                      color: COLORS.primary,
                      mr: 1,
                      height: '18px',
                      fontSize: '0.65rem'
                    }} 
                  />
                  <Typography variant="caption" color={COLORS.textSecondary}>
                    Since last month
                  </Typography>
                </Box>
              </CardContent>
            </DarkCard>
          </Grid>
        </Grid>

        {/* Main sections */}
        <Grid container spacing={2}>
          {/* Initiate New Payroll with compact calendar */}
          <Grid item xs={12} md={6}>
            <DarkCard>
              <CardContent sx={{ p: 2, pb: '16px !important' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Initiate New Payroll
                  </Typography>
                  <PurpleButton 
                    startIcon={<AddCircleOutlineIcon sx={{ fontSize: '1rem' }} />}
                    sx={{ py: 0.5, px: 1.5, fontSize: '0.8rem' }}
                  >
                    Add Payment
                  </PurpleButton>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 0.5, mb: 1.5, flexWrap: 'wrap' }}>
                  {["All", "Taxes", "Salary", "Software", "Rent"].map((filter, index) => (
                    <StyledChip 
                      key={filter}
                      label={filter} 
                      isActive={filter === 'All'}
                    />
                  ))}
                </Box>
                
                {/* Ultra Compact Calendar Section */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                  <Typography variant="body2" color={COLORS.textSecondary} sx={{ mr: 1, mt: 0.5 }}>
                    Payment date:
                  </Typography>
                  <Box sx={{ 
                    display: 'grid',
                    gridTemplateColumns: 'repeat(8, 1fr)',
                    gap: 0.75,
                    maxWidth: 240
                  }}>
                    {days.map((day) => (
                      <Box 
                        key={day}
                        sx={{
                          width: 22,
                          height: 22,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '50%',
                          bgcolor: day === selectedDate ? COLORS.primary : 'transparent',
                          color: day === selectedDate ? COLORS.textPrimary : COLORS.textPrimary,
                          cursor: 'pointer',
                          fontSize: '0.7rem',
                          border: day === selectedDate ? 'none' : `1px solid ${COLORS.border}`,
                        }}
                        onClick={() => setSelectedDate(day)}
                      >
                        {day}
                      </Box>
                    ))}
                  </Box>
                </Box>
                
                <Box sx={{ 
                  p: 1.5, 
                  bgcolor: COLORS.secondaryBg, 
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: COLORS.primary, color: COLORS.textPrimary, mr: 1.5, width: 30, height: 30, fontSize: '0.8rem' }}>F</Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight={500}>Figma</Typography>
                      <Typography variant="caption" color={COLORS.textSecondary}>Collective</Typography>
                    </Box>
                  </Box>
                  <Box>
                    <IconButton size="small">
                      <ArrowForwardIcon sx={{ color: COLORS.primary, fontSize: '1.1rem' }} />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </DarkCard>
          </Grid>

          {/* Contacts */}
          <Grid item xs={12} md={6}>
            <DarkCard>
              <CardContent sx={{ p: 2, pb: '16px !important' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Contacts
                  </Typography>
                  <IconButton size="small" sx={{ bgcolor: COLORS.primary, color: COLORS.textPrimary, '&:hover': { bgcolor: COLORS.primaryHover }, p: 0.75 }}>
                    <AddCircleOutlineIcon sx={{ fontSize: '1.1rem' }} />
                  </IconButton>
                </Box>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {contacts.map((contact) => (
                    <ContactItem key={contact.id} contact={contact} />
                  ))}
                </Box>
              </CardContent>
            </DarkCard>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;