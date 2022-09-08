import * as api from '../api';

import { DELETE_OTHER_USER, GET_OTHER_USERS_BY_ID, UPDATE_OTHER_USER } from '../constants/actionTypes';

export const getUsersById = (ids) => async (dispatch) => {
    try {
        let { data } = await api.getUsersById(ids);
        data = data.map(user => {
            const retVal = {};
            retVal[user._id] = user;
            return retVal;
        });
        const payload = data.reduce((acc, user) => ({ ...acc, ...user }), {});

        dispatch({ type: GET_OTHER_USERS_BY_ID, payload });
    } catch (error) {
        console.log(error);
    }
}

export const updateOtherUser = (id, updates) => async (dispatch) => {
    try {
        const { data } = await api.updateUser(id, updates);
        const payload = {};
        payload[id] = data;

        dispatch({ type: UPDATE_OTHER_USER, payload });
    } catch (error) {
        console.log(error);
    }
}

export const searchUsers = (filters) => async (dispatch) => {
    try {
        let { data } = await api.searchUsers(filters);
        data = data.map(user => {
            const retVal = {};
            retVal[user._id] = user;
            return retVal;
        });
        const payload = data.reduce((acc, user) => ({ ...acc, ...user }), {});

        dispatch({ type: GET_OTHER_USERS_BY_ID, payload });
    } catch (error) {
        console.log(error);
    }
}

export const getOtherUser = (username) => async (dispatch) => {
    try {
        const { data } = await api.getUser(username);
        const payload = {};
        payload[data._id] = data;

        dispatch({ type: GET_OTHER_USERS_BY_ID, payload });
    } catch (error) {
        console.log(error);
    }
}

export const deleteOtherUser = (id) => async (dispatch) => {
    try {
        await api.deleteUser(id);
        //chats associated with this user should disappear, so the old version had a windlow.location.reload(false) here
        //might handle that in controllers instead, and have the chat removed if accessed.
        dispatch({ type: DELETE_OTHER_USER, payload: id });
    } catch (error) {
        console.log(error);
    }
}

export const getSupport = () => async (dispatch) => {
    try {
        const { data } = await api.getSupport();
        return data.username;
    } catch (error) {
        console.log(error);
    }
}