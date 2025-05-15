import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardMedia,
  Grid,
  Modal,
  IconButton,
  CircularProgress,
  Typography
} from '@mui/material';
import {
  Close as CloseIcon,
  NavigateNext,
  NavigateBefore,
  BrokenImage as BrokenImageIcon
} from '@mui/icons-material';

const ImageGallery = ({ images = [], altText = '' }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageLoadError, setImageLoadError] = useState(false);

  useEffect(() => {
    // Preload the initial image
    const img = new Image();
    img.src = getCompleteImageUrl(images[selectedImage]);
    img.onload = () => setLoading(false);
    img.onerror = () => {
      setLoading(false);
      setImageLoadError(true);
    };
  }, [selectedImage, images]);

  const handleNextImage = (e) => {
    e.stopPropagation();
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const getCompleteImageUrl = (imageUrl) => {
    if (!imageUrl) return '/images/placeholder.jpg';
    if (imageUrl.startsWith('http')) return imageUrl;
    // If it's a relative path starting with /images or /uploads
    if (imageUrl.startsWith('/')) {
      return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${imageUrl}`;
    }
    // If it's just a filename, assume it's in the images folder
    return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/images/${imageUrl}`;
  };

  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Card>
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: 400,
              overflow: 'hidden',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={() => !loading && !imageLoadError && setModalOpen(true)}
          >
            {loading && (
              <CircularProgress />
            )}
            
            {imageLoadError ? (
              <Box sx={{ textAlign: 'center' }}>
                <BrokenImageIcon sx={{ fontSize: 60, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  Failed to load image
                </Typography>
              </Box>
            ) : (
              <CardMedia
                component="img"
                image={getCompleteImageUrl(images[selectedImage])}
                alt={`${altText} - Main Image`}
                onLoad={() => setLoading(false)}
                onError={() => {
                  setLoading(false);
                  setImageLoadError(true);
                }}
                sx={{
                  height: '100%',
                  width: '100%',
                  objectFit: 'contain',
                  opacity: loading ? 0 : 1,
                  transition: 'opacity 0.3s'
                }}
              />
            )}
          </Box>
        </Card>
      </Box>

      {/* Thumbnails */}
      {images.length > 1 && (
        <Grid container spacing={1}>
          {images.map((image, index) => (
            <Grid item xs={3} sm={2} key={index}>
              <Card
                sx={{
                  border: selectedImage === index ? '2px solid #1976d2' : 'none',
                  cursor: 'pointer',
                  '&:hover': { opacity: 0.8 }
                }}
                onClick={() => setSelectedImage(index)}
              >
                <CardMedia
                  component="img"
                  height="80"
                  image={getCompleteImageUrl(image)}
                  alt={`${altText} - Thumbnail ${index + 1}`}
                  sx={{ objectFit: 'cover' }}
                />
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Fullscreen Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.9)'
          }
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '90vw',
            height: '90vh',
            outline: 'none'
          }}
        >
          <IconButton
            onClick={() => setModalOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white',
              bgcolor: 'rgba(0,0,0,0.5)',
              '&:hover': {
                bgcolor: 'rgba(0,0,0,0.7)'
              }
            }}
          >
            <CloseIcon />
          </IconButton>

          {images.length > 1 && (
            <>
              <IconButton
                onClick={handlePrevImage}
                sx={{
                  position: 'absolute',
                  left: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'white',
                  bgcolor: 'rgba(0,0,0,0.5)',
                  '&:hover': {
                    bgcolor: 'rgba(0,0,0,0.7)'
                  }
                }}
              >
                <NavigateBefore />
              </IconButton>

              <IconButton
                onClick={handleNextImage}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'white',
                  bgcolor: 'rgba(0,0,0,0.5)',
                  '&:hover': {
                    bgcolor: 'rgba(0,0,0,0.7)'
                  }
                }}
              >
                <NavigateNext />
              </IconButton>
            </>
          )}

          <CardMedia
            component="img"
            image={getCompleteImageUrl(images[selectedImage])}
            alt={`${altText} - Fullscreen`}
            sx={{
              height: '100%',
              width: '100%',
              objectFit: 'contain'
            }}
          />
        </Box>
      </Modal>
    </>
  );
};

export default ImageGallery;
