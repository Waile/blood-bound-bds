import * as api from '../api';

import { SEARCH_POSTS } from '../constants/actionTypes';
import { convertFilters } from '../utils/utils';

export const searchPosts = ({ filters, page, limit }) => async (dispatch) => {
    try {
        const { data } = await api.searchPosts(convertFilters(filters), page, limit);
        dispatch({ type: SEARCH_POSTS, payload: data });
    } catch (error) {
        console.log(error);
    }
}