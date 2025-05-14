import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Divider,
  Alert,
  CircularProgress,
  useTheme,
  alpha,
  styled
} from '@mui/material';

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8]
  }
}));

const Payment = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  
  // Get selectedServices and totalAmount from location state
  const { selectedServices = [], totalAmount = 0 } = location.state || {};

  // Handle direct page access
  useEffect(() => {
    if (!location.state || !selectedServices.length) {
      navigate('/services', { 
        state: { 
          error: 'Please select services before proceeding to payment.' 
        }
      });
    }
  }, [location.state, selectedServices, navigate]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setIsScriptLoaded(true);
    script.onerror = () => {
      setError('Failed to load payment gateway. Please refresh the page.');
      setIsScriptLoaded(false);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleError = (err) => {
    console.error('Payment Error:', err);
    setError(err.message || 'Something went wrong. Please try again.');
    setLoading(false);
  };

  const handlePayment = async () => {
    if (!isScriptLoaded) {
      setError('Payment gateway is not loaded yet. Please wait or refresh the page.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      // Create order on the server
      const orderResponse = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          amount: totalAmount,
          services: selectedServices
        }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.message || 'Could not create order');
      }

      const orderData = await orderResponse.json();
      if (!orderData.success) {
        throw new Error(orderData.message || 'Could not create order');
      }

      // Initialize Razorpay options
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: 'INR',
        name: 'Wedding Planner',
        description: 'Wedding Services Booking',
        order_id: orderData.order.id,
        prefill: {
          name: orderData.user?.name || '',
          email: orderData.user?.email || '',
          contact: orderData.user?.phoneNumber || ''
        },
        theme: {
          color: theme.palette.primary.main
        },
        retry: {
          enabled: false
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          }
        },
        handler: async function (response) {
          try {
            const verifyResponse = await fetch('/api/payment/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                services: selectedServices,
                amount: totalAmount
              }),
            });

            if (!verifyResponse.ok) {
              throw new Error('Payment verification failed');
            }

            const verifyData = await verifyResponse.json();
            if (verifyData.success) {
              navigate('/dashboard', { 
                state: { 
                  paymentSuccess: true,
                  message: 'Payment successful! Your booking has been confirmed.'
                }
              });
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (err) {
            handleError(err);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response) {
        handleError(new Error(response.error.description || 'Payment failed'));
      });
      razorpay.open();
      
    } catch (err) {
      handleError(err);
    }
  };

  if (!selectedServices.length) {
    return (
      <Container>
        <Alert severity="warning" sx={{ mt: 4 }}>
          No services selected. Please select services before proceeding to payment.
        </Alert>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: 8,
        background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.light, 0.1)} 100%)`
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          align="center"
          sx={{
            fontFamily: 'Playfair Display',
            fontWeight: 500,
            mb: 4
          }}
        >
          Secure Payment
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={8}>
            <StyledPaper>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Box sx={{ mb: 3 }}>
                {selectedServices.map((service) => (
                  <Card key={service._id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="subtitle1">
                        {service.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ₹{service.price.toLocaleString('en-IN')}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                  Total Amount:
                </Typography>
                <Typography variant="h5" color="primary">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </Typography>
              </Box>

              {error && (
                <Alert 
                  severity="error" 
                  sx={{ mb: 3 }}
                  onClose={() => setError(null)}
                >
                  {error}
                </Alert>
              )}

              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handlePayment}
                disabled={loading || !isScriptLoaded}
                sx={{
                  py: 1.5,
                  fontSize: '1.1rem',
                  transition: 'transform 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                {loading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CircularProgress size={20} color="inherit" />
                    Processing...
                  </Box>
                ) : (
                  'Proceed to Pay'
                )}
              </Button>

              {!isScriptLoaded && (
                <Typography 
                  color="text.secondary" 
                  align="center" 
                  sx={{ mt: 2 }}
                >
                  Loading payment gateway...
                </Typography>
              )}
            </StyledPaper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Payment;
