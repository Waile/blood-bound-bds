import * as api from '../api';

import { CREATE_POST, GET_POSTS_BY_ID, UPDATE_POST, UPDATE_USER } from '../constants/actionTypes';

export const getPostsById = (ids) => async (dispatch) => {
    try {
        let { data } = await api.getPostsById(ids);
        data = data.map(post => {
            const retVal = {};
            retVal[post._id] = post;
            return retVal;
        });
        const payload = data.reduce((acc, post) => ({ ...acc, ...post }), {});

        dispatch({ type: GET_POSTS_BY_ID, payload });
    } catch (error) {
        console.log(error);
    }
}

export const createPost = (newPost, { posts }) => async (dispatch) => {
    try {
        const { data } = await api.createPost(newPost);
        if (data.errorMessage) {
            alert(data.errorMessage);
            return;
        }
        const payload = {};
        payload[data._id] = data;

        dispatch({ type: CREATE_POST, payload });

        dispatch({ type: UPDATE_USER, payload: { posts: [ ...posts, data._id ] } });
    } catch (error) {
        console.log(error);
    }
}

export const updatePost = (id, updates, { donationsCompleted }) => async (dispatch) => {
    try {
        const { data } = await api.updatePost(id, updates);
        if (data.errorMessage) {
            alert(data.errorMessage);
            return false;
        }
        const payload = {};
        payload[data.newPost._id] = data.newPost;

        dispatch({ type: UPDATE_POST, payload });

        if (updates.fulfilledByDonor) {
            dispatch({ type: UPDATE_USER, payload: [ ...donationsCompleted, data.newPost._id ] });
        }

        return data.isFulfilled;

    } catch (error) {
        console.log(error);
    }
}