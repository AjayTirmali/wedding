const initialState = {
  services: [],
  service: null,
  loading: true,
  error: null,
  lastUpdate: null
};

const serviceReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'GET_SERVICES':
      return {
        ...state,
        services: payload,
        loading: false,
        error: null,
        lastUpdate: Date.now()
      };
    case 'GET_SERVICE':
      return {
        ...state,
        service: payload,
        loading: false,
        error: null
      };
    case 'CREATE_SERVICE':
      return {
        ...state,
        services: [payload, ...state.services],
        loading: false,
        error: null,
        lastUpdate: Date.now()
      };
    case 'UPDATE_SERVICE':
      return {
        ...state,
        services: state.services.map(service => 
          service._id === payload._id ? payload : service
        ),
        service: state.service?._id === payload._id ? payload : state.service,
        loading: false,
        error: null,
        lastUpdate: Date.now()
      };
    case 'DELETE_SERVICE':
      return {
        ...state,
        services: state.services.filter(service => service._id !== payload),
        service: state.service?._id === payload ? null : state.service,
        loading: false,
        error: null,
        lastUpdate: Date.now()
      };
    case 'SERVICE_ERROR':
      return {
        ...state,
        error: payload,
        loading: false
      };
    case 'CLEAR_SERVICE':
      return {
        ...state,
        service: null,
        error: null
      };
    default:
      return state;
  }
};

export default serviceReducer;