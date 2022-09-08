import * as api from '../api';

import { CREATE_EMERGENCY, GET_EMERGENCY, UPDATE_EMERGENCY, UPDATE_USER } from '../constants/actionTypes';

export const getEmergencyPosts = () => async (dispatch) => {
    try {
        const { data } = await api.getEmergencyPosts();
        dispatch({ type: GET_EMERGENCY, payload: data });
    } catch (error) {
        console.log(error);
    }
}

export const createEmergencyPost = (newEPost, { emergencyPosts }) => async (dispatch) => {
    try {
        const { data } = await api.createEmergencyPost(newEPost);
        dispatch({ type: CREATE_EMERGENCY, payload: data });

        const payload = { emergencyPosts };
        payload.emergencyPosts.push(data);

        dispatch({ type: UPDATE_USER, payload });
    } catch (error) {
        console.log(error);
    }
}

export const updateEmergencyPost = (id, updatedEPost) => async (dispatch) => {
    try {
        const { data } = await api.updateEmergencyPost(id, updatedEPost);
        dispatch({ type: UPDATE_EMERGENCY, payload: data });
    } catch (error) {
        console.log(error);
    }
}