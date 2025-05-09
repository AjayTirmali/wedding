import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// This component checks if the user is both authenticated and has admin role
const AdminRoute = ({ children }) => {
  const auth = useSelector(state => state.auth);
  
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Check if user is admin
  if (auth.user && auth.user.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

export default AdminRoute; 