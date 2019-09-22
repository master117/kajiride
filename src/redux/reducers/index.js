import { SEARCH_INPUT, LOGGED_IN, LOGGED_OUT } from '../../constants/action-types'

const initialState = {
  searchString: "",
  user: undefined
};

function rootReducer(state = initialState, action) {
    if(action.type === SEARCH_INPUT) {
        return Object.assign({}, state, {
            searchString: action.payload
        });
    }

    if(action.type === LOGGED_IN) {
      return Object.assign({}, state, {
          user: action.payload
      });
    }

    if(action.type === LOGGED_OUT) {
      return Object.assign({}, state, {
          user: undefined
      });
    }

  return state;
};

export default rootReducer;