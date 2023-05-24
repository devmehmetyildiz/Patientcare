import { ROUTES } from "../../Utils/Constants";
import AxiosErrorHelper from "../../Utils/AxiosErrorHelper";
import instanse from "./axios"

export const ACTION_TYPES = {
    GET_PATIENTS_INIT: 'GET_PATIENTS_INIT',
    GET_PATIENTS_SUCCESS: 'GET_PATIENTS_SUCCESS',
    GET_PATIENTS_ERROR: 'GET_PATIENTS_ERROR',

    GET_PATIENT_INIT: 'GET_PATIENT_INIT',
    GET_PATIENT_SUCCESS: 'GET_PATIENT_SUCCESS',
    GET_PATIENT_ERROR: 'GET_PATIENT_ERROR',

    ADD_PATIENT_INIT: 'ADD_PATIENT_INIT',
    ADD_PATIENT_SUCCESS: 'ADD_PATIENT_SUCCESS',
    ADD_PATIENT_ERROR: 'ADD_PATIENT_ERROR',

    EDIT_PATIENT_INIT: 'EDIT_PATIENT_INIT',
    EDIT_PATIENT_SUCCESS: 'EDIT_PATIENT_SUCCESS',
    EDIT_PATIENT_ERROR: 'EDIT_PATIENT_ERROR',

    EDIT_PATIENTTODOGROUPDEFINE_INIT: 'EDIT_PATIENTTODOGROUPDEFINE_INIT',
    EDIT_PATIENTTODOGROUPDEFINE_SUCCESS: 'EDIT_PATIENTTODOGROUPDEFINE_SUCCESS',
    EDIT_PATIENTTODOGROUPDEFINE_ERROR: 'EDIT_PATIENTTODOGROUPDEFINE_ERROR',

    EDIT_PATIENTCHECKPERIOD_INIT: 'EDIT_PATIENTCHECKPERIOD_INIT',
    EDIT_PATIENTCHECKPERIOD_SUCCESS: 'EDIT_PATIENTCHECKPERIOD_SUCCESS',
    EDIT_PATIENTCHECKPERIOD_ERROR: 'EDIT_PATIENTCHECKPERIOD_ERROR',

    DELETE_PATIENT_INIT: 'DELETE_PATIENT_INIT',
    DELETE_PATIENT_SUCCESS: 'DELETE_PATIENT_SUCCESS',
    DELETE_PATIENT_ERROR: 'DELETE_PATIENT_ERROR',


    SET_SELECTED_PATIENT: 'SET_SELECTED_PATIENT',
    REMOVE_SELECTED_PATIENT: 'REMOVE_SELECTED_PATIENT',

    FILL_PATIENTS_NOTIFICATION: 'FILL_PATIENTS_NOTIFICATION',
    REMOVE_PATIENTS_NOTIFICATION: 'REMOVE_PATIENTS_NOTIFICATION',
}

export const GetPatients = () => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.GET_PATIENTS_INIT })
    await instanse.get(ROUTES.PATIENT + "/GetAll")
        .then(response => {
            dispatch({ type: ACTION_TYPES.GET_PATIENTS_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_PATIENTS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.GET_PATIENTS_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const Getpreregistrations = () => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.GET_PATIENTS_INIT })
    await instanse.get(ROUTES.PATIENT + "/GetActivationlist")
        .then(response => {
            dispatch({ type: ACTION_TYPES.GET_PATIENTS_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_PATIENTS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.GET_PATIENTS_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const GetPatient = (guid) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.GET_PATIENT_INIT })
    await instanse.get(ROUTES.PATIENT + `/Getselected?guid=${guid}`)
        .then(response => {
            dispatch({ type: ACTION_TYPES.GET_PATIENT_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_PATIENTS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.GET_PATIENT_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const AddPatients = (data, historypusher, url) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.ADD_PATIENT_INIT })
    await instanse.post(ROUTES.PATIENT + "/Add", data)
        .then(response => {
            dispatch({ type: ACTION_TYPES.ADD_PATIENT_SUCCESS, payload: response.data })
            historypusher.push(url ? url : '/Patients')
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_PATIENTS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.ADD_PATIENT_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const EditPatients = (data, historypusher, url) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.EDIT_PATIENT_INIT })
    await instanse.post(ROUTES.PATIENT + "/Update", data)
        .then(response => {
            dispatch({ type: ACTION_TYPES.EDIT_PATIENT_SUCCESS, payload: response.data })
            historypusher.push(url ? url : '/Patients')
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_PATIENTS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.EDIT_PATIENT_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const EditPatientcheckperiods = (data) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.EDIT_PATIENTCHECKPERIOD_INIT })
    await instanse.post(ROUTES.PATIENT + "/Updatecheckperiod", data)
        .then(response => {
            dispatch({ type: ACTION_TYPES.EDIT_PATIENTCHECKPERIOD_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_PATIENTS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.EDIT_PATIENTCHECKPERIOD_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const EditPatienttodogroupdefines = (data) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.EDIT_PATIENTTODOGROUPDEFINE_INIT })
    await instanse.post(ROUTES.PATIENT + "/Updatetodogroupdefine", data)
        .then(response => {
            dispatch({ type: ACTION_TYPES.EDIT_PATIENTTODOGROUPDEFINE_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_PATIENTS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.EDIT_PATIENTTODOGROUPDEFINE_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const CompletePrepatients = (data, historypusher, url) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.EDIT_PATIENT_INIT })
    await instanse.post(ROUTES.PATIENT + "/Completeprepatient", data)
        .then(response => {
            console.log('response: ', response);
            dispatch({ type: ACTION_TYPES.EDIT_PATIENT_SUCCESS, payload: response.data })
            historypusher.push(url ? url : '/Patients')
        })
        .catch(error => {
            console.log('error: ', error);
            dispatch({ type: ACTION_TYPES.FILL_PATIENTS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.EDIT_PATIENT_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const EditPatientstocks = (data, historypusher, url) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.EDIT_PATIENT_INIT })
    await instanse.post(ROUTES.PATIENT + "/Preparestocks", data)
        .then(response => {
            dispatch({ type: ACTION_TYPES.EDIT_PATIENT_SUCCESS, payload: response.data })
            historypusher.push(url ? url : '/Patients')
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_PATIENTS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.EDIT_PATIENT_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const DeletePatients = (data) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.DELETE_PATIENT_INIT })
    await instanse.post(ROUTES.PATIENT + "/Delete", data)
        .then(response => {
            dispatch({ type: ACTION_TYPES.DELETE_PATIENT_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_PATIENTS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.DELETE_PATIENT_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const RemoveSelectedPatient = payload => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.REMOVE_SELECTED_PATIENT, payload })
    }
}

export const fillPatientnotification = payload => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.FILL_PATIENTS_NOTIFICATION, payload })
    }
}

export const removePatientnotification = () => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.REMOVE_PATIENTS_NOTIFICATION })
    }
}

export const setPatient = (data) => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.SET_SELECTED_PATIENT, payload: data })
    }
}