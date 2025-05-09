import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Snackbar,
  Alert,
  useTheme,
  alpha,
  styled,
  Fade,
  Card,
  CardContent,
} from '@mui/material';
import { Email, Phone, LocationOn, Send } from '@mui/icons-material';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8]
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-2px)'
    },
    '&.Mui-focused': {
      transform: 'translateY(-2px)'
    }
  }
}));

const ContactIconBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  transition: 'all 0.3s ease',
  '&:hover': {
    background: alpha(theme.palette.primary.main, 0.05),
    transform: 'translateX(8px)'
  }
}));

const Contact = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [open, setOpen] = useState(false);

  const { name, email, phone, message } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log(formData);
    setOpen(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: ''
    });
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      py: 8, 
      background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.light, 0.1)} 100%)`
    }}>
      <Container maxWidth="lg">
        <Fade in timeout={1000}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontFamily: 'Playfair Display',
                fontWeight: 500,
                mb: 2
              }}
            >
              Get in Touch
            </Typography>
            <Typography 
              variant="h5" 
              color="text.secondary" 
              sx={{ 
                maxWidth: '800px', 
                mx: 'auto',
                fontFamily: 'Cormorant Garamond',
              }}
            >
              Have questions about our services or ready to start planning your dream wedding? We're here to help!
            </Typography>
          </Box>
        </Fade>

        <Grid container spacing={6}>
          <Grid item xs={12} md={5}>
            <Fade in timeout={1500}>
              <StyledCard elevation={3}>
                <CardContent sx={{ p: 4 }}>
                  <Typography 
                    variant="h4" 
                    gutterBottom 
                    sx={{ 
                      fontFamily: 'Playfair Display',
                      fontWeight: 500,
                      mb: 4
                    }}
                  >
                    Contact Information
                  </Typography>

                  <ContactIconBox>
                    <Email color="primary" sx={{ fontSize: 28, mr: 2 }} />
                    <Box>
                      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                        Email Us At
                      </Typography>
                      <Typography variant="h6">
                        info@weddingplanner.com
                      </Typography>
                    </Box>
                  </ContactIconBox>

                  <ContactIconBox>
                    <Phone color="primary" sx={{ fontSize: 28, mr: 2 }} />
                    <Box>
                      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                        Call Us At
                      </Typography>
                      <Typography variant="h6">
                        (123) 456-7890
                      </Typography>
                    </Box>
                  </ContactIconBox>

                  <ContactIconBox>
                    <LocationOn color="primary" sx={{ fontSize: 28, mr: 2 }} />
                    <Box>
                      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                        Visit Our Office
                      </Typography>
                      <Typography variant="h6">
                        123 Wedding Lane
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Celebration City, WC 12345
                      </Typography>
                    </Box>
                  </ContactIconBox>
                </CardContent>
              </StyledCard>
            </Fade>
          </Grid>

          <Grid item xs={12} md={7}>
            <Fade in timeout={2000}>
              <StyledCard elevation={3}>
                <CardContent sx={{ p: 4 }}>
                  <Typography 
                    variant="h4" 
                    gutterBottom
                    sx={{ 
                      fontFamily: 'Playfair Display',
                      fontWeight: 500,
                      mb: 4
                    }}
                  >
                    Send Us a Message
                  </Typography>

                  <Box component="form" onSubmit={onSubmit}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <StyledTextField
                          required
                          fullWidth
                          label="Your Name"
                          name="name"
                          value={name}
                          onChange={onChange}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <StyledTextField
                          required
                          fullWidth
                          label="Email Address"
                          name="email"
                          type="email"
                          value={email}
                          onChange={onChange}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <StyledTextField
                          fullWidth
                          label="Phone Number"
                          name="phone"
                          value={phone}
                          onChange={onChange}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <StyledTextField
                          required
                          fullWidth
                          multiline
                          rows={4}
                          label="Your Message"
                          name="message"
                          value={message}
                          onChange={onChange}
                        />
                      </Grid>
                    </Grid>

                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="large"
                      endIcon={<Send />}
                      sx={{
                        mt: 4,
                        py: 1.5,
                        background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'scale(1.02)',
                          boxShadow: theme.shadows[8]
                        }
                      }}
                    >
                      Send Message
                    </Button>
                  </Box>
                </CardContent>
              </StyledCard>
            </Fade>
          </Grid>
        </Grid>

        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert 
            onClose={handleClose} 
            severity="success" 
            variant="filled"
            sx={{ width: '100%' }}
          >
            Your message has been sent successfully!
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default Contact;
