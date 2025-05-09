import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
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
  Card
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

const StyledCard = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  overflow: 'hidden',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[6]
  }
}));

const CategoryChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  left: theme.spacing(1),
  zIndex: 1,
  fontWeight: 500
}));

const Services = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { services, loading } = useSelector(state => state.services);
  const [category, setCategory] = useState('All');
  const [categoryImages, setCategoryImages] = useState({});
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [messageLoading, setMessageLoading] = useState(false);
  const [typingStatus, setTypingStatus] = useState(null);
  const socketRef = useRef();
  const typingTimeoutRef = useRef();

  const fetchServices = useCallback(async () => {
    try {
      const response = await axios.get('/api/services', {
        params: {
          category: category === 'All' ? undefined : category
        }
      });
      
      dispatch({ type: 'GET_SERVICES', payload: response.data });
    } catch (err) {
      console.error('Error fetching services:', err);
    }
  }, [dispatch, category]);

  const assignCategoryImages = () => {
    const images = Array.from({length: 35}, (_, i) => `/images/image_${i + 1}.jpeg`);
    const categories = {
      'Decoration': images.slice(0, 5),
      'Catering': images.slice(5, 10),
      'Photography': images.slice(10, 15),
      'Entertainment': images.slice(15, 20),
      'Venue': images.slice(20, 25),
      'Transportation': images.slice(25, 30),
      'Other': images.slice(30, 35)
    };
    setCategoryImages(categories);
  };

  useEffect(() => {
    fetchServices();
    assignCategoryImages();
  }, [fetchServices]);

  const handleProviderSelect = (provider, serviceId) => {
    setSelectedProvider({ ...provider, serviceId });
    setChatOpen(true);
    setMessages([{
      id: Date.now(),
      text: `Hello! I'm the AI assistant for ${provider.name}. How can I help you today?`,
      sender: 'ai'
    }]);
  };

  const categories = [
    'All',
    'Decoration',
    'Catering',
    'Photography',
    'Entertainment',
    'Venue',
    'Transportation',
    'Other'
  ];

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      bgcolor: alpha(theme.palette.primary.main, 0.03),
      minHeight: '100vh',
      py: 8 
    }}>
      <Container maxWidth="lg">
        <Fade in timeout={1000}>
          <Box>
            <Typography 
              variant="h2" 
              component="h1" 
              align="center" 
              gutterBottom
              sx={{
                fontFamily: 'Playfair Display',
                fontWeight: 500,
                mb: 2
              }}
            >
              Our Services
            </Typography>
            <Typography 
              variant="h5" 
              align="center" 
              color="text.secondary" 
              paragraph
              sx={{
                fontFamily: 'Cormorant Garamond',
                mb: 6
              }}
            >
              Discover our curated collection of premium wedding services
            </Typography>
          </Box>
        </Fade>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          mb: 6 
        }}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 0.5, 
              display: 'flex', 
              gap: 1, 
              flexWrap: 'wrap',
              justifyContent: 'center' 
            }}
          >
            {categories.map((cat) => (
              <Chip
                key={cat}
                label={cat}
                onClick={() => setCategory(cat)}
                color={category === cat ? 'primary' : 'default'}
                sx={{ 
                  m: 0.5,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 2
                  }
                }}
              />
            ))}
          </Paper>
        </Box>

        <Grid container spacing={4}>
          {services && services.length > 0 ? (
            services.map((service, index) => (
              <Grid item key={service._id || service.id} xs={12} sm={6} md={4}>
                <Grow in timeout={(index + 1) * 200}>
                  <StyledCard>
                    <CategoryChip 
                      label={service.category} 
                      color="primary"
                    />
                    <CardMedia
                      component="img"
                      height="200"
                      image={service.images && service.images.length > 0 
                        ? service.images[0] 
                        : getServiceImage(service.category)}
                      alt={service.name}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent>
                      <Typography 
                        variant="h5" 
                        component="h2"
                        gutterBottom
                        sx={{ 
                          fontFamily: 'Playfair Display',
                          fontWeight: 500
                        }}
                      >
                        {service.name}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        paragraph
                      >
                        {service.description}
                      </Typography>
                      
                      {service.features && service.features.length > 0 && (
                        <List dense sx={{ mb: 2 }}>
                          {service.features.slice(0, 3).map((feature, idx) => (
                            <ListItem key={idx} disableGutters>
                              <ListItemIcon sx={{ minWidth: 32 }}>
                                <CheckCircle color="primary" fontSize="small" />
                              </ListItemIcon>
                              <ListItemText 
                                primary={feature}
                                primaryTypographyProps={{
                                  variant: 'body2'
                                }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      )}

                      <Box sx={{ 
                        mt: 'auto',
                        pt: 2,
                        borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                      }}>
                        <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                          ${service.price}
                          {service.pricingType !== 'Fixed' && (
                            <Typography 
                              component="span" 
                              variant="body2"
                              sx={{ ml: 0.5 }}
                            >
                              /{service.pricingType.toLowerCase().replace('per ', '')}
                            </Typography>
                          )}
                        </Typography>
                        
                        {service.serviceProviders && service.serviceProviders.map((provider, idx) => (
                          <Card 
                            key={idx}
                            variant="outlined" 
                            sx={{ mb: 2 }}
                          >
                            <CardContent sx={{ pb: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <PersonIcon sx={{ mr: 1 }} />
                                <Typography variant="subtitle1">{provider.name}</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Star sx={{ mr: 1, color: 'warning.main' }} />
                                <Typography variant="body2">
                                  {provider.rating.average.toFixed(1)} ({provider.rating.count} reviews)
                                </Typography>
                              </Box>
                              <Button
                                variant="outlined"
                                startIcon={<ChatIcon />}
                                fullWidth
                                onClick={() => handleProviderSelect(provider, service._id)}
                                sx={{ mt: 1 }}
                              >
                                Chat with Provider
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </Box>
                    </CardContent>
                  </StyledCard>
                </Grow>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  No services found in this category
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={() => setCategory('All')}
                  sx={{ mt: 2 }}
                >
                  View All Services
                </Button>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default Services;