import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardActions,
  Divider,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import { BookOnline, Person, History } from '@mui/icons-material';
import { getBookings } from '../redux/actions/bookingActions';

// TabPanel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
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

const Dashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { bookings, loading, error } = useSelector(state => state.bookings);

  useEffect(() => {
    dispatch(getBookings());
  }, [dispatch]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Cancelled':
        return 'error';
      case 'Completed':
        return 'info';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="h6" color="text.secondary" paragraph>
        Welcome back, {user?.name || 'User'}!
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="dashboard tabs">
          <Tab icon={<BookOnline />} iconPosition="start" label="My Bookings" />
          <Tab icon={<Person />} iconPosition="start" label="Profile" />
          <Tab icon={<History />} iconPosition="start" label="History" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Typography variant="h5" gutterBottom>
          My Bookings
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {bookings && bookings.length > 0 ? (
          <Grid container spacing={3}>
            {bookings.map((booking) => (
              <Grid item xs={12} key={booking._id || booking.id || Math.random()}>
                <Card>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="h6" gutterBottom>
                          {booking.eventType} - {formatDate(booking.eventDate)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Guests: {booking.guestCount}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Venue: {booking.venue?.name || 'Not specified'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Budget: ${booking.budget || 'Not specified'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: { sm: 'flex-end' } }}>
                        <Chip 
                          label={booking.status} 
                          color={getStatusColor(booking.status)} 
                          sx={{ mb: 2 }} 
                        />
                        <Typography variant="body2" color="text.secondary">
                          Booked on: {formatDate(booking.createdAt)}
                        </Typography>
                      </Grid>
                    </Grid>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="subtitle1" gutterBottom>
                      Services:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {booking.services && booking.services.length > 0 ? (
                        booking.services.map((service, index) => (
                          <Chip key={index} label={service.name || 'Service'} size="small" />
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No services specified
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary">
                      View Details
                    </Button>
                    {booking.status === 'Pending' && (
                      <Button size="small" color="error">
                        Cancel
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" paragraph>
              You don't have any bookings yet.
            </Typography>
            <Button variant="contained" color="primary" href="/services">
              Browse Services
            </Button>
          </Paper>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Typography variant="h5" gutterBottom>
          Profile Information
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Full Name</Typography>
              <Typography variant="body1" gutterBottom>{user?.name || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Email</Typography>
              <Typography variant="body1" gutterBottom>{user?.email || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Phone Number</Typography>
              <Typography variant="body1" gutterBottom>{user?.phoneNumber || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Account Type</Typography>
              <Typography variant="body1" gutterBottom>
                <Chip 
                  label={user?.role || 'Client'} 
                  color={user?.role === 'admin' ? 'error' : 'primary'} 
                  size="small" 
                />
              </Typography>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            <Button variant="contained" color="primary">
              Edit Profile
            </Button>
          </Box>
        </Paper>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Typography variant="h5" gutterBottom>
          Booking History
        </Typography>
        {bookings && bookings.filter(b => b.status === 'Completed' || b.status === 'Cancelled').length > 0 ? (
          <Grid container spacing={3}>
            {bookings
              .filter(b => b.status === 'Completed' || b.status === 'Cancelled')
              .map((booking) => (
                <Grid item xs={12} key={booking._id || booking.id || Math.random()}>
                  <Card>
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="h6" gutterBottom>
                            {booking.eventType} - {formatDate(booking.eventDate)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Venue: {booking.venue?.name || 'Not specified'}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: { sm: 'flex-end' } }}>
                          <Chip 
                            label={booking.status} 
                            color={getStatusColor(booking.status)} 
                            sx={{ mb: 2 }} 
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                    <CardActions>
                      <Button size="small" color="primary">
                        View Details
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
          </Grid>
        ) : (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1">
              No booking history available.
            </Typography>
          </Paper>
        )}
      </TabPanel>
    </Container>
  );
};

export default Dashboard; 