import * as actions from '../constants/actionTypes';

export default (state = {}, action) => {
    switch (action.type) {
        case actions.GET_POSTS_BY_ID: {
            return { ...state, ...action.payload };
        }

        case actions.CREATE_POST: {
            return { ...state, ...action.payload };
        }

        case actions.UPDATE_POST: {
            return { ...state, ...action.payload };
        }
                
        default: {
            return state;
        }
    }
}