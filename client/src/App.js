import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loadUser } from './redux/actions/authActions';
import { Box } from '@mui/material';
import { setAuthToken } from './redux/actions/authActions';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Services from './pages/Services';
import ServiceDetails from './pages/ServiceDetails';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Gallery from './pages/Gallery';
import Payment from './pages/Payment';  // Add this import

// Route Protection
import PrivateRoute from './utils/PrivateRoute';
import AdminRoute from './utils/AdminRoute';

// Check for token
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: '100vh'
    }}>
      <Navbar />
      <Box sx={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:id" element={<ServiceDetails />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/payment" element={
            <PrivateRoute>
              <Payment />
            </PrivateRoute>
          } />
          
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          
          {/* Admin route */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          
          {/* Future routes */}
          {/* <Route path="/portfolio" element={<Portfolio />} /> */}
        </Routes>
      </Box>
      <Footer />
    </Box>
  );
};

export default App;