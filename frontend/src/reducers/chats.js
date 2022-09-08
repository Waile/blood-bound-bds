import * as actions from '../constants/actionTypes';

export default (state = {}, action) => {
    switch (action.type) {
        case actions.GET_CHATS_BY_ID: {
            return { ...state, ...action.payload };
        }

        case actions.GET_CHAT: {
            return { ...state, ...action.payload };
        }

        case actions.UPDATE_CHAT: {
            const update = {};
            update[action.payload._id] = { ...state[action.payload._id] , ...action.payload };
            return { ...state, ...update };
        }
        
        case actions.REMOVE_CHAT: {
            const copy = { ...state };
            delete copy[action.payload];
            return copy;
        }

        default: {
            return state;
        }
    }
}