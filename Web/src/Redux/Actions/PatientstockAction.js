import { ROUTES } from "../../Utils/Constants";
import AxiosErrorHelper from "../../Utils/AxiosErrorHelper";
import instanse from "./axios"
import config from "../../Config";

export const ACTION_TYPES = {
    GET_PATIENTSTOCKS_INIT: 'GET_PATIENTSTOCKS_INIT',
    GET_PATIENTSTOCKS_SUCCESS: 'GET_PATIENTSTOCKS_SUCCESS',
    GET_PATIENTSTOCKS_ERROR: 'GET_PATIENTSTOCKS_ERROR',

    GET_ALLPATIENTSTOCKS_INIT: 'GET_ALLPATIENTSTOCKS_INIT',
    GET_ALLPATIENTSTOCKS_SUCCESS: 'GET_ALLPATIENTSTOCKS_SUCCESS',
    GET_ALLPATIENTSTOCKS_ERROR: 'GET_ALLPATIENTSTOCKS_ERROR',

    GET_PATIENTSTOCK_INIT: 'GET_PATIENTSTOCK_INIT',
    GET_PATIENTSTOCK_SUCCESS: 'GET_PATIENTSTOCK_SUCCESS',
    GET_PATIENTSTOCK_ERROR: 'GET_PATIENTSTOCK_ERROR',

    ADD_PATIENTSTOCK_INIT: 'ADD_PATIENTSTOCK_INIT',
    ADD_PATIENTSTOCK_SUCCESS: 'ADD_PATIENTSTOCK_SUCCESS',
    ADD_PATIENTSTOCK_ERROR: 'ADD_PATIENTSTOCK_ERROR',

    EDIT_PATIENTSTOCK_INIT: 'EDIT_PATIENTSTOCK_INIT',
    EDIT_PATIENTSTOCK_SUCCESS: 'EDIT_PATIENTSTOCK_SUCCESS',
    EDIT_PATIENTSTOCK_ERROR: 'EDIT_PATIENTSTOCK_ERROR',

    DELETE_PATIENTSTOCK_INIT: 'DELETE_PATIENTSTOCK_INIT',
    DELETE_PATIENTSTOCK_SUCCESS: 'DELETE_PATIENTSTOCK_SUCCESS',
    DELETE_PATIENTSTOCK_ERROR: 'DELETE_PATIENTSTOCK_ERROR',

    REMOVE_SELECTED_PATIENTSTOCK: 'REMOVE_SELECTED_PATIENTSTOCK',

    FILL_PATIENTSTOCKS_NOTIFICATION: 'FILL_PATIENTSTOCKS_NOTIFICATION',
    REMOVE_PATIENTSTOCKS_NOTIFICATION: 'REMOVE_PATIENTSTOCKS_NOTIFICATION',
}

export const GetPatientstocks = () => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.GET_PATIENTSTOCKS_INIT })
    await instanse.get(config.services.Warehouse, ROUTES.PATIENTSTOCK)
        .then(response => {
            dispatch({ type: ACTION_TYPES.GET_PATIENTSTOCKS_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_PATIENTSTOCKS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.GET_PATIENTSTOCKS_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const GetPatientstock = (guid) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.GET_PATIENTSTOCK_INIT })
    await instanse.get(config.services.Warehouse, `${ROUTES.PATIENTSTOCK}/${guid}`)
        .then(response => {
            dispatch({ type: ACTION_TYPES.GET_PATIENTSTOCK_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_PATIENTSTOCKS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.GET_PATIENTSTOCK_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const AddPatientstocks = (data, historypusher) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.ADD_PATIENTSTOCK_INIT })
    await instanse.post(config.services.Warehouse, ROUTES.PATIENTSTOCK, data)
        .then(response => {
            dispatch({ type: ACTION_TYPES.ADD_PATIENTSTOCK_SUCCESS, payload: response.data })
            historypusher.push('/Patientstocks')
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_PATIENTSTOCKS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.ADD_PATIENTSTOCK_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const EditPatientstocks = (data, historypusher) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.EDIT_PATIENTSTOCK_INIT })
    await instanse.put(config.services.Warehouse, ROUTES.PATIENTSTOCK, data)
        .then(response => {
            dispatch({ type: ACTION_TYPES.EDIT_PATIENTSTOCK_SUCCESS, payload: response.data })
            historypusher.push('/Patientstocks')
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_PATIENTSTOCKS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.EDIT_PATIENTSTOCK_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const DeletePatientstocks = (data) => async (dispatch, getState) => {
    delete data['edit']
    delete data['delete']
    dispatch({ type: ACTION_TYPES.DELETE_PATIENTSTOCK_INIT })
    await instanse.get(config.services.Warehouse, `${ROUTES.PATIENTSTOCK}/${data.Uuid}`)
        .then(response => {
            dispatch({ type: ACTION_TYPES.DELETE_PATIENTSTOCK_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_PATIENTSTOCKS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.DELETE_PATIENTSTOCK_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const RemoveSelectedPatientstock = payload => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.REMOVE_SELECTED_PATIENTSTOCK, payload })
    }
}

export const fillPatientstocknotification = payload => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.FILL_PATIENTSTOCKS_NOTIFICATION, payload })
    }
}

export const removePatientstocknotification = () => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.REMOVE_PATIENTSTOCKS_NOTIFICATION })
    }
}
