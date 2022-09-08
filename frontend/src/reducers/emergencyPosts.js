import * as actions from '../constants/actionTypes';

export default (state = [], action) => {
    switch (action.type) {
        case actions.GET_EMERGENCY: {
            return [ ...state, ...action.payload ];
        }

        case actions.CREATE_EMERGENCY: {
            return [ action.payload, ...state ];
        }

        case actions.UPDATE_EMERGENCY: {
            const old = state.filter(epost => epost._id != action.payload._id);

            if (!action.payload.isActive) {
                return old;
            }

            return [ ...old, action.payload ];
        }
                
        default: {
            return state;
        }
    }
}