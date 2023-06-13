import { ROUTES } from "../../Utils/Constants";
import AxiosErrorHelper from "../../Utils/AxiosErrorHelper";
import instanse from "./axios"
import config from "../../Config";

export const ACTION_TYPES = {
    GET_CHECKPERIODS_INIT: 'GET_CHECKPERIODS_INIT',
    GET_CHECKPERIODS_SUCCESS: 'GET_CHECKPERIODS_SUCCESS',
    GET_CHECKPERIODS_ERROR: 'GET_CHECKPERIODS_ERROR',

    GET_CHECKPERIOD_INIT: 'GET_CHECKPERIOD_INIT',
    GET_CHECKPERIOD_SUCCESS: 'GET_CHECKPERIOD_SUCCESS',
    GET_CHECKPERIOD_ERROR: 'GET_CHECKPERIOD_ERROR',

    ADD_CHECKPERIOD_INIT: 'ADD_CHECKPERIOD_INIT',
    ADD_CHECKPERIOD_SUCCESS: 'ADD_CHECKPERIOD_SUCCESS',
    ADD_CHECKPERIOD_ERROR: 'ADD_CHECKPERIOD_ERROR',

    EDIT_CHECKPERIOD_INIT: 'EDIT_CHECKPERIOD_INIT',
    EDIT_CHECKPERIOD_SUCCESS: 'EDIT_CHECKPERIOD_SUCCESS',
    EDIT_CHECKPERIOD_ERROR: 'EDIT_CHECKPERIOD_ERROR',

    DELETE_CHECKPERIOD_INIT: 'DELETE_CHECKPERIOD_INIT',
    DELETE_CHECKPERIOD_SUCCESS: 'DELETE_CHECKPERIOD_SUCCESS',
    DELETE_CHECKPERIOD_ERROR: 'DELETE_CHECKPERIOD_ERROR',

    REMOVE_SELECTED_CHECKPERIOD: 'REMOVE_SELECTED_CHECKPERIOD',

    FILL_CHECKPERIODS_NOTIFICATION: 'FILL_CHECKPERIODS_NOTIFICATION',
    REMOVE_CHECKPERIODS_NOTIFICATION: 'REMOVE_CHECKPERIODS_NOTIFICATION',
}

export const GetCheckperiods = () => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.GET_CHECKPERIODS_INIT })
    await instanse.get(config.services.Setting, ROUTES.CHECKPERIOD)
        .then(response => {
            dispatch({ type: ACTION_TYPES.GET_CHECKPERIODS_SUCCESS, payload: response.data }) 
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_CHECKPERIODS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.GET_CHECKPERIODS_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const GetCheckperiod = (guid) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.GET_CHECKPERIOD_INIT })
    await instanse.get(config.services.Setting, `${ROUTES.CHECKPERIOD}/${guid}`)
        .then(response => {
            dispatch({ type: ACTION_TYPES.GET_CHECKPERIOD_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_CHECKPERIODS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.GET_CHECKPERIOD_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const AddCheckperiods = (data, historypusher) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.ADD_CHECKPERIOD_INIT })
    await instanse.post(config.services.Setting, ROUTES.CHECKPERIOD, data)
        .then(response => {
                dispatch({ type: ACTION_TYPES.ADD_CHECKPERIOD_SUCCESS, payload: response.data })
                historypusher.push('/Checkperiods')
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_CHECKPERIODS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.ADD_CHECKPERIOD_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const EditCheckperiods = (data, historypusher) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.EDIT_CHECKPERIOD_INIT })
    await instanse.put(config.services.Setting, ROUTES.CHECKPERIOD, data)
        .then(response => {
                dispatch({ type: ACTION_TYPES.EDIT_CHECKPERIOD_SUCCESS, payload: response.data })
                historypusher.push('/Checkperiods')
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_CHECKPERIODS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.EDIT_CHECKPERIOD_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const DeleteCheckperiods = (data) => async (dispatch, getState) => {
    delete data['edit']
    delete data['delete']
    dispatch({ type: ACTION_TYPES.DELETE_CHECKPERIOD_INIT })
    await instanse.delete(config.services.Setting, `${ROUTES.CHECKPERIOD}/${data.Uuid}`)
        .then(response => {
                dispatch({ type: ACTION_TYPES.DELETE_CHECKPERIOD_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_CHECKPERIODS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.DELETE_CHECKPERIOD_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const RemoveSelectedCheckperiod = payload => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.REMOVE_SELECTED_CHECKPERIOD, payload })
    }
}

export const fillCheckperiodnotification = payload => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.FILL_CHECKPERIODS_NOTIFICATION, payload })
    }
}

export const removeCheckperiodnotification = () => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.REMOVE_CHECKPERIODS_NOTIFICATION })
    }
}
