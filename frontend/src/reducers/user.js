import * as actions from "../constants/actionTypes";

export default (user = { username: '' }, action) => {
    switch (action.type) {
        case actions.GET_USER: {
            return action.payload; 
        }
        
        case actions.UPDATE_USER: {
            return { ...user, ...action.payload };
        }

        case actions.CREATE_REPORT: {
            return { ...user, reportsFiled: [ ...user.reportsFiled, action.payload ] };
        }
            
        default: {
            return user;
        }
    }
}