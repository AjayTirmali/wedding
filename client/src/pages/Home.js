import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  CardActionArea,
  useTheme,
  alpha,
  Fade,
  Grow,
  CircularProgress,
  styled
} from '@mui/material';
import { Celebration, EmojiEvents, Restaurant, PhotoCamera } from '@mui/icons-material';

// Styled components for enhanced visuals
const HeroSection = styled(Box)(({ theme }) => ({
  height: '90vh',
  position: 'relative',
  overflow: 'hidden',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6))',
    zIndex: 1
  }
}));

const HeroContent = styled(Container)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  position: 'relative',
  zIndex: 2,
  color: 'white',
  textAlign: 'center'
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8]
  }
}));

const Home = () => {
  const theme = useTheme();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const images = Array.from({length: 35}, (_, i) => `/images/image_${i + 1}.jpeg`);

  // Preload images
  useEffect(() => {
    const preloadImages = async () => {
      const imagePromises = images.map(src => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = reject;
        });
      });
      
      try {
        await Promise.all(imagePromises);
        setIsLoading(false);
      } catch (error) {
        console.error('Error preloading images:', error);
        setIsLoading(false);
      }
    };

    preloadImages();
  }, []);

  useEffect(() => {
    if (isLoading) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Keep 5 second interval between transitions

    return () => clearInterval(interval);
  }, [isLoading, images.length]);

  // Add new styled component for smooth image transitions
  const StyledHeroSection = styled(HeroSection)({
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `url(${images[currentImageIndex]})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      transition: 'opacity 1s ease-in-out',
      opacity: isLoading ? 0 : 1,
    }
  });

  return (
    <>
      {/* Hero Section */}
      <StyledHeroSection>
        <HeroContent>
          <Fade in={true} timeout={1000}>
            <Box>
              <Typography 
                variant="h1" 
                component="h1" 
                className="hero-text"
                sx={{ 
                  fontSize: { xs: '2.5rem', md: '4rem' }, 
                  mb: 2,
                  fontFamily: 'Playfair Display',
                  fontWeight: 500
                }}
              >
                Create Your Dream Wedding
              </Typography>
              <Typography 
                variant="h5" 
                gutterBottom 
                sx={{ 
                  mb: 4, 
                  fontFamily: 'Cormorant Garamond',
                  fontSize: { xs: '1.2rem', md: '1.8rem' }
                }}
              >
                Let us make your special day unforgettable
              </Typography>
              <Button 
                variant="contained" 
                size="large" 
                component={Link} 
                to="/contact"
                sx={{ 
                  py: 2, 
                  px: 4, 
                  fontSize: '1.1rem',
                  background: 'rgba(255,255,255,0.9)',
                  color: 'black',
                  '&:hover': {
                    background: 'rgba(255,255,255,1)',
                  }
                }}
              >
                Start Planning
              </Button>
            </Box>
          </Fade>
        </HeroContent>
      </StyledHeroSection>

      {/* Services Section */}
      <Box sx={{ py: 12, backgroundColor: 'white' }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h2" 
            component="h2" 
            align="center" 
            gutterBottom
            sx={{ 
              mb: 6,
              fontFamily: 'Playfair Display',
              fontSize: { xs: '2rem', md: '3rem' }
            }}
          >
            Our Services
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={3}>
              <Grow in timeout={1000}>
                <StyledCard>
                  <CardActionArea 
                    component={Link} 
                    to="/services?category=Planning" 
                    sx={{ height: '100%' }}
                  >
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Celebration sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }} />
                      <Typography 
                        gutterBottom 
                        variant="h5" 
                        component="h3"
                        sx={{ fontFamily: 'Playfair Display' }}
                      >
                        Full Planning
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Comprehensive planning from start to finish
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </StyledCard>
              </Grow>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Grow in timeout={1500}>
                <StyledCard>
                  <CardActionArea 
                    component={Link} 
                    to="/services?category=Catering" 
                    sx={{ height: '100%' }}
                  >
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Restaurant sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }} />
                      <Typography 
                        gutterBottom 
                        variant="h5" 
                        component="h3"
                        sx={{ fontFamily: 'Playfair Display' }}
                      >
                        Catering
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Exquisite dining experiences
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </StyledCard>
              </Grow>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Grow in timeout={2000}>
                <StyledCard>
                  <CardActionArea 
                    component={Link} 
                    to="/services?category=Photography" 
                    sx={{ height: '100%' }}
                  >
                    <CardContent sx={{ textAlign: 'center' }}>
                      <PhotoCamera sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }} />
                      <Typography 
                        gutterBottom 
                        variant="h5" 
                        component="h3"
                        sx={{ fontFamily: 'Playfair Display' }}
                      >
                        Photography
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Capturing timeless moments
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </StyledCard>
              </Grow>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Grow in timeout={2500}>
                <StyledCard>
                  <CardActionArea 
                    component={Link} 
                    to="/services?category=Decoration" 
                    sx={{ height: '100%' }}
                  >
                    <CardContent sx={{ textAlign: 'center' }}>
                      <EmojiEvents sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }} />
                      <Typography 
                        gutterBottom 
                        variant="h5" 
                        component="h3"
                        sx={{ fontFamily: 'Playfair Display' }}
                      >
                        Decoration
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Creating magical atmospheres
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </StyledCard>
              </Grow>
            </Grid>
          </Grid>

          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button 
              variant="outlined" 
              size="large" 
              component={Link} 
              to="/services"
              sx={{ 
                py: 2, 
                px: 4, 
                fontSize: '1.1rem',
                borderWidth: '2px'
              }}
            >
              View All Services
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: 12, backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h2" 
            component="h2" 
            align="center" 
            gutterBottom
            sx={{ 
              mb: 6,
              fontFamily: 'Playfair Display',
              fontSize: { xs: '2rem', md: '3rem' }
            }}
          >
            What Our Couples Say
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Fade in timeout={1000}>
                <StyledCard sx={{ p: 4 }}>
                  <Typography variant="body1" paragraph sx={{ fontStyle: 'italic', mb: 3 }}>
                    "Our wedding was absolutely perfect thanks to the Wedding Planner team. They took care of everything and made our day stress-free and magical."
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ fontFamily: 'Cormorant Garamond' }}>
                    — Sarah & John
                  </Typography>
                </StyledCard>
              </Fade>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Fade in timeout={1500}>
                <StyledCard sx={{ p: 4 }}>
                  <Typography variant="body1" paragraph sx={{ fontStyle: 'italic', mb: 3 }}>
                    "The attention to detail was amazing. They captured our vision perfectly and delivered beyond our expectations."
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ fontFamily: 'Cormorant Garamond' }}>
                    — Emily & Michael
                  </Typography>
                </StyledCard>
              </Fade>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Fade in timeout={2000}>
                <StyledCard sx={{ p: 4 }}>
                  <Typography variant="body1" paragraph sx={{ fontStyle: 'italic', mb: 3 }}>
                    "Professional, responsive, and creative. They made planning our destination wedding a breeze despite the distance."
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ fontFamily: 'Cormorant Garamond' }}>
                    — Jessica & David
                  </Typography>
                </StyledCard>
              </Fade>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box 
        sx={{ 
          py: 12, 
          position: 'relative', 
          overflow: 'hidden',
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url(${images[2]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <Container sx={{ position: 'relative', zIndex: 1, color: 'white', textAlign: 'center' }}>
          <Typography 
            variant="h3" 
            gutterBottom
            sx={{ 
              fontFamily: 'Playfair Display',
              fontSize: { xs: '2rem', md: '3rem' }
            }}
          >
            Ready to Start Planning Your Dream Wedding?
          </Typography>
          <Typography 
            variant="h6" 
            paragraph 
            sx={{ 
              mb: 4,
              fontFamily: 'Cormorant Garamond',
              fontSize: { xs: '1.2rem', md: '1.5rem' }
            }}
          >
            Contact us today and let's make your wedding day perfect
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            component={Link} 
            to="/contact"
            sx={{ 
              py: 2, 
              px: 4, 
              fontSize: '1.1rem',
              background: 'rgba(255,255,255,0.9)',
              color: 'black',
              '&:hover': {
                background: 'rgba(255,255,255,1)',
              }
            }}
          >
            Contact Us
          </Button>
        </Container>
      </Box>
    </>
  );
};

export default Home;