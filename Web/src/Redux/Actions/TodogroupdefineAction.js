import { ROUTES } from "../../Utils/Constants";
import AxiosErrorHelper from "../../Utils/AxiosErrorHelper";
import instanse from "./axios"
import config from "../../Config";

export const ACTION_TYPES = {
    GET_TODOGROUPDEFINES_INIT: 'GET_TODOGROUPDEFINES_INIT',
    GET_TODOGROUPDEFINES_SUCCESS: 'GET_TODOGROUPDEFINES_SUCCESS',
    GET_TODOGROUPDEFINES_ERROR: 'GET_TODOGROUPDEFINES_ERROR',

    GET_TODOGROUPDEFINE_INIT: 'GET_TODOGROUPDEFINE_INIT',
    GET_TODOGROUPDEFINE_SUCCESS: 'GET_TODOGROUPDEFINE_SUCCESS',
    GET_TODOGROUPDEFINE_ERROR: 'GET_TODOGROUPDEFINE_ERROR',

    ADD_TODOGROUPDEFINE_INIT: 'ADD_TODOGROUPDEFINE_INIT',
    ADD_TODOGROUPDEFINE_SUCCESS: 'ADD_TODOGROUPDEFINE_SUCCESS',
    ADD_TODOGROUPDEFINE_ERROR: 'ADD_TODOGROUPDEFINE_ERROR',

    EDIT_TODOGROUPDEFINE_INIT: 'EDIT_TODOGROUPDEFINE_INIT',
    EDIT_TODOGROUPDEFINE_SUCCESS: 'EDIT_TODOGROUPDEFINE_SUCCESS',
    EDIT_TODOGROUPDEFINE_ERROR: 'EDIT_TODOGROUPDEFINE_ERROR',

    DELETE_TODOGROUPDEFINE_INIT: 'DELETE_TODOGROUPDEFINE_INIT',
    DELETE_TODOGROUPDEFINE_SUCCESS: 'DELETE_TODOGROUPDEFINE_SUCCESS',
    DELETE_TODOGROUPDEFINE_ERROR: 'DELETE_TODOGROUPDEFINE_ERROR',

    REMOVE_SELECTED_TODOGROUPDEFINE: 'REMOVE_SELECTED_TODOGROUPDEFINE',

    FILL_TODOGROUPDEFINES_NOTIFICATION: 'FILL_TODOGROUPDEFINES_NOTIFICATION',
    REMOVE_TODOGROUPDEFINES_NOTIFICATION: 'REMOVE_TODOGROUPDEFINES_NOTIFICATION',
}

export const GetTodogroupdefines = () => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.GET_TODOGROUPDEFINES_INIT })
    await instanse.get(config.services.Setting, ROUTES.TODOGROUPDEFINE)
        .then(response => {
            dispatch({ type: ACTION_TYPES.GET_TODOGROUPDEFINES_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_TODOGROUPDEFINES_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.GET_TODOGROUPDEFINES_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const GetTodogroupdefine = (guid) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.GET_TODOGROUPDEFINE_INIT })
    await instanse.get(config.services.Setting, `${ROUTES.TODOGROUPDEFINE}/${guid}`)
        .then(response => {
            dispatch({ type: ACTION_TYPES.GET_TODOGROUPDEFINE_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_TODOGROUPDEFINES_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.GET_TODOGROUPDEFINE_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const AddTodogroupdefines = (data, historypusher) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.ADD_TODOGROUPDEFINE_INIT })
    await instanse.post(config.services.Setting, ROUTES.TODOGROUPDEFINE, data)
        .then(response => {
                dispatch({ type: ACTION_TYPES.ADD_TODOGROUPDEFINE_SUCCESS, payload: response.data })
                historypusher.push('/Todogroupdefines')
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_TODOGROUPDEFINES_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.ADD_TODOGROUPDEFINE_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const EditTodogroupdefines = (data, historypusher) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.EDIT_TODOGROUPDEFINE_INIT })
    await instanse.put(config.services.Setting, ROUTES.TODOGROUPDEFINE, data)
        .then(response => {
                dispatch({ type: ACTION_TYPES.EDIT_TODOGROUPDEFINE_SUCCESS, payload: response.data })
                historypusher.push('/Todogroupdefines')
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_TODOGROUPDEFINES_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.EDIT_TODOGROUPDEFINE_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const DeleteTodogroupdefines = (data) => async (dispatch, getState) => {
    delete data['edit']
    delete data['delete']
    dispatch({ type: ACTION_TYPES.DELETE_TODOGROUPDEFINE_INIT })
    await instanse.delete(config.services.Setting, ROUTES.TODOGROUPDEFINE, data)
        .then(response => {
                dispatch({ type: ACTION_TYPES.DELETE_TODOGROUPDEFINE_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_TODOGROUPDEFINES_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.DELETE_TODOGROUPDEFINE_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const RemoveSelectedTodogroupdefine = payload => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.REMOVE_SELECTED_TODOGROUPDEFINE, payload })
    }
}

export const fillTodogroupdefinenotification = payload => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.FILL_TODOGROUPDEFINES_NOTIFICATION, payload })
    }
}

export const removeTodogroupdefinenotification = () => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.REMOVE_TODOGROUPDEFINES_NOTIFICATION })
    }
}
