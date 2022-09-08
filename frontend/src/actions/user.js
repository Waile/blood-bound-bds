import * as api from '../api';

import { CREATE_REPORT, GET_USER, UPDATE_USER } from '../constants/actionTypes';

export const getUser = (username) => async (dispatch) => {
    try {
        const { data } = await api.getUser(username);
        dispatch({ type: GET_USER, payload: data });
    } catch (error) {
        console.log(error);
    }
}

export const updateUser = (_id, updates) => async (dispatch) => {
    try {
        const { data } = await api.updateUser(_id, updates);
        dispatch({ type: UPDATE_USER, payload: data });
    } catch (error) {
        console.log(error);
    }
}

export const setForDelete = (id) => async (dispatch) => {
    try {
        await api.setForDelete(id);
    } catch (error) {
        console.log(error);
    }
}

export const createReport = (report) => async (dispatch) => {
    try {
        const { data } = await api.createReport(report);

        dispatch({ type: CREATE_REPORT, payload: data._id });
    } catch (error) {
        console.log(error);
    }
}

export const createNotification = (notif) => async (dispatch) => {
    try {
        const { data } = await api.notify(notif);
        return data;
    } catch (error) {
        console.log(error);
    }
}

export const assistiveSignUp = (rawUser, accountsCreated) => async (dispatch) => {
    try {
        const res = await api.assistiveSignUp(rawUser);

        res?.data?._id && dispatch({ type: UPDATE_USER, payload: { accountsCreated: [ ...accountsCreated, res.data._id ] } });
        return res;
    } catch (error) {
        console.log(error);
    }
}