import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  List,
  ListItem,
  ListItemText,
  Divider,
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
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';

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
  const [tabValue, setTabValue] = useState(0);
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
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
    pricingType: 'Fixed',
    features: []
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
        pricingType: item.pricingType,
        features: item.features || []
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
        pricingType: 'Fixed',
        features: []
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

  const handleAddService = () => {
    if (dialogType === 'newService') {
      // Add new service
      const newId = services.length > 0 ? Math.max(...services.map(s => s.id)) + 1 : 1;
      const serviceToAdd = {
        ...newService,
        id: newId
      };
      
      setServices([...services, serviceToAdd]);
    } else if (dialogType === 'editService') {
      // Update existing service
      const updatedServices = services.map(service => 
        service.id === currentItem.id ? { ...service, ...newService } : service
      );
      
      setServices(updatedServices);
    }
    
    handleCloseDialog();
  };

  const handleAddCategory = () => {
    if (dialogType === 'newCategory') {
      // Add new category
      const newId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
      const categoryToAdd = {
        ...newCategory,
        id: newId
      };
      
      setCategories([...categories, categoryToAdd]);
    } else if (dialogType === 'editCategory') {
      // Update existing category
      const updatedCategories = categories.map(category => 
        category.id === currentItem.id ? { ...category, ...newCategory } : category
      );
      
      setCategories(updatedCategories);
    }
    
    handleCloseDialog();
  };

  const handleDeleteService = (id) => {
    setServices(services.filter(service => service.id !== id));
  };

  const handleDeleteCategory = (id) => {
    setCategories(categories.filter(category => category.id !== id));
  };

  useEffect(() => {
    // Simulated data loading - in a real app, these would be API calls
    setUsers([
      { id: 1, name: 'User One', email: 'user1@example.com', role: 'client' },
      { id: 2, name: 'User Two', email: 'user2@example.com', role: 'client' }
    ]);
    
    setServices([
      { id: 1, name: 'Full Planning', description: 'Comprehensive wedding planning', category: 'Planning', price: 2500, pricingType: 'Fixed' },
      { id: 2, name: 'Day Coordination', description: 'Day-of coordination', category: 'Planning', price: 800, pricingType: 'Fixed' }
    ]);
    
    setCategories([
      { id: 1, name: 'Planning', description: 'Wedding planning services' },
      { id: 2, name: 'Photography', description: 'Wedding photography services' }
    ]);
  }, []);

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
      </TabPanel>

      {/* Service Dialog */}
      <Dialog open={openDialog && (dialogType === 'newService' || dialogType === 'editService')} onClose={handleCloseDialog}>
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
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={newService.category}
              onChange={handleServiceChange}
            >
              {categories.map(category => (
                <MenuItem key={category.id} value={category.name}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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