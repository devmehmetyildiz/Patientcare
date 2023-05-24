import { ROUTES } from "../../Utils/Constants";
import AxiosErrorHelper from "../../Utils/AxiosErrorHelper";
import instanse from "./axios"

export const ACTION_TYPES = {
    GET_STOCKDEFINES_INIT: 'GET_STOCKDEFINES_INIT',
    GET_STOCKDEFINES_SUCCESS: 'GET_STOCKDEFINES_SUCCESS',
    GET_STOCKDEFINES_ERROR: 'GET_STOCKDEFINES_ERROR',

    GET_ALLSTOCKDEFINES_INIT: 'GET_ALLSTOCKDEFINES_INIT',
    GET_ALLSTOCKDEFINES_SUCCESS: 'GET_ALLSTOCKDEFINES_SUCCESS',
    GET_ALLSTOCKDEFINES_ERROR: 'GET_ALLSTOCKDEFINES_ERROR',

    GET_STOCKDEFINE_INIT: 'GET_STOCKDEFINE_INIT',
    GET_STOCKDEFINE_SUCCESS: 'GET_STOCKDEFINE_SUCCESS',
    GET_STOCKDEFINE_ERROR: 'GET_STOCKDEFINE_ERROR',

    ADD_STOCKDEFINE_INIT: 'ADD_STOCKDEFINE_INIT',
    ADD_STOCKDEFINE_SUCCESS: 'ADD_STOCKDEFINE_SUCCESS',
    ADD_STOCKDEFINE_ERROR: 'ADD_STOCKDEFINE_ERROR',

    EDIT_STOCKDEFINE_INIT: 'EDIT_STOCKDEFINE_INIT',
    EDIT_STOCKDEFINE_SUCCESS: 'EDIT_STOCKDEFINE_SUCCESS',
    EDIT_STOCKDEFINE_ERROR: 'EDIT_STOCKDEFINE_ERROR',

    DELETE_STOCKDEFINE_INIT: 'DELETE_STOCKDEFINE_INIT',
    DELETE_STOCKDEFINE_SUCCESS: 'DELETE_STOCKDEFINE_SUCCESS',
    DELETE_STOCKDEFINE_ERROR: 'DELETE_STOCKDEFINE_ERROR',

    REMOVE_SELECTED_STOCKDEFINE: 'REMOVE_SELECTED_STOCKDEFINE',

    FILL_STOCKDEFINES_NOTIFICATION: 'FILL_STOCKDEFINES_NOTIFICATION',
    REMOVE_STOCKDEFINES_NOTIFICATION: 'REMOVE_STOCKDEFINES_NOTIFICATION',
}

export const GetStockdefines = () => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.GET_STOCKDEFINES_INIT })
    await instanse.get(ROUTES.STOCKDEFINE + "/GetAll")
        .then(response => {
            dispatch({ type: ACTION_TYPES.GET_STOCKDEFINES_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_STOCKDEFINES_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.GET_STOCKDEFINES_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const GetStockdefine = (guid) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.GET_STOCKDEFINE_INIT })
    await instanse.get(ROUTES.STOCKDEFINE + `/Getselected?guid=${guid}`)
        .then(response => {
            dispatch({ type: ACTION_TYPES.GET_STOCKDEFINE_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_STOCKDEFINES_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.GET_STOCKDEFINE_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const AddStockdefines = (data, historypusher) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.ADD_STOCKDEFINE_INIT })
    await instanse.post(ROUTES.STOCKDEFINE + "/Add", data)
        .then(response => {
                dispatch({ type: ACTION_TYPES.ADD_STOCKDEFINE_SUCCESS, payload: response.data })
                historypusher && historypusher.push('/Stockdefines')
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_STOCKDEFINES_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.ADD_STOCKDEFINE_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const EditStockdefines = (data, historypusher) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.EDIT_STOCKDEFINE_INIT })
    await instanse.post(ROUTES.STOCKDEFINE + "/Update", data)
        .then(response => {
                dispatch({ type: ACTION_TYPES.EDIT_STOCKDEFINE_SUCCESS, payload: response.data })
                historypusher.push('/Stockdefines')
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_STOCKDEFINES_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.EDIT_STOCKDEFINE_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const DeleteStockdefines = (data) => async (dispatch, getState) => {
    delete data['edit']
    delete data['delete']
    dispatch({ type: ACTION_TYPES.DELETE_STOCKDEFINE_INIT })
    await instanse.post(ROUTES.STOCKDEFINE + "/Delete", data)
        .then(response => {
                dispatch({ type: ACTION_TYPES.DELETE_STOCKDEFINE_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_STOCKDEFINES_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.DELETE_STOCKDEFINE_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const RemoveSelectedStockdefine = payload => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.REMOVE_SELECTED_STOCKDEFINE, payload })
    }
}

export const fillStockdefinenotification = payload => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.FILL_STOCKDEFINES_NOTIFICATION, payload })
    }
}

export const removeStockdefinenotification = () => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.REMOVE_STOCKDEFINES_NOTIFICATION })
    }
}
