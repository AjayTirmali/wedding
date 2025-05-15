import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  Tabs,
  Tab,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  PhotoCamera
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { getServices, createService, updateService, deleteService } from '../redux/actions/serviceActions';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../redux/actions/categoryActions';

// Tab Panel Component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState(0);
  const [users, setUsers] = useState([]);
  const { services } = useSelector(state => state.services);
  const { categories } = useSelector(state => state.categories);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [currentItem, setCurrentItem] = useState(null);
  const auth = useSelector(state => state.auth);

  // New service form state
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    location: '',
    pricingType: 'Fixed',
    features: [],
    images: []
  });

  // New category form state
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: ''
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = (type, item = null) => {
    setDialogType(type);
    setCurrentItem(item);
    
    if (type === 'editService' && item) {
      setNewService({
        name: item.name,
        description: item.description,
        category: item.category,
        price: item.price,
        location: item.location,
        pricingType: item.pricingType,
        features: item.features || [],
        images: item.images || []
      });
    } else if (type === 'editCategory' && item) {
      setNewCategory({
        name: item.name,
        description: item.description
      });
    } else if (type === 'newService') {
      setNewService({
        name: '',
        description: '',
        category: '',
        price: '',
        location: '',
        pricingType: 'Fixed',
        features: [],
        images: []
      });
    } else if (type === 'newCategory') {
      setNewCategory({
        name: '',
        description: ''
      });
    }
    
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentItem(null);
  };

  const handleServiceChange = (e) => {
    const { name, value } = e.target;
    setNewService({
      ...newService,
      [name]: value
    });
  };

  const handleCategoryChange = (e) => {
    const { name, value } = e.target;
    setNewCategory({
      ...newCategory,
      [name]: value
    });
  };
  const handleAddService = async () => {
    try {
      if (dialogType === 'newService') {
        // Add new service using Redux action
        await dispatch(createService(newService));
      } else if (dialogType === 'editService') {
        // Update existing service using Redux action
        await dispatch(updateService(currentItem._id, newService));
      }
      
      // Refresh services list
      dispatch(getServices());
      handleCloseDialog();
    } catch (error) {
      console.error('Error:', error);
      // You might want to show an error message to the user
    }
  };

  const handleAddCategory = async () => {
    try {
      if (dialogType === 'newCategory') {
        await dispatch(createCategory(newCategory));
      } else if (dialogType === 'editCategory') {
        await dispatch(updateCategory(currentItem._id, newCategory));
      }
      dispatch(getCategories());
      handleCloseDialog();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeleteService = async (id) => {
    try {
      await dispatch(deleteService(id));
      // Refresh services list
      dispatch(getServices());
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await dispatch(deleteCategory(id));
      dispatch(getCategories());
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    const formData = new FormData();
    
    files.forEach(file => {
      formData.append('images', file);
    });

    try {
      const response = await fetch('/api/services/upload', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      if (data.urls) {
        setNewService({
          ...newService,
          images: [...newService.images, ...data.urls]
        });
      }
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  };

  useEffect(() => {
    // Fetch real data from the server
    dispatch(getServices());
    dispatch(getCategories());
  }, [dispatch]);

  // Dashboard overview content
  const renderDashboardContent = () => (
    <>
      <Grid container spacing={4}>
        {/* Statistics Cards */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {users.length}
              </Typography>
              <Typography color="text.secondary">
                Registered Users
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {services.length}
              </Typography>
              <Typography color="text.secondary">
                Services Offered
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {categories.length}
              </Typography>
              <Typography color="text.secondary">
                Categories Available
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );

  // Services management content
  const renderServicesContent = () => (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Services Management</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog('newService')}
        >
          Add New Service
        </Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Pricing Type</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell>{service.name}</TableCell>
                <TableCell>{service.category}</TableCell>
                <TableCell>{service.location}</TableCell>
                <TableCell>${service.price}</TableCell>
                <TableCell>{service.pricingType}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpenDialog('editService', service)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteService(service.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );

  // Categories management content
  const renderCategoriesContent = () => (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Categories Management</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog('newCategory')}
        >
          Add New Category
        </Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpenDialog('editCategory', category)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteCategory(category.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );

  // Users management content
  const renderUsersContent = () => (
    <>
      <Typography variant="h5" sx={{ mb: 3 }}>Users Management</Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell align="right">
                  <Button size="small" variant="outlined">
                    Make Admin
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" align="center" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography variant="h6" align="center" color="text.secondary" paragraph>
        Welcome, {auth.user ? auth.user.name : 'Admin'}! Manage your wedding planning business here.
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="admin dashboard tabs">
          <Tab label="Dashboard" />
          <Tab label="Services" />
          <Tab label="Categories" />
          <Tab label="Users" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        {renderDashboardContent()}
      </TabPanel>
      
      <TabPanel value={tabValue} index={1}>
        {renderServicesContent()}
      </TabPanel>
      
      <TabPanel value={tabValue} index={2}>
        {renderCategoriesContent()}
      </TabPanel>
      
      <TabPanel value={tabValue} index={3}>
        {renderUsersContent()}
      </TabPanel>      {/* Service Dialog */}
      <Dialog open={openDialog && (dialogType === 'newService' || dialogType === 'editService')} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{dialogType === 'newService' ? 'Add New Service' : 'Edit Service'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Fill in the details for this service.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Service Name"
            fullWidth
            value={newService.name}
            onChange={handleServiceChange}
            required
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={newService.description}
            onChange={handleServiceChange}
            required
          />
          <TextField
            margin="dense"
            name="location"
            label="Location"
            fullWidth
            value={newService.location}
            onChange={handleServiceChange}
            required
            helperText="Enter the service location or availability area"
          />
          <FormControl fullWidth margin="dense" required>
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={newService.category}
              onChange={handleServiceChange}
              label="Category"
            >
              <MenuItem value="Decoration">Decoration</MenuItem>
              <MenuItem value="Catering">Catering</MenuItem>
              <MenuItem value="Photography">Photography</MenuItem>
              <MenuItem value="Entertainment">Entertainment</MenuItem>
              <MenuItem value="Venue">Venue</MenuItem>
              <MenuItem value="Transportation">Transportation</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ mt: 2, mb: 1 }}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="image-upload"
              type="file"
              multiple
              onChange={handleImageUpload}
            />
            <label htmlFor="image-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<PhotoCamera />}
                sx={{ mr: 2 }}
              >
                Upload Images
              </Button>
            </label>
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {newService.images.map((image, index) => (
                <Box
                  key={index}
                  component="img"
                  src={image}
                  sx={{
                    width: 100,
                    height: 100,
                    objectFit: 'cover',
                    borderRadius: 1
                  }}
                />
              ))}
            </Box>
          </Box>
          <TextField
            margin="dense"
            name="price"
            label="Price"
            type="number"
            fullWidth
            value={newService.price}
            onChange={handleServiceChange}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>
            }}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Pricing Type</InputLabel>
            <Select
              name="pricingType"
              value={newService.pricingType}
              onChange={handleServiceChange}
            >
              <MenuItem value="Fixed">Fixed</MenuItem>
              <MenuItem value="Per Hour">Per Hour</MenuItem>
              <MenuItem value="Per Person">Per Person</MenuItem>
              <MenuItem value="Custom">Custom</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleAddService} variant="contained">
            {dialogType === 'newService' ? 'Add Service' : 'Update Service'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Category Dialog */}
      <Dialog open={openDialog && (dialogType === 'newCategory' || dialogType === 'editCategory')} onClose={handleCloseDialog}>
        <DialogTitle>{dialogType === 'newCategory' ? 'Add New Category' : 'Edit Category'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Fill in the details for this category.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Category Name"
            fullWidth
            value={newCategory.name}
            onChange={handleCategoryChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={newCategory.description}
            onChange={handleCategoryChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleAddCategory} variant="contained">
            {dialogType === 'newCategory' ? 'Add Category' : 'Update Category'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard;