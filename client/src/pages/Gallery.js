import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  CardActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogContent,
} from '@mui/material';
import { ZoomIn } from '@mui/icons-material';

const Gallery = () => {
  const [category, setCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);
  
  const categories = {
    'All': Array.from({length: 35}, (_, i) => `/images/image_${i + 1}.jpeg`),
    'Decoration': Array.from({length: 5}, (_, i) => `/images/image_${i + 1}.jpeg`),
    'Catering': Array.from({length: 5}, (_, i) => `/images/image_${i + 6}.jpeg`),
    'Photography': Array.from({length: 5}, (_, i) => `/images/image_${i + 11}.jpeg`),
    'Entertainment': Array.from({length: 5}, (_, i) => `/images/image_${i + 16}.jpeg`),
    'Venue': Array.from({length: 5}, (_, i) => `/images/image_${i + 21}.jpeg`),
    'Transportation': Array.from({length: 5}, (_, i) => `/images/image_${i + 26}.jpeg`),
    'Other': Array.from({length: 5}, (_, i) => `/images/image_${i + 31}.jpeg`)
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleClose = () => {
    setSelectedImage(null);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" align="center" gutterBottom>
        Wedding Gallery
      </Typography>
      <Typography variant="h6" align="center" color="text.secondary" paragraph>
        Browse through our collection of beautiful wedding moments
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="category-select-label">Category</InputLabel>
          <Select
            labelId="category-select-label"
            id="category-select"
            value={category}
            label="Category"
            onChange={handleCategoryChange}
          >
            {Object.keys(categories).map((cat) => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {categories[category].map((image, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={image}
                alt={`Wedding Image ${index + 1}`}
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': {
                    opacity: 0.8
                  }
                }}
                onClick={() => handleImageClick(image)}
              />
              <CardActions>
                <Button 
                  size="small" 
                  startIcon={<ZoomIn />}
                  onClick={() => handleImageClick(image)}
                  fullWidth
                >
                  View
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={!!selectedImage}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent sx={{ p: 0 }}>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Wedding"
              style={{ width: '100%', height: 'auto' }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Gallery;