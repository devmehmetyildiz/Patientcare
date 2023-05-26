import { ROUTES } from "../../Utils/Constants";
import AxiosErrorHelper from "../../Utils/AxiosErrorHelper";
import instanse from "./axios"
import config from "../../Config";

export const ACTION_TYPES = {
    GET_PERIODS_INIT: 'GET_PERIODS_INIT',
    GET_PERIODS_SUCCESS: 'GET_PERIODS_SUCCESS',
    GET_PERIODS_ERROR: 'GET_PERIODS_ERROR',

    GET_PERIOD_INIT: 'GET_PERIOD_INIT',
    GET_PERIOD_SUCCESS: 'GET_PERIOD_SUCCESS',
    GET_PERIOD_ERROR: 'GET_PERIOD_ERROR',

    ADD_PERIOD_INIT: 'ADD_PERIOD_INIT',
    ADD_PERIOD_SUCCESS: 'ADD_PERIOD_SUCCESS',
    ADD_PERIOD_ERROR: 'ADD_PERIOD_ERROR',

    EDIT_PERIOD_INIT: 'EDIT_PERIOD_INIT',
    EDIT_PERIOD_SUCCESS: 'EDIT_PERIOD_SUCCESS',
    EDIT_PERIOD_ERROR: 'EDIT_PERIOD_ERROR',

    DELETE_PERIOD_INIT: 'DELETE_PERIOD_INIT',
    DELETE_PERIOD_SUCCESS: 'DELETE_PERIOD_SUCCESS',
    DELETE_PERIOD_ERROR: 'DELETE_PERIOD_ERROR',

    REMOVE_SELECTED_PERIOD: 'REMOVE_SELECTED_PERIOD',

    FILL_PERIODS_NOTIFICATION: 'FILL_PERIODS_NOTIFICATION',
    REMOVE_PERIODS_NOTIFICATION: 'REMOVE_PERIODS_NOTIFICATION',
}

export const GetPeriods = () => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.GET_PERIODS_INIT })
    await instanse.get(config.services.Setting, ROUTES.PERIOD)
        .then(response => {
            dispatch({ type: ACTION_TYPES.GET_PERIODS_SUCCESS, payload: response.data }) 
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_PERIODS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.GET_PERIODS_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const GetPeriod = (guid) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.GET_PERIOD_INIT })
    await instanse.get(config.services.Setting, `${ROUTES.PERIOD}/${guid}`)
        .then(response => {
            dispatch({ type: ACTION_TYPES.GET_PERIOD_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_PERIODS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.GET_PERIOD_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const AddPeriods = (data, historypusher) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.ADD_PERIOD_INIT })
    await instanse.post(config.services.Setting, ROUTES.PERIOD, data)
        .then(response => {
                dispatch({ type: ACTION_TYPES.ADD_PERIOD_SUCCESS, payload: response.data })
                historypusher.push('/Periods')
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_PERIODS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.ADD_PERIOD_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const EditPeriods = (data, historypusher) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.EDIT_PERIOD_INIT })
    await instanse.put(config.services.Setting, ROUTES.PERIOD, data)
        .then(response => {
                dispatch({ type: ACTION_TYPES.EDIT_PERIOD_SUCCESS, payload: response.data })
                historypusher.push('/Periods')
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_PERIODS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.EDIT_PERIOD_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const DeletePeriods = (data) => async (dispatch, getState) => {
    delete data['edit']
    delete data['delete']
    dispatch({ type: ACTION_TYPES.DELETE_PERIOD_INIT })
    await instanse.delete(config.services.Setting, ROUTES.PERIOD, data)
        .then(response => {
                dispatch({ type: ACTION_TYPES.DELETE_PERIOD_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_PERIODS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.DELETE_PERIOD_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const RemoveSelectedPeriod = payload => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.REMOVE_SELECTED_PERIOD, payload })
    }
}

export const fillPeriodnotification = payload => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.FILL_PERIODS_NOTIFICATION, payload })
    }
}

export const removePeriodnotification = () => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.REMOVE_PERIODS_NOTIFICATION })
    }
}
