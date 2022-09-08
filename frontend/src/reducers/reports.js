import * as actions from '../constants/actionTypes';

export default (state = [], action) => {
    switch (action.type) {
        case actions.GET_REPORTS: {
            return [ ...state, ...action.payload ];
        }

        case actions.REMOVE_REPORT: {
            return state.filter(report => report._id != action.payload);
        }
                
        default: {
            return state;
        }
    }
}