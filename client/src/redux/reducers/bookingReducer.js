const initialState = {
  bookings: [],
  booking: null,
  loading: true,
  error: null
};

const bookingReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'GET_BOOKINGS':
      return {
        ...state,
        bookings: payload,
        loading: false
      };
    case 'GET_BOOKING':
      return {
        ...state,
        booking: payload,
        loading: false
      };
    case 'CREATE_BOOKING':
      return {
        ...state,
        bookings: [payload, ...state.bookings],
        loading: false
      };
    case 'UPDATE_BOOKING':
      return {
        ...state,
        bookings: state.bookings.map(booking => 
          booking._id === payload._id ? payload : booking
        ),
        loading: false
      };
    case 'DELETE_BOOKING':
      return {
        ...state,
        bookings: state.bookings.filter(booking => booking._id !== payload),
        loading: false
      };
    case 'BOOKING_ERROR':
      return {
        ...state,
        error: payload,
        loading: false
      };
    case 'CLEAR_BOOKING':
      return {
        ...state,
        booking: null
      };
    default:
      return state;
  }
};

export default bookingReducer; 