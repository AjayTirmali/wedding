import axios from 'axios';

// Get all services
export const getServices = () => async dispatch => {
  try {
    const res = await axios.get('/api/services', {
      params: { timestamp: new Date().getTime() }
    });

    dispatch({
      type: 'GET_SERVICES',
      payload: res.data
    });
    return res.data;
  } catch (err) {
    dispatch({
      type: 'SERVICE_ERROR',
      payload: err.response?.data?.msg || 'Error loading services'
    });
    throw err;
  }
};

// Get service by ID
export const getServiceById = (id) => async dispatch => {
  try {
    const res = await axios.get(`/api/services/${id}`);

    dispatch({
      type: 'GET_SERVICE',
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: 'SERVICE_ERROR',
      payload: err.response.data.msg
    });
  }
};

// Get services by category
export const getServicesByCategory = (category) => async dispatch => {
  try {
    const res = await axios.get(`/api/services`, {
      params: { 
        category,
        timestamp: new Date().getTime()
      }
    });

    dispatch({
      type: 'GET_SERVICES',
      payload: res.data
    });
    return res.data;
  } catch (err) {
    dispatch({
      type: 'SERVICE_ERROR',
      payload: err.response?.data?.msg || 'Error loading services'
    });
    throw err;
  }
};

// Create new service (Admin only)
export const createService = (formData) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    const res = await axios.post('/api/services', formData, config);

    dispatch({
      type: 'CREATE_SERVICE',
      payload: res.data
    });

    return res.data;
  } catch (err) {
    dispatch({
      type: 'SERVICE_ERROR',
      payload: err.response.data.msg
    });
    
    throw err;
  }
};

// Update service (Admin only)
export const updateService = (id, formData) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    const res = await axios.put(`/api/services/${id}`, formData, config);

    dispatch({
      type: 'UPDATE_SERVICE',
      payload: res.data
    });

    return res.data;
  } catch (err) {
    dispatch({
      type: 'SERVICE_ERROR',
      payload: err.response.data.msg
    });
    
    throw err;
  }
};

// Delete service (Admin only)
export const deleteService = (id) => async dispatch => {
  try {
    await axios.delete(`/api/services/${id}`);

    dispatch({
      type: 'DELETE_SERVICE',
      payload: id
    });
  } catch (err) {
    dispatch({
      type: 'SERVICE_ERROR',
      payload: err.response.data.msg
    });
  }
};

// Clear current service
export const clearService = () => dispatch => {
  dispatch({ type: 'CLEAR_SERVICE' });
};