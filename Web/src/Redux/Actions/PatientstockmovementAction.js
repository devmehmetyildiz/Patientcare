import { ROUTES } from "../../Utils/Constants";
import AxiosErrorHelper from "../../Utils/AxiosErrorHelper";
import instanse from "./axios"
import config from "../../Config";

export const ACTION_TYPES = {
    GET_PATIENTSTOCKMOVEMENTS_INIT: 'GET_PATIENTSTOCKMOVEMENTS_INIT',
    GET_PATIENTSTOCKMOVEMENTS_SUCCESS: 'GET_PATIENTSTOCKMOVEMENTS_SUCCESS',
    GET_PATIENTSTOCKMOVEMENTS_ERROR: 'GET_PATIENTSTOCKMOVEMENTS_ERROR',

    GET_ALLPATIENTSTOCKMOVEMENTS_INIT: 'GET_ALLPATIENTSTOCKMOVEMENTS_INIT',
    GET_ALLPATIENTSTOCKMOVEMENTS_SUCCESS: 'GET_ALLPATIENTSTOCKMOVEMENTS_SUCCESS',
    GET_ALLPATIENTSTOCKMOVEMENTS_ERROR: 'GET_ALLPATIENTSTOCKMOVEMENTS_ERROR',

    GET_PATIENTSTOCKMOVEMENT_INIT: 'GET_PATIENTSTOCKMOVEMENT_INIT',
    GET_PATIENTSTOCKMOVEMENT_SUCCESS: 'GET_PATIENTSTOCKMOVEMENT_SUCCESS',
    GET_PATIENTSTOCKMOVEMENT_ERROR: 'GET_PATIENTSTOCKMOVEMENT_ERROR',

    ADD_PATIENTSTOCKMOVEMENT_INIT: 'ADD_PATIENTSTOCKMOVEMENT_INIT',
    ADD_PATIENTSTOCKMOVEMENT_SUCCESS: 'ADD_PATIENTSTOCKMOVEMENT_SUCCESS',
    ADD_PATIENTSTOCKMOVEMENT_ERROR: 'ADD_PATIENTSTOCKMOVEMENT_ERROR',

    EDIT_PATIENTSTOCKMOVEMENT_INIT: 'EDIT_PATIENTSTOCKMOVEMENT_INIT',
    EDIT_PATIENTSTOCKMOVEMENT_SUCCESS: 'EDIT_PATIENTSTOCKMOVEMENT_SUCCESS',
    EDIT_PATIENTSTOCKMOVEMENT_ERROR: 'EDIT_PATIENTSTOCKMOVEMENT_ERROR',

    DELETE_PATIENTSTOCKMOVEMENT_INIT: 'DELETE_PATIENTSTOCKMOVEMENT_INIT',
    DELETE_PATIENTSTOCKMOVEMENT_SUCCESS: 'DELETE_PATIENTSTOCKMOVEMENT_SUCCESS',
    DELETE_PATIENTSTOCKMOVEMENT_ERROR: 'DELETE_PATIENTSTOCKMOVEMENT_ERROR',

    REMOVE_SELECTED_PATIENTSTOCKMOVEMENT: 'REMOVE_SELECTED_PATIENTSTOCKMOVEMENT',

    FILL_PATIENTSTOCKMOVEMENTS_NOTIFICATION: 'FILL_PATIENTSTOCKMOVEMENTS_NOTIFICATION',
    REMOVE_PATIENTSTOCKMOVEMENTS_NOTIFICATION: 'REMOVE_PATIENTSTOCKMOVEMENTS_NOTIFICATION',
}

export const GetPatientstockmovements = () => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.GET_PATIENTSTOCKMOVEMENTS_INIT })
    await instanse.get(config.services.Warehouse, ROUTES.PATIENTSTOCKMOVEMENT)
        .then(response => {
            dispatch({ type: ACTION_TYPES.GET_PATIENTSTOCKMOVEMENTS_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_PATIENTSTOCKMOVEMENTS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.GET_PATIENTSTOCKMOVEMENTS_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const GetPatientstockmovement = (guid) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.GET_PATIENTSTOCKMOVEMENT_INIT })
    await instanse.get(config.services.Warehouse, `${ROUTES.PATIENTSTOCKMOVEMENT}/${guid}`)
        .then(response => {
            dispatch({ type: ACTION_TYPES.GET_PATIENTSTOCKMOVEMENT_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_PATIENTSTOCKMOVEMENTS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.GET_PATIENTSTOCKMOVEMENT_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const AddPatientstockmovements = (data, historypusher) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.ADD_PATIENTSTOCKMOVEMENT_INIT })
    await instanse.post(config.services.Warehouse, ROUTES.PATIENTSTOCKMOVEMENT, data)
        .then(response => {
            dispatch({ type: ACTION_TYPES.ADD_PATIENTSTOCKMOVEMENT_SUCCESS, payload: response.data })
            historypusher.push('/Patientstockmovements')
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_PATIENTSTOCKMOVEMENTS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.ADD_PATIENTSTOCKMOVEMENT_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const EditPatientstockmovements = (data, historypusher) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.EDIT_PATIENTSTOCKMOVEMENT_INIT })
    await instanse.put(config.services.Warehouse, ROUTES.PATIENTSTOCKMOVEMENT, data)
        .then(response => {
            dispatch({ type: ACTION_TYPES.EDIT_PATIENTSTOCKMOVEMENT_SUCCESS, payload: response.data })
            historypusher.push('/Patientstockmovements')
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_PATIENTSTOCKMOVEMENTS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.EDIT_PATIENTSTOCKMOVEMENT_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const DeletePatientstockmovements = (data) => async (dispatch, getState) => {
    delete data['edit']
    delete data['delete']
    dispatch({ type: ACTION_TYPES.DELETE_PATIENTSTOCKMOVEMENT_INIT })
    await instanse.get(config.services.Warehouse, `${ROUTES.PATIENTSTOCKMOVEMENT}/${data.Uuid}`)
        .then(response => {
            dispatch({ type: ACTION_TYPES.DELETE_PATIENTSTOCKMOVEMENT_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_PATIENTSTOCKMOVEMENTS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.DELETE_PATIENTSTOCKMOVEMENT_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const RemoveSelectedPatientstockmovement = payload => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.REMOVE_SELECTED_PATIENTSTOCKMOVEMENT, payload })
    }
}

export const fillPatientstockmovementnotification = payload => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.FILL_PATIENTSTOCKMOVEMENTS_NOTIFICATION, payload })
    }
}

export const removePatientstockmovementnotification = () => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.REMOVE_PATIENTSTOCKMOVEMENTS_NOTIFICATION })
    }
}
