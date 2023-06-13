import { ROUTES } from "../../Utils/Constants";
import AxiosErrorHelper from "../../Utils/AxiosErrorHelper";
import instanse from "./axios"
import config from "../../Config";

export const ACTION_TYPES = {
    GET_PRINTTEMPLATES_INIT: 'GET_PRINTTEMPLATES_INIT',
    GET_PRINTTEMPLATES_SUCCESS: 'GET_PRINTTEMPLATES_SUCCESS',
    GET_PRINTTEMPLATES_ERROR: 'GET_PRINTTEMPLATES_ERROR',

    GET_PRINTTEMPLATE_INIT: 'GET_PRINTTEMPLATE_INIT',
    GET_PRINTTEMPLATE_SUCCESS: 'GET_PRINTTEMPLATE_SUCCESS',
    GET_PRINTTEMPLATE_ERROR: 'GET_PRINTTEMPLATE_ERROR',

    ADD_PRINTTEMPLATE_INIT: 'ADD_PRINTTEMPLATE_INIT',
    ADD_PRINTTEMPLATE_SUCCESS: 'ADD_PRINTTEMPLATE_SUCCESS',
    ADD_PRINTTEMPLATE_ERROR: 'ADD_PRINTTEMPLATE_ERROR',

    EDIT_PRINTTEMPLATE_INIT: 'EDIT_PRINTTEMPLATE_INIT',
    EDIT_PRINTTEMPLATE_SUCCESS: 'EDIT_PRINTTEMPLATE_SUCCESS',
    EDIT_PRINTTEMPLATE_ERROR: 'EDIT_PRINTTEMPLATE_ERROR',

    DELETE_PRINTTEMPLATE_INIT: 'DELETE_PRINTTEMPLATE_INIT',
    DELETE_PRINTTEMPLATE_SUCCESS: 'DELETE_PRINTTEMPLATE_SUCCESS',
    DELETE_PRINTTEMPLATE_ERROR: 'DELETE_PRINTTEMPLATE_ERROR',

    REMOVE_SELECTED_PRINTTEMPLATE: 'REMOVE_SELECTED_PRINTTEMPLATE',

    FILL_PRINTTEMPLATES_NOTIFICATION: 'FILL_PRINTTEMPLATES_NOTIFICATION',
    REMOVE_PRINTTEMPLATES_NOTIFICATION: 'REMOVE_PRINTTEMPLATES_NOTIFICATION',
}

export const GetPrinttemplates = () => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.GET_PRINTTEMPLATES_INIT })
    await instanse.get(config.services.System, ROUTES.PRINTTEMPLATE)
        .then(response => {
            dispatch({ type: ACTION_TYPES.GET_PRINTTEMPLATES_SUCCESS, payload: response.data }) 
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_PRINTTEMPLATES_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.GET_PRINTTEMPLATES_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const GetPrinttemplate = (guid) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.GET_PRINTTEMPLATE_INIT })
    await instanse.get(config.services.System, `${ROUTES.PRINTTEMPLATE}/${guid}`)
        .then(response => {
            dispatch({ type: ACTION_TYPES.GET_PRINTTEMPLATE_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_PRINTTEMPLATES_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.GET_PRINTTEMPLATE_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const AddPrinttemplates = (data, historypusher) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.ADD_PRINTTEMPLATE_INIT })
    await instanse.post(config.services.System, ROUTES.PRINTTEMPLATE, data)
        .then(response => {
                dispatch({ type: ACTION_TYPES.ADD_PRINTTEMPLATE_SUCCESS, payload: response.data })
                historypusher.push('/Printtemplates')
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_PRINTTEMPLATES_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.ADD_PRINTTEMPLATE_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const EditPrinttemplates = (data, historypusher) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.EDIT_PRINTTEMPLATE_INIT })
    await instanse.put(config.services.System, ROUTES.PRINTTEMPLATE, data)
        .then(response => {
                dispatch({ type: ACTION_TYPES.EDIT_PRINTTEMPLATE_SUCCESS, payload: response.data })
                historypusher.push('/Printtemplates')
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_PRINTTEMPLATES_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.EDIT_PRINTTEMPLATE_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const DeletePrinttemplates = (data) => async (dispatch, getState) => {
    delete data['edit']
    delete data['delete']
    dispatch({ type: ACTION_TYPES.DELETE_PRINTTEMPLATE_INIT })
    await instanse.delete(config.services.System, `${ROUTES.PRINTTEMPLATE}/${data.Uuid}`)
        .then(response => {
                dispatch({ type: ACTION_TYPES.DELETE_PRINTTEMPLATE_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_PRINTTEMPLATES_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.DELETE_PRINTTEMPLATE_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const RemoveSelectedPrinttemplate = payload => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.REMOVE_SELECTED_PRINTTEMPLATE, payload })
    }
}

export const fillPrinttemplatenotification = payload => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.FILL_PRINTTEMPLATES_NOTIFICATION, payload })
    }
}

export const removePrinttemplatenotification = () => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.REMOVE_PRINTTEMPLATES_NOTIFICATION })
    }
}
