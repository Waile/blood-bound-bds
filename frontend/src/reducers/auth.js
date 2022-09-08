import * as actions from '../constants/actionTypes';

export default (auth = { token: JSON.parse(localStorage.getItem('jwt'))?.token }, action) => {
    switch (action.type) {
        case actions.LOGIN: {
            localStorage.setItem('jwt', JSON.stringify({ token: action.payload }));
            return { token: action.payload };
        }
        
        case actions.LOGOUT: {
            localStorage.clear();
            return { token: null };
        }

        default: {
            return auth;
        }
    }
}