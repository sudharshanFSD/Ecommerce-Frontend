import React, { useEffect, useState } from 'react';
import { Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const CheckoutResult = () => {
  const [statusMessage, setStatusMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(null);  // Set to null initially to prevent premature rendering
  const [open, setOpen] = useState(true); // Control the dialog open state
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get('status');
    const sessionId = queryParams.get('session_id');

    if (sessionId) {
      checkPaymentStatus(sessionId);
    } else {
      handleStatus(status);
    }

    const timeout = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => clearTimeout(timeout);
  }, [location, navigate]);

  const checkPaymentStatus = async (sessionId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://ecommerce-1-33ey.onrender.com/apiStripe/status',
        { sessionId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.data.status === 'succeeded') {
        setStatusMessage('Payment Successful! Your order has been placed.');
        setIsSuccess(true);
      } else {
        setStatusMessage('Payment Failed. Please try again.');
        setIsSuccess(false);
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      setStatusMessage('An error occurred while processing your payment.');
      setIsSuccess(false);
    }
  };

  const handleStatus = (status) => {
    if (status === 'success') {
      setStatusMessage('Payment Successful! Your order has been placed.');
      setIsSuccess(true);
    } else if (status === 'cancel') {
      setStatusMessage('Payment Failed or Cancelled. Please try again.');
      setIsSuccess(false);
    } else {
      setStatusMessage('An error occurred. Please try again.');
      setIsSuccess(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    navigate('/');
  };

  if (isSuccess === null) {
    // Prevent rendering of dialog until status is determined
    return null;
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Typography variant="h5" color={isSuccess ? 'green' : 'red'}>
          {isSuccess ? 'Success' : 'Failure'}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box textAlign="center" sx={{ padding: 2 }}>
          <Typography variant="body1" sx={{ color: isSuccess ? 'green' : 'red', fontWeight: 500 }}>
            {statusMessage}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color={isSuccess ? 'success' : 'error'}
          onClick={handleClose}
          fullWidth
        >
          Go to Home
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CheckoutResult;
