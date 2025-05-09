import React, { useState } from 'react';
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
  IconButton,
  InputAdornment,
  styled,
  useTheme,
  alpha,
  Fade,
  Slide
} from '@mui/material';
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { login } from '../redux/actions/authActions';

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

const Login = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formFocus, setFormFocus] = useState({});
  
  const { email, password } = formData;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, isAuthenticated } = useSelector(state => state.auth);

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFocus = (field) => {
    setFormFocus(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setFormFocus(prev => ({ ...prev, [field]: false }));
  };

  const onSubmit = async e => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  // Redirect if logged in
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
                Welcome Back
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Sign in to continue planning your perfect wedding
              </Typography>
            </Box>

            {error && (
              <Slide direction="down" in={!!error}>
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              </Slide>
            )}

            <Box component="form" onSubmit={onSubmit} sx={{ mt: 3 }}>
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
                  sx={{ mb: 2 }}
                />
              </Fade>

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

              <Fade in timeout={1600}>
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
                  Sign In
                </Button>
              </Fade>

              <Fade in timeout={1800}>
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Link 
                      to="/register" 
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
                        Don't have an account? Sign Up
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

export default Login;