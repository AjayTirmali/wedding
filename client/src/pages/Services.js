import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/Services.css';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Chip,
  CircularProgress,
  Fade,
  Grow,
  useTheme,
  alpha,
  styled,
  TextField,
  Button,
  IconButton,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CardMedia,
  Card,
  Alert
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle,
  LocalOffer,
  Person as PersonIcon,
  Work as WorkIcon,
  Star,
  Chat as ChatIcon,
  ArrowForward
} from '@mui/icons-material';
import axios from 'axios';
import io from 'socket.io-client';
import { getServices, getServicesByCategory } from '../redux/actions/serviceActions';

const socketUrl = process.env.NODE_ENV === 'production' 
  ? window.location.origin 
  : 'http://localhost:5000';

const getServiceImage = (category) => {
  const categoryImageMap = {
    'Decoration': '/images/image_1.jpeg',
    'Catering': '/images/image_6.jpeg',
    'Photography': '/images/image_11.jpeg',
    'Entertainment': '/images/image_16.jpeg',
    'Venue': '/images/image_21.jpeg',
    'Transportation': '/images/image_26.jpeg',
    'Other': '/images/image_31.jpeg'
  };
  return categoryImageMap[category] || '/images/image_1.jpeg';
};

const ChatWindow = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(3),
  right: theme.spacing(3),
  width: 350,
  maxHeight: 500,
  zIndex: 1000,
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[10]
}));

const ServiceCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  '& .MuiCardMedia-root': {
    height: 280,
    position: 'relative'
  },
  '& .featured-badge': {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#FFD700',
    color: '#000',
    padding: '4px 12px',
    borderRadius: '4px',
    fontWeight: 'bold',
    zIndex: 1
  }
}));

const RatingBadge = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  padding: '4px 8px',
  borderRadius: '4px',
  position: 'absolute',
  right: 16,
  bottom: 16
}));

const PriceTag = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.primary.main,
  fontSize: '1.25rem',
  marginTop: theme.spacing(1)
}));

const CartPreview = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  padding: theme.spacing(2),
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.1)',
  zIndex: 1000,
  transform: 'translateY(100%)',
  transition: 'transform 0.3s ease-in-out',
  '&.visible': {
    transform: 'translateY(0)',
  }
}));

const Services = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { services, loading } = useSelector(state => state.services);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [cartVisible, setCartVisible] = useState(false);
  const [error, setError] = useState(location.state?.error || null);
  
  // Get category from URL parameters
  const searchParams = new URLSearchParams(window.location.search);
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  // Sample data for testing
  const sampleData = [
    {
      _id: '1',
      name: 'Gulmohar inc. - Bespoke Weddings',
      description: 'Transform your venue into a magical setting with our luxury decoration services.',
      location: 'Baner, Pune',
      category: 'Decoration',
      price: 250000,
      rating: 4.9,
      reviewCount: 25,
      featured: true,
      images: ['/images/image_1.jpeg'],
      features: ['Inhouse & outside decoration', 'Unique Ideas', 'In High Demand']
    },
    {
      _id: '2',
      name: 'Genesis Photography',
      description: 'Professional photography services for your special day.',
      location: 'Bund Garden Road, Pune',
      category: 'Photography',
      price: 150000,
      rating: 4.8,
      reviewCount: 32,
      featured: false,
      images: ['/images/image_11.jpeg'],
      features: ['Pre-wedding shoot', 'Full day coverage', 'Quick delivery']
    },
    {
      _id: '3',
      name: 'Royal Feast Catering',
      description: 'Exquisite culinary experiences for your wedding.',
      location: 'Koregaon Park, Pune',
      category: 'Catering',
      price: 1200,
      rating: 4.7,
      reviewCount: 45,
      featured: true,
      images: ['/images/image_6.jpeg'],
      features: ['Multi-cuisine', 'Professional staff', 'Custom menus']
    },
    {
      _id: '4',
      name: 'Perfect Planning',
      description: 'Comprehensive wedding planning services.',
      location: 'Viman Nagar, Pune',
      category: 'Planning',
      price: 300000,
      rating: 5.0,
      reviewCount: 18,
      featured: true,
      images: ['/images/image_21.jpeg'],
      features: ['End-to-end planning', 'Vendor management', 'Budget planning']
    }
  ];

  useEffect(() => {
    // Set sample data while server is not available
    dispatch({
      type: 'GET_SERVICES',
      payload: sampleData
    });
  }, [dispatch]);

  useEffect(() => {
    return () => setError(null);
  }, [category]);

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    navigate(`/services?category=${newCategory}`);
  };

  const handleServiceClick = (service) => {
    navigate(`/services/${service._id}`);
  };

  const handleChatClick = (service) => {
    setSelectedProvider(service);
    setChatOpen(true);
  };

  const handleAddToCart = (service) => {
    if (!selectedServices.find(s => s._id === service._id)) {
      setSelectedServices([...selectedServices, service]);
      setCartVisible(true);
    }
  };

  const handleRemoveFromCart = (serviceId) => {
    setSelectedServices(selectedServices.filter(s => s._id !== serviceId));
    if (selectedServices.length <= 1) {
      setCartVisible(false);
    }
  };

  const calculateTotal = () => {
    return selectedServices.reduce((total, service) => total + service.price, 0);
  };

  const handleProceedToPayment = () => {
    navigate('/payment', {
      state: {
        selectedServices,
        totalAmount: calculateTotal()
      }
    });
  };

  const renderServices = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      );
    }

    const filteredServices = category === 'All' 
      ? services 
      : services.filter(service => service.category === category);

    return (
      <Grid container spacing={3}>
        {filteredServices.map((service) => (
          <Grid item xs={12} sm={6} md={4} key={service._id}>
            <ServiceCard>
              {service.featured && (
                <Box className="featured-badge">Featured</Box>
              )}
              <Box position="relative">
                <CardMedia
                  component="img"
                  image={service.images?.[0] || getServiceImage(service.category)}
                  alt={service.name}
                  sx={{ height: 280 }}
                />
                <RatingBadge>
                  <Star sx={{ fontSize: 16 }} />
                  <Typography variant="body2">
                    {service.rating.toFixed(1)} ({service.reviewCount})
                  </Typography>
                </RatingBadge>
              </Box>
              
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {service.name}
                </Typography>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <PersonIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {service.location}
                  </Typography>
                </Box>
                
                <PriceTag>
                  ₹{service.price.toLocaleString('en-IN')} {service.pricingType === 'Per Person' ? 'per person' : ''}
                </PriceTag>

                <Box mt={2}>
                  {service.features?.map((feature, index) => (
                    <Chip
                      key={index}
                      label={feature}
                      size="small"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
                </Box>
              </CardContent>

              <CardActions sx={{ mt: 'auto', justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleServiceClick(service)}
                >
                  View Details
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleAddToCart(service)}
                  disabled={selectedServices.find(s => s._id === service._id)}
                >
                  {selectedServices.find(s => s._id === service._id) ? 'Added' : 'Add to Cart'}
                </Button>
              </CardActions>
            </ServiceCard>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" mb={4}>
        Wedding Planners & Services
      </Typography>
      
      {error && (
        <Alert 
          severity="warning" 
          sx={{ mb: 3 }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}
      
      <Box mb={4}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item>
            <Button 
              variant={category === 'All' ? 'contained' : 'outlined'} 
              onClick={() => handleCategoryChange('All')}
              sx={{ mx: 1 }}
            >
              All
            </Button>
            <Button 
              variant={category === 'Planning' ? 'contained' : 'outlined'} 
              onClick={() => handleCategoryChange('Planning')}
              sx={{ mx: 1 }}
            >
              Planning
            </Button>
            <Button 
              variant={category === 'Catering' ? 'contained' : 'outlined'} 
              onClick={() => handleCategoryChange('Catering')}
              sx={{ mx: 1 }}
            >
              Catering
            </Button>
            <Button 
              variant={category === 'Photography' ? 'contained' : 'outlined'} 
              onClick={() => handleCategoryChange('Photography')}
              sx={{ mx: 1 }}
            >
              Photography
            </Button>
            <Button 
              variant={category === 'Decoration' ? 'contained' : 'outlined'} 
              onClick={() => handleCategoryChange('Decoration')}
              sx={{ mx: 1 }}
            >
              Decoration
            </Button>
          </Grid>
        </Grid>
      </Box>

      {renderServices()}

      {cartVisible && (
        <CartPreview className="visible">
          <Container maxWidth="lg">
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <Box display="flex" gap={2} alignItems="center">
                  {selectedServices.map((service) => (
                    <Chip
                      key={service._id}
                      label={`${service.name} - ₹${service.price.toLocaleString('en-IN')}`}
                      onDelete={() => handleRemoveFromCart(service._id)}
                      sx={{ bgcolor: 'white' }}
                    />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box display="flex" justifyContent="flex-end" alignItems="center" gap={2}>
                  <Typography variant="h6">
                    Total: ₹{calculateTotal().toLocaleString('en-IN')}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleProceedToPayment}
                    disabled={selectedServices.length === 0}
                  >
                    Proceed to Payment
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </CartPreview>
      )}

      {chatOpen && selectedProvider && (
        <ChatWindow>
          {/* Chat window content */}
        </ChatWindow>
      )}
    </Container>
  );
};

export default Services;