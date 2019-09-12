import { SEARCH_INPUT } from '../../constants/action-types'

const initialState = {
  searchString: ""
};

function rootReducer(state = initialState, action) {
    
    if(action.type === SEARCH_INPUT) {
        return Object.assign({}, state, {
            searchString: action.payload
        });
    }

  return state;
};

export default rootReducer;