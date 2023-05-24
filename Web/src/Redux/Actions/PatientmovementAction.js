import { ROUTES } from "../../Utils/Constants";
import AxiosErrorHelper from "../../Utils/AxiosErrorHelper";
import instanse from "./axios"

export const ACTION_TYPES = {
    GET_PATIENTMOVEMENTS_INIT: 'GET_PATIENTMOVEMENTS_INIT',
    GET_PATIENTMOVEMENTS_SUCCESS: 'GET_PATIENTMOVEMENTS_SUCCESS',
    GET_PATIENTMOVEMENTS_ERROR: 'GET_PATIENTMOVEMENTS_ERROR',

    GET_PATIENTMOVEMENT_INIT: 'GET_PATIENTMOVEMENT_INIT',
    GET_PATIENTMOVEMENT_SUCCESS: 'GET_PATIENTMOVEMENT_SUCCESS',
    GET_PATIENTMOVEMENT_ERROR: 'GET_PATIENTMOVEMENT_ERROR',

    ADD_PATIENTMOVEMENT_INIT: 'ADD_PATIENTMOVEMENT_INIT',
    ADD_PATIENTMOVEMENT_SUCCESS: 'ADD_PATIENTMOVEMENT_SUCCESS',
    ADD_PATIENTMOVEMENT_ERROR: 'ADD_PATIENTMOVEMENT_ERROR',

    EDIT_PATIENTMOVEMENT_INIT: 'EDIT_PATIENTMOVEMENT_INIT',
    EDIT_PATIENTMOVEMENT_SUCCESS: 'EDIT_PATIENTMOVEMENT_SUCCESS',
    EDIT_PATIENTMOVEMENT_ERROR: 'EDIT_PATIENTMOVEMENT_ERROR',

    DELETE_PATIENTMOVEMENT_INIT: 'DELETE_PATIENTMOVEMENT_INIT',
    DELETE_PATIENTMOVEMENT_SUCCESS: 'DELETE_PATIENTMOVEMENT_SUCCESS',
    DELETE_PATIENTMOVEMENT_ERROR: 'DELETE_PATIENTMOVEMENT_ERROR',

    REMOVE_SELECTED_PATIENTMOVEMENT: 'REMOVE_SELECTED_PATIENTMOVEMENT',

    FILL_PATIENTMOVEMENTS_NOTIFICATION: 'FILL_PATIENTMOVEMENTS_NOTIFICATION',
    REMOVE_PATIENTMOVEMENTS_NOTIFICATION: 'REMOVE_PATIENTMOVEMENTS_NOTIFICATION',
}

export const GetPatientmovements = () => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.GET_PATIENTMOVEMENTS_INIT })
    await instanse.get(ROUTES.PATIENTMOVEMENT + "/GetAll")
        .then(response => {
            dispatch({ type: ACTION_TYPES.GET_PATIENTMOVEMENTS_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_PATIENTMOVEMENTS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.GET_PATIENTMOVEMENTS_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const GetPatientmovement = (guid) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.GET_PATIENTMOVEMENT_INIT })
    await instanse.get(ROUTES.PATIENTMOVEMENT + `/Getselected?guid=${guid}`)
        .then(response => {
            dispatch({ type: ACTION_TYPES.GET_PATIENTMOVEMENT_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_PATIENTMOVEMENTS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.GET_PATIENTMOVEMENT_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const AddPatientmovements = (data, historypusher) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.ADD_PATIENTMOVEMENT_INIT })
    await instanse.post(ROUTES.PATIENTMOVEMENT + "/Add", data)
        .then(response => {
            dispatch({ type: ACTION_TYPES.ADD_PATIENTMOVEMENT_SUCCESS, payload: response.data })
            historypusher.push('/Patientmovements')
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_PATIENTMOVEMENTS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.ADD_PATIENTMOVEMENT_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const EditPatientmovements = (data, historypusher) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.EDIT_PATIENTMOVEMENT_INIT })
    await instanse.post(ROUTES.PATIENTMOVEMENT + "/Update", data)
        .then(response => {
            dispatch({ type: ACTION_TYPES.EDIT_PATIENTMOVEMENT_SUCCESS, payload: response.data })
            historypusher.push('/Patientmovements')
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_PATIENTMOVEMENTS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.EDIT_PATIENTMOVEMENT_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const DeletePatientmovements = (data) => async (dispatch, getState) => {
    delete data['edit']
    delete data['delete']
    dispatch({ type: ACTION_TYPES.DELETE_PATIENTMOVEMENT_INIT })
    await instanse.post(ROUTES.PATIENTMOVEMENT + "/Delete", data)
        .then(response => {
            dispatch({ type: ACTION_TYPES.DELETE_PATIENTMOVEMENT_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_PATIENTMOVEMENTS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.DELETE_PATIENTMOVEMENT_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const RemoveSelectedPatientmovement = payload => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.REMOVE_SELECTED_PATIENTMOVEMENT, payload })
    }
}

export const fillPatientmovementnotification = payload => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.FILL_PATIENTMOVEMENTS_NOTIFICATION, payload })
    }
}

export const removePatientmovementnotification = () => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.REMOVE_PATIENTMOVEMENTS_NOTIFICATION })
    }
}
