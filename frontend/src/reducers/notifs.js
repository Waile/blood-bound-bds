import * as actions from '../constants/actionTypes';

export default (state = [], action) => {
    switch (action.type) {
        case actions.GET_NOTIFICATIONS_BY_ID: {
            return [ ...state, ...action.payload ];
        }

        case actions.MARK_AS_READ: {
            return state.map(notif => action.payload.indexOf(notif._id) == -1 ? notif : { ...notif, read: true });
        }
    
        default: {
            return state;
        }
    }
}