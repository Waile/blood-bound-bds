import * as api from '../api';

import { GET_NOTIFICATIONS_BY_ID, MARK_AS_READ } from '../constants/actionTypes';

export const getNotificationsById = (ids) => async (dispatch) => {
    try {
        const { data } = await api.getNotificationsById(ids);

        dispatch({ type: GET_NOTIFICATIONS_BY_ID, payload: data });
    } catch (error) {
        console.log(error);
    }
}

export const markAsRead = (ids) => async (dispatch) => {
    try {
        await api.markAsRead(ids);

        dispatch({ type: MARK_AS_READ, payload: ids });
    } catch (error) {
        console.log(error);
    }
}