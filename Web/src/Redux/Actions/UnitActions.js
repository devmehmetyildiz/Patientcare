import { ROUTES } from "../../Utils/Constants";
import AxiosErrorHelper from "../../Utils/AxiosErrorHelper";
import instanse from "./axios"
import config from "../../Config";

export const ACTION_TYPES = {
    GET_UNITS_INIT: 'GET_UNITS_INIT',
    GET_UNITS_SUCCESS: 'GET_UNITS_SUCCESS',
    GET_UNITS_ERROR: 'GET_UNITS_ERROR',

    GET_ALLUNITS_INIT: 'GET_ALLUNITS_INIT',
    GET_ALLUNITS_SUCCESS: 'GET_ALLUNITS_SUCCESS',
    GET_ALLUNITS_ERROR: 'GET_ALLUNITS_ERROR',

    GET_UNIT_INIT: 'GET_UNIT_INIT',
    GET_UNIT_SUCCESS: 'GET_UNIT_SUCCESS',
    GET_UNIT_ERROR: 'GET_UNIT_ERROR',

    ADD_UNIT_INIT: 'ADD_UNIT_INIT',
    ADD_UNIT_SUCCESS: 'ADD_UNIT_SUCCESS',
    ADD_UNIT_ERROR: 'ADD_UNIT_ERROR',

    EDIT_UNIT_INIT: 'EDIT_UNIT_INIT',
    EDIT_UNIT_SUCCESS: 'EDIT_UNIT_SUCCESS',
    EDIT_UNIT_ERROR: 'EDIT_UNIT_ERROR',

    DELETE_UNIT_INIT: 'DELETE_UNIT_INIT',
    DELETE_UNIT_SUCCESS: 'DELETE_UNIT_SUCCESS',
    DELETE_UNIT_ERROR: 'DELETE_UNIT_ERROR',

    REMOVE_SELECTED_UNIT: 'REMOVE_SELECTED_UNIT',

    FILL_UNITS_NOTIFICATION: 'FILL_UNITS_NOTIFICATION',
    REMOVE_UNITS_NOTIFICATION: 'REMOVE_UNITS_NOTIFICATION',
}

export const GetUnits = () => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.GET_UNITS_INIT })
    await instanse.get(config.services.Setting, ROUTES.UNIT)
        .then(response => {
            dispatch({ type: ACTION_TYPES.GET_UNITS_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_UNITS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.GET_UNITS_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const GetUnit = (guid) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.GET_UNIT_INIT })
    await instanse.get(config.services.Setting, `${ROUTES.UNIT}/${guid}`)
        .then(response => {
            dispatch({ type: ACTION_TYPES.GET_UNIT_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_UNITS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.GET_UNIT_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const AddUnits = (data, historypusher) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.ADD_UNIT_INIT })
    await instanse.post(config.services.Setting, ROUTES.UNIT, data)
        .then(response => {
                dispatch({ type: ACTION_TYPES.ADD_UNIT_SUCCESS, payload: response.data })
                historypusher.push('/Units')
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_UNITS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.ADD_UNIT_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const EditUnits = (data, historypusher) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.EDIT_UNIT_INIT })
    await instanse.put(config.services.Setting, ROUTES.UNIT, data)
        .then(response => {
                dispatch({ type: ACTION_TYPES.EDIT_UNIT_SUCCESS, payload: response.data })
                historypusher.push('/Units')
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_UNITS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.EDIT_UNIT_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const DeleteUnits = (data) => async (dispatch, getState) => {
    delete data['edit']
    delete data['delete']
    dispatch({ type: ACTION_TYPES.DELETE_UNIT_INIT })
    await instanse.delete(config.services.Setting, ROUTES.UNIT, data)
        .then(response => {
                dispatch({ type: ACTION_TYPES.DELETE_UNIT_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_UNITS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.DELETE_UNIT_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const RemoveSelectedUnit = payload => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.REMOVE_SELECTED_UNIT, payload })
    }
}

export const fillUnitnotification = payload => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.FILL_UNITS_NOTIFICATION, payload })
    }
}

export const removeUnitnotification = () => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.REMOVE_UNITS_NOTIFICATION })
    }
}
