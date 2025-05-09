import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { logout } from '../../redux/actions/authActions';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const publicLinks = [
    { title: 'Home', path: '/' },
    { title: 'Services', path: '/services' },
    { title: 'Gallery', path: '/gallery' },
    { title: 'Contact', path: '/contact' }
  ];

  const guestLinks = (
    <>
      {publicLinks.map(link => (
        <Button key={link.title} color="inherit" component={Link} to={link.path}>
          {link.title}
        </Button>
      ))}
      <Button color="inherit" component={Link} to="/login">Login</Button>
      <Button color="inherit" component={Link} to="/register">Register</Button>
    </>
  );

  const authLinks = (
    <>
      {publicLinks.map(link => (
        <Button key={link.title} color="inherit" component={Link} to={link.path}>
          {link.title}
        </Button>
      ))}
      <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
      {user && user.role === 'admin' && (
        <Button color="inherit" component={Link} to="/admin">Admin</Button>
      )}
      <Button color="inherit" onClick={onLogout}>Logout</Button>
    </>
  );

  return (
    <AppBar position="static">
      <Container>
        <Toolbar>
          <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'white' }}>
            Wedding Planner
          </Typography>
          <Box>
            {isAuthenticated ? authLinks : guestLinks}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;