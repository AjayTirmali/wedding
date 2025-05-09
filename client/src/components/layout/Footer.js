import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Typography, Grid, IconButton } from '@mui/material';
import { Facebook, Instagram, Twitter, Pinterest } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box component="footer" sx={{ bgcolor: '#f5f5f5', py: 6, mt: 'auto' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Wedding Planner
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Making your special day perfect
            </Typography>
            <Box sx={{ mt: 2 }}>
              <IconButton aria-label="facebook" color="primary">
                <Facebook />
              </IconButton>
              <IconButton aria-label="instagram" color="primary">
                <Instagram />
              </IconButton>
              <IconButton aria-label="twitter" color="primary">
                <Twitter />
              </IconButton>
              <IconButton aria-label="pinterest" color="primary">
                <Pinterest />
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Quick Links
            </Typography>
            <Typography variant="body2" component={Link} to="/" sx={{ display: 'block', mb: 1, textDecoration: 'none', color: 'text.secondary' }}>
              Home
            </Typography>
            <Typography variant="body2" component={Link} to="/services" sx={{ display: 'block', mb: 1, textDecoration: 'none', color: 'text.secondary' }}>
              Services
            </Typography>
            <Typography variant="body2" component={Link} to="/portfolio" sx={{ display: 'block', mb: 1, textDecoration: 'none', color: 'text.secondary' }}>
              Portfolio
            </Typography>
            <Typography variant="body2" component={Link} to="/contact" sx={{ display: 'block', mb: 1, textDecoration: 'none', color: 'text.secondary' }}>
              Contact
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2" color="text.secondary">
              123 Wedding Lane
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Celebration City, WC 12345
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: info@weddingplanner.com
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Phone: (123) 456-7890
            </Typography>
          </Grid>
        </Grid>
        <Box mt={5}>
          <Typography variant="body2" color="text.secondary" align="center">
            {'Copyright © '}
            <Link color="inherit" to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              Wedding Planner
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 