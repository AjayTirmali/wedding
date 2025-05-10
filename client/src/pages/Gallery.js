import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import './Gallery.css';

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
    <div className="gallery">
      <Container maxWidth="lg">
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

        <div className="gallery-grid">
          {categories[category].map((image, index) => (
            <div className="gallery-item" key={index} onClick={() => handleImageClick(image)}>
              <img src={image} alt={`Wedding Image ${index + 1}`} />
            </div>
          ))}
        </div>
      </Container>

      {selectedImage && (
        <div className={`gallery-modal ${selectedImage ? 'active' : ''}`} onClick={handleClose}>
          <div className="gallery-modal-content">
            <img src={selectedImage} alt="Wedding" />
            <div className="gallery-modal-close" onClick={handleClose}>×</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;