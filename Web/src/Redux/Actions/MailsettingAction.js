import { ROUTES } from "../../Utils/Constants";
import AxiosErrorHelper from "../../Utils/AxiosErrorHelper";
import instanse from "./axios"

export const ACTION_TYPES = {
    GET_MAILSETTINGS_INIT: 'GET_MAILSETTINGS_INIT',
    GET_MAILSETTINGS_SUCCESS: 'GET_MAILSETTINGS_SUCCESS',
    GET_MAILSETTINGS_ERROR: 'GET_MAILSETTINGS_ERROR',

    GET_MAILSETTING_INIT: 'GET_MAILSETTING_INIT',
    GET_MAILSETTING_SUCCESS: 'GET_MAILSETTING_SUCCESS',
    GET_MAILSETTING_ERROR: 'GET_MAILSETTING_ERROR',

    ADD_MAILSETTING_INIT: 'ADD_MAILSETTING_INIT',
    ADD_MAILSETTING_SUCCESS: 'ADD_MAILSETTING_SUCCESS',
    ADD_MAILSETTING_ERROR: 'ADD_MAILSETTING_ERROR',

    EDIT_MAILSETTING_INIT: 'EDIT_MAILSETTING_INIT',
    EDIT_MAILSETTING_SUCCESS: 'EDIT_MAILSETTING_SUCCESS',
    EDIT_MAILSETTING_ERROR: 'EDIT_MAILSETTING_ERROR',

    DELETE_MAILSETTING_INIT: 'DELETE_MAILSETTING_INIT',
    DELETE_MAILSETTING_SUCCESS: 'DELETE_MAILSETTING_SUCCESS',
    DELETE_MAILSETTING_ERROR: 'DELETE_MAILSETTING_ERROR',

    REMOVE_SELECTED_MAILSETTING: 'REMOVE_SELECTED_MAILSETTING',

    FILL_MAILSETTINGS_NOTIFICATION: 'FILL_MAILSETTINGS_NOTIFICATION',
    REMOVE_MAILSETTINGS_NOTIFICATION: 'REMOVE_MAILSETTINGS_NOTIFICATION',
}

export const GetMailsettings = () => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.GET_MAILSETTINGS_INIT })
    await instanse.get(ROUTES.MAILSETTING + "/GetAll")
        .then(response => {
            dispatch({ type: ACTION_TYPES.GET_MAILSETTINGS_SUCCESS, payload: response.data }) 
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_MAILSETTINGS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.GET_MAILSETTINGS_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const GetMailsetting = (guid) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.GET_MAILSETTING_INIT })
    await instanse.get(ROUTES.MAILSETTING + `/Getselected?guid=${guid}`)
        .then(response => {
            dispatch({ type: ACTION_TYPES.GET_MAILSETTING_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_MAILSETTINGS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.GET_MAILSETTING_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const AddMailsettings = (data, historypusher) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.ADD_MAILSETTING_INIT })
    await instanse.post(ROUTES.MAILSETTING + "/Add", data)
        .then(response => {
                dispatch({ type: ACTION_TYPES.ADD_MAILSETTING_SUCCESS, payload: response.data })
                historypusher.push('/Mailsettings')
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_MAILSETTINGS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.ADD_MAILSETTING_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const EditMailsettings = (data, historypusher) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.EDIT_MAILSETTING_INIT })
    await instanse.post(ROUTES.MAILSETTING + "/Update", data)
        .then(response => {
                dispatch({ type: ACTION_TYPES.EDIT_MAILSETTING_SUCCESS, payload: response.data })
                historypusher.push('/Mailsettings')
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_MAILSETTINGS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.EDIT_MAILSETTING_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const DeleteMailsettings = (data) => async (dispatch, getState) => {
    delete data['edit']
    delete data['delete']
    dispatch({ type: ACTION_TYPES.DELETE_MAILSETTING_INIT })
    await instanse.post(ROUTES.MAILSETTING + "/Delete", data)
        .then(response => {
                dispatch({ type: ACTION_TYPES.DELETE_MAILSETTING_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_MAILSETTINGS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.DELETE_MAILSETTING_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const RemoveSelectedMailsetting = payload => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.REMOVE_SELECTED_MAILSETTING, payload })
    }
}

export const fillMailsettingnotification = payload => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.FILL_MAILSETTINGS_NOTIFICATION, payload })
    }
}

export const removeMailsettingnotification = () => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.REMOVE_MAILSETTINGS_NOTIFICATION })
    }
}
