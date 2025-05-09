import axios from 'axios';

// Set auth token
export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
  }
};

// Load User
export const loadUser = () => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const response = await axios.get('/api/auth/user');

    dispatch({
      type: 'USER_LOADED',
      payload: response.data
    });
  } catch (err) {
    dispatch({
      type: 'AUTH_ERROR',
      payload: err.response.data.msg
    });
  }
};

// Register User
export const register = ({ name, email, password, phoneNumber, role }) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const body = JSON.stringify({ name, email, password, phoneNumber, role });

  try {
    const result = await axios.post('/api/auth/register', body, config);

    dispatch({
      type: 'REGISTER_SUCCESS',
      payload: result.data
    });

    dispatch(loadUser());
  } catch (err) {
    dispatch({
      type: 'REGISTER_FAIL',
      payload: err.response.data.msg
    });
  }
};

// Login User
export const login = (email, password) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const body = JSON.stringify({ email, password });

  try {
    const resp = await axios.post('/api/auth/login', body, config);

    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: resp.data
    });

    dispatch(loadUser());
  } catch (err) {
    dispatch({
      type: 'LOGIN_FAIL',
      payload: err.response.data.msg
    });
  }
};

// Logout
export const logout = () => dispatch => {
  dispatch({ type: 'LOGOUT' });
};

// Clear error
export const clearError = () => dispatch => {
  dispatch({ type: 'CLEAR_ERROR' });
}; 