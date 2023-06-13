import { ROUTES } from "../../Utils/Constants";
import AxiosErrorHelper from "../../Utils/AxiosErrorHelper";
import instanse from "./axios"
import config from "../../Config";

export const ACTION_TYPES = {
    GET_CASES_INIT: 'GET_CASES_INIT',
    GET_CASES_SUCCESS: 'GET_CASES_SUCCESS',
    GET_CASES_ERROR: 'GET_CASES_ERROR',

    GET_ALLCASES_INIT: 'GET_ALLCASES_INIT',
    GET_ALLCASES_SUCCESS: 'GET_ALLCASES_SUCCESS',
    GET_ALLCASES_ERROR: 'GET_ALLCASES_ERROR',

    GET_CASE_INIT: 'GET_CASE_INIT',
    GET_CASE_SUCCESS: 'GET_CASE_SUCCESS',
    GET_CASE_ERROR: 'GET_CASE_ERROR',

    ADD_CASE_INIT: 'ADD_CASE_INIT',
    ADD_CASE_SUCCESS: 'ADD_CASE_SUCCESS',
    ADD_CASE_ERROR: 'ADD_CASE_ERROR',

    EDIT_CASE_INIT: 'EDIT_CASE_INIT',
    EDIT_CASE_SUCCESS: 'EDIT_CASE_SUCCESS',
    EDIT_CASE_ERROR: 'EDIT_CASE_ERROR',

    DELETE_CASE_INIT: 'DELETE_CASE_INIT',
    DELETE_CASE_SUCCESS: 'DELETE_CASE_SUCCESS',
    DELETE_CASE_ERROR: 'DELETE_CASE_ERROR',

    REMOVE_SELECTED_CASE: 'REMOVE_SELECTED_CASE',

    FILL_CASES_NOTIFICATION: 'FILL_CASES_NOTIFICATION',
    REMOVE_CASES_NOTIFICATION: 'REMOVE_CASES_NOTIFICATION',
}

export const GetCases = () => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.GET_CASES_INIT })
    await instanse.get(config.services.Setting, ROUTES.CASE)
        .then(response => {
            dispatch({ type: ACTION_TYPES.GET_CASES_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_CASES_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.GET_CASES_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const GetCase = (guid) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.GET_CASE_INIT })
    await instanse.get(config.services.Setting, `${ROUTES.CASE}/${guid}`)
        .then(response => {
            dispatch({ type: ACTION_TYPES.GET_CASE_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_CASES_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.GET_CASE_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const AddCases = (data, historypusher) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.ADD_CASE_INIT })
    await instanse.post(config.services.Setting, ROUTES.CASE, data)
        .then(response => {
            dispatch({ type: ACTION_TYPES.ADD_CASE_SUCCESS, payload: response.data })
            historypusher.push('/Cases')
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_CASES_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.ADD_CASE_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const EditCases = (data, historypusher) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.EDIT_CASE_INIT })
    await instanse.put(config.services.Setting, ROUTES.CASE, data)
        .then(response => {
            dispatch({ type: ACTION_TYPES.EDIT_CASE_SUCCESS, payload: response.data })
            historypusher.push('/Cases')
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_CASES_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.EDIT_CASE_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const DeleteCases = (data) => async (dispatch, getState) => {
    delete data['edit']
    delete data['delete']
    dispatch({ type: ACTION_TYPES.DELETE_CASE_INIT })
    await instanse.delete(config.services.Setting, `${ROUTES.CASE}/${data.Uuid}`)
        .then(response => {
            dispatch({ type: ACTION_TYPES.DELETE_CASE_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_CASES_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.DELETE_CASE_ERROR, payload: AxiosErrorHelper(error) })
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
