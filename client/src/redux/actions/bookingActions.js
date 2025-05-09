import axios from 'axios';

// Get all bookings
export const getBookings = () => async dispatch => {
  try {
    const res = await axios.get('/api/bookings');

    dispatch({
      type: 'GET_BOOKINGS',
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: 'BOOKING_ERROR',
      payload: err.response.data.msg
    });
  }
};

// Get booking by ID
export const getBookingById = (id) => async dispatch => {
  try {
    const res = await axios.get(`/api/bookings/${id}`);

    dispatch({
      type: 'GET_BOOKING',
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: 'BOOKING_ERROR',
      payload: err.response.data.msg
    });
  }
};

// Create new booking
export const createBooking = (formData) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    const res = await axios.post('/api/bookings', formData, config);

    dispatch({
      type: 'CREATE_BOOKING',
      payload: res.data
    });

    return res.data;
  } catch (err) {
    dispatch({
      type: 'BOOKING_ERROR',
      payload: err.response.data.msg
    });
    
    throw err;
  }
};

// Update booking
export const updateBooking = (id, formData) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    const res = await axios.put(`/api/bookings/${id}`, formData, config);

    dispatch({
      type: 'UPDATE_BOOKING',
      payload: res.data
    });

    return res.data;
  } catch (err) {
    dispatch({
      type: 'BOOKING_ERROR',
      payload: err.response.data.msg
    });
    
    throw err;
  }
};

// Delete booking
export const deleteBooking = (id) => async dispatch => {
  try {
    await axios.delete(`/api/bookings/${id}`);

    dispatch({
      type: 'DELETE_BOOKING',
      payload: id
    });
  } catch (err) {
    dispatch({
      type: 'BOOKING_ERROR',
      payload: err.response.data.msg
    });
  }
};

// Clear current booking
export const clearBooking = () => dispatch => {
  dispatch({ type: 'CLEAR_BOOKING' });
}; 