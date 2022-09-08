import * as actions from '../constants/actionTypes';

export default (state = {}, action) => {
    switch (action.type) {
        case actions.GET_OTHER_USERS_BY_ID: {
            return { ...state, ...action.payload };
        }

        case actions.UPDATE_OTHER_USER: {
            return { ...state, ...action.payload };
        }

        case actions.DELETE_OTHER_USER: {
            delete state[action.payload];
            return { ...state };
        }
                
        default: {
            return state;
        }
    }
}