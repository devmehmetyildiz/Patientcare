import { ROUTES } from "../../Utils/Constants";
import AxiosErrorHelper from "../../Utils/AxiosErrorHelper";
import instanse from "./axios"
import config from "../../Config";

export const ACTION_TYPES = {
    GET_STOCKMOVEMENTS_INIT: 'GET_STOCKMOVEMENTS_INIT',
    GET_STOCKMOVEMENTS_SUCCESS: 'GET_STOCKMOVEMENTS_SUCCESS',
    GET_STOCKMOVEMENTS_ERROR: 'GET_STOCKMOVEMENTS_ERROR',

    GET_ALLSTOCKMOVEMENTS_INIT: 'GET_ALLSTOCKMOVEMENTS_INIT',
    GET_ALLSTOCKMOVEMENTS_SUCCESS: 'GET_ALLSTOCKMOVEMENTS_SUCCESS',
    GET_ALLSTOCKMOVEMENTS_ERROR: 'GET_ALLSTOCKMOVEMENTS_ERROR',

    GET_STOCKMOVEMENT_INIT: 'GET_STOCKMOVEMENT_INIT',
    GET_STOCKMOVEMENT_SUCCESS: 'GET_STOCKMOVEMENT_SUCCESS',
    GET_STOCKMOVEMENT_ERROR: 'GET_STOCKMOVEMENT_ERROR',

    ADD_STOCKMOVEMENT_INIT: 'ADD_STOCKMOVEMENT_INIT',
    ADD_STOCKMOVEMENT_SUCCESS: 'ADD_STOCKMOVEMENT_SUCCESS',
    ADD_STOCKMOVEMENT_ERROR: 'ADD_STOCKMOVEMENT_ERROR',

    EDIT_STOCKMOVEMENT_INIT: 'EDIT_STOCKMOVEMENT_INIT',
    EDIT_STOCKMOVEMENT_SUCCESS: 'EDIT_STOCKMOVEMENT_SUCCESS',
    EDIT_STOCKMOVEMENT_ERROR: 'EDIT_STOCKMOVEMENT_ERROR',

    DELETE_STOCKMOVEMENT_INIT: 'DELETE_STOCKMOVEMENT_INIT',
    DELETE_STOCKMOVEMENT_SUCCESS: 'DELETE_STOCKMOVEMENT_SUCCESS',
    DELETE_STOCKMOVEMENT_ERROR: 'DELETE_STOCKMOVEMENT_ERROR',

    REMOVE_SELECTED_STOCKMOVEMENT: 'REMOVE_SELECTED_STOCKMOVEMENT',

    FILL_STOCKMOVEMENTS_NOTIFICATION: 'FILL_STOCKMOVEMENTS_NOTIFICATION',
    REMOVE_STOCKMOVEMENTS_NOTIFICATION: 'REMOVE_STOCKMOVEMENTS_NOTIFICATION',
}

export const GetStockmovements = () => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.GET_STOCKMOVEMENTS_INIT })
    await instanse.get(config.services.Warehouse, ROUTES.STOCKMOVEMENT)
        .then(response => {
            dispatch({ type: ACTION_TYPES.GET_STOCKMOVEMENTS_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_STOCKMOVEMENTS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.GET_STOCKMOVEMENTS_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const GetStockmovement = (guid) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.GET_STOCKMOVEMENT_INIT })
    await instanse.get(config.services.Warehouse, `${ROUTES.STOCKMOVEMENT}/${guid}`)
        .then(response => {
            dispatch({ type: ACTION_TYPES.GET_STOCKMOVEMENT_SUCCESS, payload: response.data }) 
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_STOCKMOVEMENTS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.GET_STOCKMOVEMENT_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const AddStockmovements = (data, historypusher) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.ADD_STOCKMOVEMENT_INIT })
    await instanse.post(config.services.Warehouse, ROUTES.STOCKMOVEMENT, data)
        .then(response => {
                dispatch({ type: ACTION_TYPES.ADD_STOCKMOVEMENT_SUCCESS, payload: response.data })
                historypusher('/Stockmovements')
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_STOCKMOVEMENTS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.ADD_STOCKMOVEMENT_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const EditStockmovements = (data, historypusher) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.EDIT_STOCKMOVEMENT_INIT })
    await instanse.put(config.services.Warehouse, ROUTES.STOCKMOVEMENT, data)
        .then(response => {
                dispatch({ type: ACTION_TYPES.EDIT_STOCKMOVEMENT_SUCCESS, payload: response.data })
                historypusher.push('/Stockmovements')
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_STOCKMOVEMENTS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.EDIT_STOCKMOVEMENT_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const DeleteStockmovements = (data) => async (dispatch, getState) => {
    delete data['edit']
    delete data['delete']
    dispatch({ type: ACTION_TYPES.DELETE_STOCKMOVEMENT_INIT })
    await instanse.delete(config.services.Warehouse, ROUTES.STOCKMOVEMENT, data)
        .then(response => {
                dispatch({ type: ACTION_TYPES.DELETE_STOCKMOVEMENT_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_STOCKMOVEMENTS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.DELETE_STOCKMOVEMENT_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const RemoveSelectedStockmovement = payload => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.REMOVE_SELECTED_STOCKMOVEMENT, payload })
    }
}

export const fillStockmovementnotification = payload => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.FILL_STOCKMOVEMENTS_NOTIFICATION, payload })
    }
}

export const removeStockmovementnotification = () => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.REMOVE_STOCKMOVEMENTS_NOTIFICATION })
    }
}
