import React from 'react';
import { Box, Container, Typography, Button, Paper, Grid, Avatar, IconButton, Badge, Chip, Card, CardContent } from '@mui/material';
import { styled } from '@mui/material/styles';
import PaymentsIcon from '@mui/icons-material/Payments';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SortIcon from '@mui/icons-material/Sort';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

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
  error: '#FF6363',
  success: '#4CAF50',
  warning: '#FFA726',
  pending: '#FFD700'
};

// Custom styled components with updated colors and fonts
const PurpleButton = styled(Button)(({ theme }) => ({
  backgroundColor: COLORS.primary,
  color: COLORS.textPrimary,
  '&:hover': {
    backgroundColor: COLORS.primaryHover,
  },
  borderRadius: 12,
  padding: '10px 16px',
  fontWeight: 600,
  fontSize: '0.9rem',
  fontFamily: "'Inter', 'Segoe UI', Roboto, sans-serif",
  textTransform: 'none',
  boxShadow: '0 4px 12px rgba(107, 99, 251, 0.3)',
}));

const DarkCard = styled(Card)(() => ({
  backgroundColor: COLORS.cardBg,
  borderRadius: 20,
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
  height: '100%',
  border: `1px solid ${COLORS.border}`,
  overflow: 'hidden',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.3)',
    transform: 'translateY(-2px)',
  },
}));

// Reusable components
const StyledChip = ({ label, isActive = false, color = COLORS.textSecondary, ...props }) => (
  <Chip 
    label={label} 
    size="small"
    sx={{ 
      bgcolor: isActive ? COLORS.primary : COLORS.secondaryBg, 
      color: isActive ? COLORS.textPrimary : color,
      border: isActive ? 'none' : `1px solid ${COLORS.border}`,
      borderRadius: 10,
      fontSize: '0.75rem',
      height: '28px',
      fontFamily: "'Inter', 'Segoe UI', Roboto, sans-serif",
      fontWeight: 500,
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
      borderRadius: 3,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      transition: 'all 0.2s ease',
      '&:hover': {
        bgcolor: `rgba(36, 40, 71, 0.8)`,
        transform: 'translateX(4px)'
      }
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Avatar sx={{ 
        bgcolor: contact.id % 2 === 0 ? COLORS.primary : COLORS.primaryHover, 
        color: COLORS.textPrimary, 
        mr: 2,
        width: 32,
        height: 32,
        fontSize: '0.8rem',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
      }}>
        {contact.initial}
      </Avatar>
      <Typography variant="body2" fontFamily="'Inter', 'Segoe UI', Roboto, sans-serif" fontWeight={500}>{contact.name}</Typography>
    </Box>
    <IconButton size="small" sx={{ bgcolor: 'rgba(107, 99, 251, 0.1)', '&:hover': { bgcolor: 'rgba(107, 99, 251, 0.2)' } }}>
      <PaymentsIcon sx={{ color: COLORS.primary, fontSize: '1.1rem' }} />
    </IconButton>
  </Box>
);

const StatusChip = ({ status }) => {
  let color = COLORS.success;
  let bgcolor = 'rgba(76, 175, 80, 0.2)';
  let label = 'Done';

  if (status === 'pending') {
    color = COLORS.warning;
    bgcolor = 'rgba(255, 215, 0, 0.2)';
    label = 'Pending';
  }

  return (
    <Chip 
      label={label}
      size="small"
      sx={{
        color,
        bgcolor,
        fontSize: '0.7rem',
        height: '24px',
        fontWeight: 600,
        borderRadius: 10,
        fontFamily: "'Inter', 'Segoe UI', Roboto, sans-serif",
      }}
    />
  );
};

// Transaction icon selector
const getTransactionIcon = (category) => {
  switch (category.toLowerCase()) {
    case 'shopping':
      return <ShoppingBasketIcon sx={{ color: COLORS.primary, fontSize: '1.2rem' }} />;
    case 'grocery':
      return <LocalGroceryStoreIcon sx={{ color: '#4CAF50', fontSize: '1.2rem' }} />;
    case 'laundry':
      return <LocalLaundryServiceIcon sx={{ color: '#29B6F6', fontSize: '1.2rem' }} />;
    case 'car repair':
      return <DirectionsCarIcon sx={{ color: '#FFA726', fontSize: '1.2rem' }} />;
    default:
      return <PaymentsIcon sx={{ color: COLORS.primary, fontSize: '1.2rem' }} />;
  }
};

// Payroll history data
const payrollHistory = [
  { id: 1, date: "Mar 01, 2024", amount: 28500, recipients: 12 },
  { id: 2, date: "Feb 01, 2024", amount: 27800, recipients: 12 },
  { id: 3, date: "Jan 01, 2024", amount: 27800, recipients: 12 }
];

// Dashboard Component
const Dashboard = () => {
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
  
  // Contacts
  const contacts = [
    { id: 1, name: "Alex Johnson", initial: "A" },
    { id: 2, name: "Maria Garcia", initial: "M" },
    { id: 3, name: "David Chen", initial: "D" },
    { id: 4, name: "Sophie Kim", initial: "S" },
    { id: 5, name: "Omar Ahmed", initial: "O" }
  ];

  // Team payments data
  const teamPayments = [
    { id: 1, name: "Devon Lane", avatar: "D", date: "Mar 17, 2024", amount: 1345, status: "done" },
    { id: 2, name: "Leslie Alexander", avatar: "L", date: "Mar 17, 2024", amount: 5859, status: "done" },
    { id: 3, name: "Guy Hawkins", avatar: "G", date: "Mar 17, 2024", amount: 3353, status: "done" },
    { id: 4, name: "Annette Black", avatar: "A", date: "Mar 17, 2024", amount: 2242, status: "pending" }
  ];

  // Recent transactions data
  const recentTransactions = [
    { id: 1, category: "Shopping", date: "Jun 23, 2021", time: "06:10 pm", amount: 260 },
    { id: 2, category: "Grocery", date: "Jun 23, 2021", time: "02:00 pm", amount: 40 },
    { id: 3, category: "Laundry", date: "Jun 23, 2021", time: "04:19 pm", amount: 80 },
    { id: 4, category: "Car Repair", date: "Jun 23, 2021", time: "08:20 pm", amount: 100 }
  ];
  
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: COLORS.background, 
      color: COLORS.textPrimary,
      pb: 3,
      fontFamily: "'Inter', 'Segoe UI', Roboto, sans-serif",
    }}>
      {/* Main content - removed navbar as requested */}
      <Container maxWidth="lg" sx={{ pt: 4 }}>
        {/* Enhanced Greeting */}
        <Box sx={{ 
          mb: 4, 
          background: `linear-gradient(120deg, ${COLORS.primary}, ${COLORS.primaryHover})`,
          borderRadius: 4,
          p: 3,
          boxShadow: '0 12px 24px rgba(107, 99, 251, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Box>
            <Typography variant="h3" fontWeight={700} sx={{ 
              mb: 1,
              fontFamily: "'Poppins', 'Segoe UI', Roboto, sans-serif",
              background: 'linear-gradient(to right, #ffffff, #e0e0ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {greeting}, {userName.split(' ')[0]}!
            </Typography>
            <Typography variant="h6" sx={{ 
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: 500,
              fontFamily: "'Inter', 'Segoe UI', Roboto, sans-serif",
            }}>
              {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Badge badgeContent={3} color="error" sx={{ mr: 2 }}>
              <NotificationsIcon sx={{ fontSize: '1.3rem', color: 'white' }} />
            </Badge>
            <Box sx={{ display: 'flex', alignItems: 'center', borderRadius: 28, bgcolor: 'rgba(255, 255, 255, 0.15)', color: COLORS.textPrimary, p: 0.75, pl: 2 }}>
              <Typography variant="body2" sx={{ mr: 1, fontWeight: 500, fontSize: '0.9rem' }}>{userName}</Typography>
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255, 255, 255, 0.2)', fontSize: '0.8rem', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}>SM</Avatar>
            </Box>
            <IconButton size="small" sx={{ ml: 1, bgcolor: 'rgba(255, 255, 255, 0.15)', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.25)' } }}>
              <SettingsIcon sx={{ color: 'white', fontSize: '1.1rem' }} />
            </IconButton>
          </Box>
        </Box>

        {/* Key metric - Available Balance */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12}>
            <DarkCard sx={{ 
              background: `linear-gradient(to right, ${COLORS.cardBg}, ${COLORS.cardBg}, rgba(107, 99, 251, 0.15))`,
              position: 'relative',
              overflow: 'hidden'
            }}>
              <Box sx={{ position: 'absolute', bottom: -20, right: -20, width: 150, height: 150, borderRadius: '50%', background: 'radial-gradient(circle, rgba(107, 99, 251, 0.2) 0%, rgba(107, 99, 251, 0) 70%)' }} />
              <CardContent sx={{ p: 3, pb: '24px !important' }}>
                <Typography variant="body2" color={COLORS.textSecondary} sx={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '0.9rem' }}>
                  Available Balance
                </Typography>
                <Typography variant="h4" fontWeight={700} sx={{ mt: 1, mb: 1.5, fontFamily: "'Poppins', sans-serif" }}>
                  ₹ 860,513
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Chip 
                    label="+2.45%" 
                    size="small" 
                    sx={{ 
                      bgcolor: 'rgba(107, 99, 251, 0.2)',
                      color: COLORS.primary,
                      mr: 1.5,
                      height: '24px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      borderRadius: 8,
                      fontFamily: "'Inter', sans-serif",
                    }} 
                  />
                  <Typography variant="caption" color={COLORS.textSecondary} sx={{ fontSize: '0.8rem', fontFamily: "'Inter', sans-serif" }}>
                    Since last month
                  </Typography>
                </Box>
              </CardContent>
            </DarkCard>
          </Grid>
        </Grid>

        {/* Main sections */}
        <Grid container spacing={3}>
          {/* Team Payments Section */}
          <Grid item xs={12} md={6} lg={6}>
            <DarkCard>
              <CardContent sx={{ p: 3, pb: '24px !important' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.1rem' }}>
                    Team Payments
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: COLORS.secondaryBg, borderRadius: 20, p: 0.5, pl: 1.5 }}>
                    <CalendarTodayIcon sx={{ fontSize: '0.9rem', mr: 0.5, color: COLORS.textSecondary }} />
                    <Typography variant="caption" color={COLORS.textSecondary} sx={{ mr: 0.5, fontFamily: "'Inter', sans-serif" }}>
                      Mar 17, 2024
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {teamPayments.map((payment) => (
                    <Box 
                      key={payment.id}
                      sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 2,
                        borderRadius: 3,
                        bgcolor: COLORS.secondaryBg,
                        border: payment.id === 4 ? `1px dashed ${COLORS.border}` : 'none',
                        transition: 'transform 0.2s ease',
                        '&:hover': {
                          transform: 'translateX(4px)'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          sx={{ 
                            width: 40, 
                            height: 40, 
                            mr: 2, 
                            bgcolor: payment.id % 2 === 0 ? COLORS.primary : COLORS.primaryHover,
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                          }}
                        >
                          {payment.avatar}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={600} sx={{ fontFamily: "'Inter', sans-serif" }}>{payment.name}</Typography>
                          <Typography variant="caption" color={COLORS.textSecondary} sx={{ fontFamily: "'Inter', sans-serif" }}>{payment.date}</Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" fontWeight={600} sx={{ mr: 2, fontFamily: "'Inter', sans-serif" }}>
                          ₹{payment.amount.toLocaleString()}
                        </Typography>
                        <StatusChip status={payment.status} />
                        <IconButton size="small" sx={{ ml: 1, bgcolor: 'rgba(107, 99, 251, 0.05)', '&:hover': { bgcolor: 'rgba(107, 99, 251, 0.1)' } }}>
                          <MoreVertIcon sx={{ color: COLORS.textSecondary, fontSize: '1.1rem' }} />
                        </IconButton>
                      </Box>
                    </Box>
                  ))}
                </Box>
                
                {/* Add completion percentage for Annette Black */}
                <Box sx={{ 
                  mt: 2, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'flex-end',
                  pr: 1
                }}>
                  <Box sx={{ 
                    width: 24, 
                    height: 24, 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    bgcolor: 'rgba(107, 99, 251, 0.15)',
                    color: COLORS.primary,
                    mr: 1,
                    fontWeight: 600
                  }}>
                    %
                  </Box>
                  <Typography variant="caption" color={COLORS.textSecondary} sx={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>82% Complete</Typography>
                </Box>
              </CardContent>
            </DarkCard>
          </Grid>

          {/* Recent Transactions Section */}
          <Grid item xs={12} md={6} lg={6}>
            <DarkCard>
              <CardContent sx={{ p: 3, pb: '24px !important' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.1rem' }}>
                    Recent Transactions
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: COLORS.secondaryBg, borderRadius: 20, p: 0.5, pl: 1.5 }}>
                    <Typography variant="caption" color={COLORS.textSecondary} sx={{ mr: 1, fontFamily: "'Inter', sans-serif" }}>
                      Sort by
                    </Typography>
                    <IconButton size="small" sx={{ color: COLORS.textSecondary }}>
                      <SortIcon sx={{ fontSize: '1rem' }} />
                    </IconButton>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {recentTransactions.map((transaction) => (
                    <Box 
                      key={transaction.id}
                      sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 2,
                        borderRadius: 3,
                        bgcolor: COLORS.secondaryBg,
                        transition: 'transform 0.2s ease',
                        '&:hover': {
                          transform: 'translateX(4px)'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          sx={{ 
                            width: 40, 
                            height: 40, 
                            mr: 2, 
                            bgcolor: 'rgba(107, 99, 251, 0.1)',
                            border: `1px solid ${COLORS.border}`
                          }}
                        >
                          {getTransactionIcon(transaction.category)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={600} sx={{ fontFamily: "'Inter', sans-serif" }}>{transaction.category}</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="caption" color={COLORS.textSecondary} sx={{ fontFamily: "'Inter', sans-serif" }}>{transaction.date}</Typography>
                            <Box sx={{ 
                              width: 3, 
                              height: 3, 
                              borderRadius: '50%', 
                              bgcolor: COLORS.textSecondary, 
                              mx: 0.5 
                            }} />
                            <Typography variant="caption" color={COLORS.textSecondary} sx={{ fontFamily: "'Inter', sans-serif" }}>{transaction.time}</Typography>
                          </Box>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" fontWeight={600} sx={{ mr: 1, fontFamily: "'Inter', sans-serif" }}>
                          ₹{transaction.amount}
                        </Typography>
                        <IconButton size="small" sx={{ bgcolor: 'rgba(107, 99, 251, 0.05)', '&:hover': { bgcolor: 'rgba(107, 99, 251, 0.1)' } }}>
                          <MoreVertIcon sx={{ color: COLORS.textSecondary, fontSize: '1.1rem' }} />
                        </IconButton>
                      </Box>
                    </Box>
                  ))}
                </Box>
                
                {/* View All link */}
                <Box sx={{ 
                  mt: 3, 
                  display: 'flex', 
                  justifyContent: 'center'
                }}>
                  <Button 
                    variant="text" 
                    size="small"
                    endIcon={<ArrowForwardIcon sx={{ fontSize: '1rem' }} />}
                    sx={{ 
                      color: COLORS.primary,
                      fontSize: '0.9rem',
                      textTransform: 'none',
                      fontWeight: 600,
                      fontFamily: "'Inter', sans-serif",
                      padding: '8px 16px',
                      bgcolor: 'rgba(107, 99, 251, 0.05)',
                      borderRadius: 3,
                      '&:hover': {
                        bgcolor: 'rgba(107, 99, 251, 0.1)'
                      }
                    }}
                  >
                    View All Transactions
                  </Button>
                </Box>
              </CardContent>
            </DarkCard>
          </Grid>

          {/* Modified Payroll Management - only initiate button and history */}
          <Grid item xs={12} md={6} lg={6}>
            <DarkCard>
              <CardContent sx={{ p: 3, pb: '24px !important' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.1rem' }}>
                    Payroll Management
                  </Typography>
                </Box>
                
                {/* Dedicated Button for Initiating New Payroll */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  mb: 3 
                }}>
                  <PurpleButton 
                    startIcon={<AddCircleOutlineIcon />}
                    sx={{ 
                      py: 1.5, 
                      px: 4, 
                      fontSize: '1rem',
                      width: '100%',
                      fontFamily: "'Inter', sans-serif",
                      borderRadius: 3,
                      boxShadow: '0 8px 20px rgba(107, 99, 251, 0.3)',
                    }}
                  >
                    Initiate New Payroll
                  </PurpleButton>
                </Box>
                
                {/* Previous Payroll History */}
                <Typography variant="subtitle2" sx={{ mb: 2, fontFamily: "'Poppins', sans-serif", color: COLORS.textSecondary }}>
                  Previous Payrolls
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {payrollHistory.map((payroll) => (
                    <Box 
                      key={payroll.id}
                      sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 2,
                        borderRadius: 3,
                        bgcolor: COLORS.secondaryBg,
                        transition: 'transform 0.2s ease',
                        '&:hover': {
                          transform: 'translateX(4px)'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          sx={{ 
                            width: 40, 
                            height: 40, 
                            mr: 2, 
                            bgcolor: 'rgba(107, 99, 251, 0.1)',
                            border: `1px solid ${COLORS.border}`
                          }}
                        >
                          <ReceiptLongIcon sx={{ color: COLORS.primary, fontSize: '1.2rem' }} />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={600} sx={{ fontFamily: "'Inter', sans-serif" }}>Monthly Payroll</Typography>
                          <Typography variant="caption" color={COLORS.textSecondary} sx={{ fontFamily: "'Inter', sans-serif" }}>{payroll.date} • {payroll.recipients} recipients</Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" fontWeight={600} sx={{ mr: 1, fontFamily: "'Inter', sans-serif" }}>
                          ₹{payroll.amount.toLocaleString()}
                        </Typography>
                        <IconButton size="small" sx={{ bgcolor: 'rgba(107, 99, 251, 0.05)', '&:hover': { bgcolor: 'rgba(107, 99, 251, 0.1)' } }}>
                          <ArrowForwardIcon sx={{ color: COLORS.primary, fontSize: '1.1rem' }} />
                        </IconButton>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </DarkCard>
          </Grid>

          {/* Contacts */}
          <Grid item xs={12} md={6} lg={6}>
            <DarkCard>
              <CardContent sx={{ p: 3, pb: '24px !important' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.1rem' }}>
                    Contacts
                  </Typography>
                  <IconButton size="small" sx={{ 
                    bgcolor: COLORS.primary, 
                    color: COLORS.textPrimary, 
                    '&:hover': { bgcolor: COLORS.primaryHover }, 
                    p: 1,
                    boxShadow: '0 4px 10px rgba(107, 99, 251, 0.3)',
                  }}>
                    <AddCircleOutlineIcon sx={{ fontSize: '1.1rem' }} />
                  </IconButton>
                </Box>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
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