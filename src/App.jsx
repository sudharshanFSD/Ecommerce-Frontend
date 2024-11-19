import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AdminPackages from './pages/AdminPackages';
import Login from './components/Login';
import Register from './components/Register';
import CartPage from './pages/CartPage';
import Collections from './pages/Collections';
import auth from './utility/auth';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutResult from './pages/CheckoutResult';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('role') === 'admin');
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await auth.getUserDetails();
        setUserDetails(response);
      } catch (error) {
        console.error('Failed to fetch user details', error);
      }
    };

    if (isLoggedIn) {
      fetchUserDetails();
    }
  }, [isLoggedIn]);

  const handleLogin = (token, role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    setIsLoggedIn(true);
    setIsAdmin(role === 'admin');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUserDetails(null);
  };

  return (
    <Router>
      <Box sx={{ flexGrow: 1 }}>
        <Navbar isAdmin={isAdmin} isLoggedIn={isLoggedIn} onLogout={handleLogout} userDetails={userDetails} />
        <Container maxWidth="xl" sx={{ paddingX: { xs: 2, sm: 8 } }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/products/:productId" element={<ProductDetailPage />} />

            {/* Protected Routes */}
            <Route 
              path="/CartPage" 
              element={isLoggedIn ? <CartPage /> : <Navigate to="/login" replace />} 
            />
            <Route 
              path="/CheckoutResult" 
              element={isLoggedIn ? <CheckoutResult /> : <Navigate to="/login" replace />} 
            />

            {/* Admin Route */}
            <Route 
              path="/admin/packages" 
              element={isLoggedIn && isAdmin ? <AdminPackages /> : <Navigate to="/" replace />} 
            />

            {/* Catch-All Redirect to Login */}
            {/* <Route path="*" element={<Navigate to="/login" replace />} /> */}
          </Routes>
        </Container>
      </Box>
    </Router>
  );
};

export default App;
