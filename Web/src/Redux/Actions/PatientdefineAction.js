import { ROUTES } from "../../Utils/Constants";
import AxiosErrorHelper from "../../Utils/AxiosErrorHelper";
import instanse from "./axios"

export const ACTION_TYPES = {
    GET_PATIENTDEFINES_INIT: 'GET_PATIENTDEFINES_INIT',
    GET_PATIENTDEFINES_SUCCESS: 'GET_PATIENTDEFINES_SUCCESS',
    GET_PATIENTDEFINES_ERROR: 'GET_PATIENTDEFINES_ERROR',

    GET_ALLPATIENTDEFINES_INIT: 'GET_ALLPATIENTDEFINES_INIT',
    GET_ALLPATIENTDEFINES_SUCCESS: 'GET_ALLPATIENTDEFINES_SUCCESS',
    GET_ALLPATIENTDEFINES_ERROR: 'GET_ALLPATIENTDEFINES_ERROR',

    GET_PATIENTDEFINE_INIT: 'GET_PATIENTDEFINE_INIT',
    GET_PATIENTDEFINE_SUCCESS: 'GET_PATIENTDEFINE_SUCCESS',
    GET_PATIENTDEFINE_ERROR: 'GET_PATIENTDEFINE_ERROR',

    ADD_PATIENTDEFINE_INIT: 'ADD_PATIENTDEFINE_INIT',
    ADD_PATIENTDEFINE_SUCCESS: 'ADD_PATIENTDEFINE_SUCCESS',
    ADD_PATIENTDEFINE_ERROR: 'ADD_PATIENTDEFINE_ERROR',

    EDIT_PATIENTDEFINE_INIT: 'EDIT_PATIENTDEFINE_INIT',
    EDIT_PATIENTDEFINE_SUCCESS: 'EDIT_PATIENTDEFINE_SUCCESS',
    EDIT_PATIENTDEFINE_ERROR: 'EDIT_PATIENTDEFINE_ERROR',

    DELETE_PATIENTDEFINE_INIT: 'DELETE_PATIENTDEFINE_INIT',
    DELETE_PATIENTDEFINE_SUCCESS: 'DELETE_PATIENTDEFINE_SUCCESS',
    DELETE_PATIENTDEFINE_ERROR: 'DELETE_PATIENTDEFINE_ERROR',

    REMOVE_SELECTED_PATIENTDEFINE: 'REMOVE_SELECTED_PATIENTDEFINE',

    FILL_PATIENTDEFINES_NOTIFICATION: 'FILL_PATIENTDEFINES_NOTIFICATION',
    REMOVE_PATIENTDEFINES_NOTIFICATION: 'REMOVE_PATIENTDEFINES_NOTIFICATION',
}

export const GetPatientdefines = () => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.GET_PATIENTDEFINES_INIT })
    await instanse.get(ROUTES.PATIENTDEFINE + "/GetAll")
        .then(response => {
            dispatch({ type: ACTION_TYPES.GET_PATIENTDEFINES_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_PATIENTDEFINES_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.GET_PATIENTDEFINES_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const GetPatientdefine = (guid) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.GET_PATIENTDEFINE_INIT })
    await instanse.get(ROUTES.PATIENTDEFINE + `/Getselected?guid=${guid}`)
        .then(response => {
            dispatch({ type: ACTION_TYPES.GET_PATIENTDEFINE_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_PATIENTDEFINES_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.GET_PATIENTDEFINE_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const AddPatientdefines = (data, historypusher) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.ADD_PATIENTDEFINE_INIT })
    await instanse.post(ROUTES.PATIENTDEFINE + "/Add", data)
        .then(response => {
            dispatch({ type: ACTION_TYPES.ADD_PATIENTDEFINE_SUCCESS, payload: response.data })
            historypusher.push('/Patientdefines')
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_PATIENTDEFINES_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.ADD_PATIENTDEFINE_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const EditPatientdefines = (data, historypusher) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.EDIT_PATIENTDEFINE_INIT })
    await instanse.post(ROUTES.PATIENTDEFINE + "/Update", data)
        .then(response => {
            dispatch({ type: ACTION_TYPES.EDIT_PATIENTDEFINE_SUCCESS, payload: response.data })
            historypusher.push('/Patientdefines')
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_PATIENTDEFINES_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.EDIT_PATIENTDEFINE_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const DeletePatientdefines = (data) => async (dispatch, getState) => {
    delete data['edit']
    delete data['delete']
    dispatch({ type: ACTION_TYPES.DELETE_PATIENTDEFINE_INIT })
    await instanse.post(ROUTES.PATIENTDEFINE + "/Delete", data)
        .then(response => {
            dispatch({ type: ACTION_TYPES.DELETE_PATIENTDEFINE_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_PATIENTDEFINES_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.DELETE_PATIENTDEFINE_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const RemoveSelectedPatientdefine = payload => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.REMOVE_SELECTED_PATIENTDEFINE, payload })
    }
}

export const fillPatientdefinenotification = payload => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.FILL_PATIENTDEFINES_NOTIFICATION, payload })
    }
}

export const removePatientdefinenotification = () => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.REMOVE_PATIENTDEFINES_NOTIFICATION })
    }
}
