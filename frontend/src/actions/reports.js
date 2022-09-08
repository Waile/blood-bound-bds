import * as api from '../api';

import { GET_REPORTS, REMOVE_REPORT } from '../constants/actionTypes';

export const getReports = () => async (dispatch) => {
    try {
        const { data } = await api.getReports();

        dispatch({ type: GET_REPORTS, payload: data });
    } catch (error) {
        console.log(error);
    }
}

export const updateReport = (id, updates) => async (dispatch) => {
    try {
        await api.updateReport(id, updates);

        dispatch({ type: REMOVE_REPORT, payload: id });
    } catch (error) {
        console.log(error);
    }
}