import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import authReducer from './reducers/authReducer';
import serviceReducer from './reducers/serviceReducer';
import bookingReducer from './reducers/bookingReducer';

// Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  services: serviceReducer,
  bookings: bookingReducer
});

// Create store with middleware
const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

export default store; 