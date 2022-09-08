import * as api from '../api';

import { GET_MESSAGES_BY_ID } from '../constants/actionTypes';

export const getMessagesById = (ids) => async (dispatch) => {
    try {
        let { data } = await api.getMessagesById(ids);
        data = data.map(chatMessage => {
            const retVal = {};
            retVal[chatMessage._id] = chatMessage;
            return retVal;
        });
        const payload = data.reduce((acc, messages) => ({ ...acc, ...messages }), {});

        dispatch({ type: GET_MESSAGES_BY_ID, payload });
    } catch (error) {
        console.log(error);
    }
} 