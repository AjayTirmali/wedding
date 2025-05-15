import axios from 'axios';

// Get all categories
export const getCategories = () => async dispatch => {
  try {
    const res = await axios.get('/api/services/categories/all');

    dispatch({
      type: 'GET_CATEGORIES',
      payload: res.data
    });
    return res.data;
  } catch (err) {
    dispatch({
      type: 'CATEGORY_ERROR',
      payload: err.response?.data?.msg || 'Error loading categories'
    });
    throw err;
  }
};

// Create new category
export const createCategory = (formData) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    const res = await axios.post('/api/services/categories', formData, config);

    dispatch({
      type: 'CREATE_CATEGORY',
      payload: res.data
    });
    return res.data;
  } catch (err) {
    dispatch({
      type: 'CATEGORY_ERROR',
      payload: err.response?.data?.msg
    });
    throw err;
  }
};

// Update category
export const updateCategory = (id, formData) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    const res = await axios.put(`/api/services/categories/${id}`, formData, config);

    dispatch({
      type: 'UPDATE_CATEGORY',
      payload: res.data
    });
    return res.data;
  } catch (err) {
    dispatch({
      type: 'CATEGORY_ERROR',
      payload: err.response?.data?.msg
    });
    throw err;
  }
};

// Delete category
export const deleteCategory = (id) => async dispatch => {
  try {
    await axios.delete(`/api/services/categories/${id}`);

    dispatch({
      type: 'DELETE_CATEGORY',
      payload: id
    });
  } catch (err) {
    dispatch({
      type: 'CATEGORY_ERROR',
      payload: err.response?.data?.msg
    });
    throw err;
  }
};
