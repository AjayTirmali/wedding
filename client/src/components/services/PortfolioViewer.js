import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  useTheme,
  alpha,
  CircularProgress
} from '@mui/material';
import {
  Close as CloseIcon,
  ChevronLeft,
  ChevronRight,
  BrokenImage as BrokenImageIcon
} from '@mui/icons-material';

const PortfolioViewer = ({ open, onClose, portfolio, providerName }) => {
  const theme = useTheme();
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Preload images
  useEffect(() => {
    if (selectedImageIndex !== null) {
      const nextIndex = (selectedImageIndex + 1) % portfolio.length;
      const prevIndex = selectedImageIndex > 0 ? selectedImageIndex - 1 : portfolio.length - 1;
      
      // Preload next and previous images
      [nextIndex, prevIndex].forEach(index => {
        const img = new Image();
        img.src = portfolio[index].imageUrl;
      });
    }
  }, [selectedImageIndex, portfolio]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!open || selectedImageIndex === null) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        case 'Escape':
          onClose();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [open, selectedImageIndex]);

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    setImageError(false);
    setIsLoading(true);
  };

  const handleNext = () => {
    setSelectedImageIndex((prev) => 
      prev < portfolio.length - 1 ? prev + 1 : 0
    );
  };

  const handlePrevious = () => {
    setSelectedImageIndex((prev) => 
      prev > 0 ? prev - 1 : portfolio.length - 1
    );
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">{providerName}'s Portfolio</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        {selectedImageIndex !== null ? (
          <Box sx={{ position: 'relative' }}>
            <IconButton
              onClick={handlePrevious}
              sx={{
                position: 'absolute',
                left: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: alpha(theme.palette.common.white, 0.8),
                '&:hover': { bgcolor: alpha(theme.palette.common.white, 0.9) },
                zIndex: 1
              }}
            >
              <ChevronLeft />
            </IconButton>
            <Box sx={{ position: 'relative', width: '100%', pt: '56.25%' }}>
              {isLoading && (
                <Box sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 1
                }}>
                  <CircularProgress />
                </Box>
              )}
              {imageError ? (
                <Box sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center'
                }}>
                  <BrokenImageIcon sx={{ fontSize: 60, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    Failed to load image
                  </Typography>
                </Box>
              ) : (
                <CardMedia
                  component="img"
                  image={portfolio[selectedImageIndex].imageUrl}
                  alt={portfolio[selectedImageIndex].title}
                  onLoad={() => setIsLoading(false)}
                  onError={() => {
                    setIsLoading(false);
                    setImageError(true);
                  }}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    opacity: isLoading ? 0 : 1,
                    transition: 'opacity 0.3s'
                  }}
                />
              )}
            </Box>
            <IconButton
              onClick={handleNext}
              sx={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: alpha(theme.palette.common.white, 0.8),
                '&:hover': { bgcolor: alpha(theme.palette.common.white, 0.9) },
                zIndex: 1
              }}
            >
              <ChevronRight />
            </IconButton>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="h6">{portfolio[selectedImageIndex].title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {portfolio[selectedImageIndex].description}
              </Typography>
            </Box>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {portfolio.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card 
                  onClick={() => handleImageClick(index)}
                  sx={{ 
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.02)'
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={item.imageUrl}
                    alt={item.title}
                  />
                  <CardContent>
                    <Typography variant="subtitle1" noWrap>{item.title}</Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {item.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PortfolioViewer;