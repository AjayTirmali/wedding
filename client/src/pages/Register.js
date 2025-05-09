import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Grid, 
  Paper,
  Alert,
  FormControlLabel,
  Checkbox,
  styled,
  useTheme,
  alpha,
  IconButton,
  InputAdornment,
  Fade,
  Slide
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  Lock,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { register } from '../redux/actions/authActions';

// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  padding: theme.spacing(4),
  marginTop: theme.spacing(8),
  marginBottom: theme.spacing(4),
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

const Register = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    phoneNumber: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminOption, setShowAdminOption] = useState(false);
  const [formFocus, setFormFocus] = useState({});
  
  const { name, email, password, password2, phoneNumber } = formData;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, isAuthenticated } = useSelector(state => state.auth);
  const [localError, setLocalError] = useState('');

  // Secret key press combination to show admin option (Ctrl+Shift+A)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        setShowAdminOption(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    
    if (password !== password2) {
      setLocalError('Passwords do not match');
    } else {
      setLocalError('');
      dispatch(register({ 
        name, 
        email, 
        password, 
        phoneNumber,
        role: isAdmin ? 'admin' : 'client'
      }));
    }
  };

  const handleFocus = (field) => {
    setFormFocus(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setFormFocus(prev => ({ ...prev, [field]: false }));
  };

  // Redirect if registered
  if (isAuthenticated) {
    navigate('/dashboard');
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.light, 0.1)} 100%)`,
        py: 4
      }}
    >
      <Container component="main" maxWidth="xs">
        <Fade in timeout={1000}>
          <StyledPaper elevation={6}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography
                component="h1"
                variant="h4"
                sx={{
                  fontFamily: 'Playfair Display',
                  fontWeight: 500,
                  mb: 1
                }}
              >
                Create Account
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Join us to start planning your dream wedding
              </Typography>
            </Box>
            
            {(error || localError) && (
              <Slide direction="down" in={!!(error || localError)}>
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error || localError}
                </Alert>
              </Slide>
            )}
            
            <Box component="form" onSubmit={onSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Fade in timeout={1000}>
                    <StyledTextField
                      name="name"
                      required
                      fullWidth
                      label="Full Name"
                      autoFocus
                      value={name}
                      onChange={onChange}
                      onFocus={() => handleFocus('name')}
                      onBlur={() => handleBlur('name')}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person color={formFocus.name ? 'primary' : 'action'} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Fade>
                </Grid>
                <Grid item xs={12}>
                  <Fade in timeout={1200}>
                    <StyledTextField
                      required
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      value={email}
                      onChange={onChange}
                      onFocus={() => handleFocus('email')}
                      onBlur={() => handleBlur('email')}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email color={formFocus.email ? 'primary' : 'action'} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Fade>
                </Grid>
                <Grid item xs={12}>
                  <Fade in timeout={1400}>
                    <StyledTextField
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={onChange}
                      onFocus={() => handleFocus('password')}
                      onBlur={() => handleBlur('password')}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock color={formFocus.password ? 'primary' : 'action'} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Fade>
                </Grid>
                <Grid item xs={12}>
                  <Fade in timeout={1600}>
                    <StyledTextField
                      required
                      fullWidth
                      name="password2"
                      label="Confirm Password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={password2}
                      onChange={onChange}
                      onFocus={() => handleFocus('password2')}
                      onBlur={() => handleBlur('password2')}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock color={formFocus.password2 ? 'primary' : 'action'} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              edge="end"
                            >
                              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Fade>
                </Grid>
                <Grid item xs={12}>
                  <Fade in timeout={1800}>
                    <StyledTextField
                      fullWidth
                      name="phoneNumber"
                      label="Phone Number"
                      value={phoneNumber}
                      onChange={onChange}
                      onFocus={() => handleFocus('phone')}
                      onBlur={() => handleBlur('phone')}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone color={formFocus.phone ? 'primary' : 'action'} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Fade>
                </Grid>
                
                {showAdminOption && (
                  <Grid item xs={12}>
                    <Fade in timeout={2000}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={isAdmin}
                            onChange={(e) => setIsAdmin(e.target.checked)}
                            color="primary"
                          />
                        }
                        label="Register as Admin"
                      />
                    </Fade>
                  </Grid>
                )}
              </Grid>
              
              <Fade in timeout={2200}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    mb: 2,
                    py: 1.5,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: theme.shadows[8]
                    }
                  }}
                >
                  Sign Up
                </Button>
              </Fade>
              
              <Fade in timeout={2400}>
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Link 
                      to="/login" 
                      style={{ 
                        textDecoration: 'none',
                        color: theme.palette.primary.main,
                        transition: 'color 0.3s ease'
                      }}
                    >
                      <Typography 
                        variant="body2"
                        sx={{
                          '&:hover': {
                            color: theme.palette.primary.dark
                          }
                        }}
                      >
                        Already have an account? Sign in
                      </Typography>
                    </Link>
                  </Grid>
                </Grid>
              </Fade>
            </Box>
          </StyledPaper>
        </Fade>
      </Container>
    </Box>
  );
};

export default Register;