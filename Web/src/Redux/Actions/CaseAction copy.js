import { ROUTES } from "../../Utils/Constants";
import AxiosErrorHelper from "../../Utils/AxiosErrorHelper";
import instanse from "./axios"

export const ACTION_TYPES = {
    GET_CASES_INIT: 'GET_CASES_INIT',
    GET_CASES_SUCCESS: 'GET_CASES_SUCCESS',
    GET_CASES_ERROR: 'GET_CASES_ERROR',

    ADD_CASE_INIT: 'ADD_CASE_INIT',
    ADD_CASE_SUCCESS: 'ADD_CASE_SUCCESS',
    ADD_CASE_ERROR: 'ADD_CASE_ERROR',

    REMOVE_SELECTED_CASE: 'REMOVE_SELECTED_CASE',

    FILL_CASES_NOTIFICATION: 'FILL_CASES_NOTIFICATION',
    REMOVE_CASES_NOTIFICATION: 'REMOVE_CASES_NOTIFICATION',
}

export const GetCases = () => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.GET_CASES_INIT })
    await instanse.get(ROUTES.CASE + "/GetAll")
        .then(response => {
            dispatch({ type: ACTION_TYPES.GET_CASES_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_CASES_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.GET_CASES_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const AddCases = (data, historypusher) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.ADD_CASE_INIT })
    await instanse.post(ROUTES.CASE + "/Add", data)
        .then(response => {
                dispatch({ type: ACTION_TYPES.ADD_CASE_SUCCESS, payload: response.data })
                historypusher.push('/Cases')
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_CASES_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.ADD_CASE_ERROR, payload: AxiosErrorHelper(error) })
        })
}


export const RemoveSelectedCase = payload => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.REMOVE_SELECTED_CASE, payload })
    }
}

export const fillCasenotification = payload => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.FILL_CASES_NOTIFICATION, payload })
    }
}

export const removeCasenotification = () => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.REMOVE_CASES_NOTIFICATION })
    }
}
