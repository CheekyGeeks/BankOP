import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import SignUpPage from './pages/SignUpPage';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#8A2BE2', // Purple
      light: '#A29BFE',
    },
    secondary: {
      main: '#7B68EE', // Medium slate blue
    },
    background: {
      default: '#0F172A', // Dark navy
      paper: '#1E293B',  // Slightly lighter navy
    },
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 28,
          textTransform: 'none',
        },
        containedPrimary: {
          background: 'linear-gradient(90deg, #8A2BE2 0%, #7B68EE 100%)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="app" style={{ 
          background: '#0F172A',
          backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(138, 43, 226, 0.2) 0%, transparent 20%)',
          minHeight: '100vh',
        }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="*" element={<Navigate to="/signup" replace />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;