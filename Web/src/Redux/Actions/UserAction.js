import { ROUTES } from "../../Utils/Constants";
import AxiosErrorHelper from "../../Utils/AxiosErrorHelper";
import instanse from "./axios"
import config from "../../Config";

export const ACTION_TYPES = {
    GET_USERS_INIT: 'GET_USERS_INIT',
    GET_USERS_SUCCESS: 'GET_USERS_SUCCESS',
    GET_USERS_ERROR: 'GET_USERS_ERROR',

    GET_USER_INIT: 'GET_USER_INIT',
    GET_USER_SUCCESS: 'GET_USER_SUCCESS',
    GET_USER_ERROR: 'GET_USER_ERROR',

    ADD_USER_INIT: 'ADD_USER_INIT',
    ADD_USER_SUCCESS: 'ADD_USER_SUCCESS',
    ADD_USER_ERROR: 'ADD_USER_ERROR',

    EDIT_USER_INIT: 'EDIT_USER_INIT',
    EDIT_USER_SUCCESS: 'EDIT_USER_SUCCESS',
    EDIT_USER_ERROR: 'EDIT_USER_ERROR',

    DELETE_USER_INIT: 'DELETE_USER_INIT',
    DELETE_USER_SUCCESS: 'DELETE_USER_SUCCESS',
    DELETE_USER_ERROR: 'DELETE_USER_ERROR',

    REMOVE_SELECTED_USER: 'REMOVE_SELECTED_USER',

    FILL_USERS_NOTIFICATION: 'FILL_USERS_NOTIFICATION',
    REMOVE_USERS_NOTIFICATION: 'REMOVE_USERS_NOTIFICATION',
}

export const GetUsers = () => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.GET_USERS_INIT })
    await instanse.get(config.services.Userrole, ROUTES.USER)
        .then(response => {
            dispatch({ type: ACTION_TYPES.GET_USERS_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_USERS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.GET_USERS_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const GetUser = (guid) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.GET_USER_INIT })
    await instanse.get(config.services.Userrole, `${ROUTES.USER}/${guid}`)
        .then(response => {
            dispatch({ type: ACTION_TYPES.GET_USER_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_USERS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.GET_USER_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const AddUsers = (data, historypusher) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.ADD_USER_INIT })
    await instanse.post(config.services.Userrole, ROUTES.USER, data)
        .then(response => {
            dispatch({ type: ACTION_TYPES.ADD_USER_SUCCESS, payload: response.data })
            historypusher.push('/Users')
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_USERS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.ADD_USER_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const EditUsers = (data, historypusher, redirecturl) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.EDIT_USER_INIT })
    await instanse.put(config.services.Userrole, ROUTES.USER, data)
        .then(response => {
            dispatch({ type: ACTION_TYPES.EDIT_USER_SUCCESS, payload: response.data })
            historypusher.push(redirecturl ? redirecturl : '/Users')
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_USERS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.EDIT_USER_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const DeleteUsers = (data) => async (dispatch, getState) => {
    delete data['edit']
    delete data['delete']
    dispatch({ type: ACTION_TYPES.DELETE_USER_INIT })
    await instanse.delete(config.services.Userrole, ROUTES.USER, data)
        .then(response => {
            dispatch({ type: ACTION_TYPES.DELETE_USER_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_USERS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.DELETE_USER_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const RemoveSelectedUser = payload => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.REMOVE_SELECTED_USER, payload })
    }
}

export const fillUsernotification = payload => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.FILL_USERS_NOTIFICATION, payload })
    }
}

export const removeUsernotification = () => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.REMOVE_USERS_NOTIFICATION })
    }
}
