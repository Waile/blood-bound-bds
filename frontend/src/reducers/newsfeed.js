import * as actions from "../constants/actionTypes";

export default (state = { posts: [] }, action) => {
    switch (action.type) {
        case actions.SEARCH_POSTS: {
            return { 
                ...state, 
                posts: action.payload.results, 
                nextPage: action.payload?.next?.page, 
                prevPage: action.payload?.previous?.page 
            };
        }
        
        default: {
            return state;
        }
    }
}