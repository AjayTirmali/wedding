import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  Chip,
  Divider,
  Paper,
  Rating,
  styled
} from '@mui/material';
import {
  ArrowBack,
  LocationOn,
  Star,
  Chat as ChatIcon
} from '@mui/icons-material';
import ImageGallery from '../components/common/ImageGallery';

const FeatureChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { services } = useSelector(state => state.services);
  const [service, setService] = useState(null);
  useEffect(() => {
    const serviceDetails = services.find(s => s._id === id);
    if (serviceDetails) {
      // Ensure images array is valid
      const processedService = {
        ...serviceDetails,
        images: serviceDetails.images?.length ? serviceDetails.images : [`/images/image_${Math.floor(Math.random() * 35) + 1}.jpeg`]
      };
      setService(processedService);
    }
  }, [id, services]);

  const handleAddToCart = () => {
    navigate('/services', {
      state: {
        addToCart: service,
      }
    });
  };

  if (!service) {
    return (
      <Container>
        <Box py={4} textAlign="center">
          <Typography variant="h5">Service not found</Typography>
          <Button component={Link} to="/services" startIcon={<ArrowBack />} sx={{ mt: 2 }}>
            Back to Services
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        component={Link}
        to="/services"
        startIcon={<ArrowBack />}
        sx={{ mb: 3 }}
      >
        Back to Services
      </Button>

      <Grid container spacing={4}>        {/* Left Column - Images */}
        <Grid item xs={12} md={7}>
          <ImageGallery 
            images={service.images} 
            altText={service.name}
          />
        </Grid>

        {/* Right Column - Details */}
        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ p: 3 }}>
            {service.featured && (
              <Chip
                label="Featured"
                color="primary"
                sx={{ mb: 2, bgcolor: '#FFD700', color: '#000' }}
              />
            )}
            
            <Typography variant="h4" component="h1" gutterBottom>
              {service.name}
            </Typography>

            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <LocationOn color="action" />
              <Typography color="text.secondary">
                {service.location}
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={1} mb={3}>
              <Rating
                value={service.rating}
                readOnly
                precision={0.1}
                emptyIcon={<Star style={{ opacity: 0.55 }} fontSize="inherit" />}
              />
              <Typography color="text.secondary">
                ({service.reviewCount} reviews)
              </Typography>
            </Box>

            <Typography variant="h5" color="primary" gutterBottom>
              ₹{service.price.toLocaleString('en-IN')} Onwards
            </Typography>

            <Button
              variant="contained"
              fullWidth
              size="large"
              startIcon={<ChatIcon />}
              sx={{ mt: 2 }}
            >
              Chat with Provider
            </Button>

            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleAddToCart}
              sx={{ mt: 2 }}
            >
              Add to Cart
            </Button>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Features
            </Typography>
            <Box mb={3}>
              {service.features?.map((feature, index) => (
                <FeatureChip
                  key={index}
                  label={feature}
                  variant="outlined"
                />
              ))}
            </Box>

            <Typography variant="h6" gutterBottom>
              About {service.name}
            </Typography>
            <Typography color="text.secondary" paragraph>
              {service.description || 'No description available.'}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ServiceDetails;
