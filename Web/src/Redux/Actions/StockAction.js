import { ROUTES } from "../../Utils/Constants";
import AxiosErrorHelper from "../../Utils/AxiosErrorHelper";
import instanse from "./axios"
import config from "../../Config";

export const ACTION_TYPES = {
    GET_STOCKS_INIT: 'GET_STOCKS_INIT',
    GET_STOCKS_SUCCESS: 'GET_STOCKS_SUCCESS',
    GET_STOCKS_ERROR: 'GET_STOCKS_ERROR',

    GET_ALLSTOCKS_INIT: 'GET_ALLSTOCKS_INIT',
    GET_ALLSTOCKS_SUCCESS: 'GET_ALLSTOCKS_SUCCESS',
    GET_ALLSTOCKS_ERROR: 'GET_ALLSTOCKS_ERROR',

    GET_STOCK_INIT: 'GET_STOCK_INIT',
    GET_STOCK_SUCCESS: 'GET_STOCK_SUCCESS',
    GET_STOCK_ERROR: 'GET_STOCK_ERROR',

    ADD_STOCK_INIT: 'ADD_STOCK_INIT',
    ADD_STOCK_SUCCESS: 'ADD_STOCK_SUCCESS',
    ADD_STOCK_ERROR: 'ADD_STOCK_ERROR',

    EDIT_STOCK_INIT: 'EDIT_STOCK_INIT',
    EDIT_STOCK_SUCCESS: 'EDIT_STOCK_SUCCESS',
    EDIT_STOCK_ERROR: 'EDIT_STOCK_ERROR',

    DELETE_STOCK_INIT: 'DELETE_STOCK_INIT',
    DELETE_STOCK_SUCCESS: 'DELETE_STOCK_SUCCESS',
    DELETE_STOCK_ERROR: 'DELETE_STOCK_ERROR',

    REMOVE_SELECTED_STOCK: 'REMOVE_SELECTED_STOCK',

    FILL_STOCKS_NOTIFICATION: 'FILL_STOCKS_NOTIFICATION',
    REMOVE_STOCKS_NOTIFICATION: 'REMOVE_STOCKS_NOTIFICATION',

    DEACTIVATE_STOCK_INIT: 'DEACTIVATE_STOCK_INIT',
    DEACTIVATE_STOCK_SUCCESS: 'DEACTIVATE_STOCK_SUCCESS',
    DEACTIVATE_STOCK_ERROR: 'DEACTIVATE_STOCK_ERROR',

    MOVE_STOCK_INIT: 'MOVE_STOCK_INIT',
    MOVE_STOCK_SUCCESS: 'MOVE_STOCK_SUCCESS',
    MOVE_STOCK_ERROR: 'MOVE_STOCK_ERROR',

}

export const GetStocks = () => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.GET_STOCKS_INIT })
    await instanse.get(config.services.Warehouse, ROUTES.STOCK)
        .then(response => {
            dispatch({ type: ACTION_TYPES.GET_STOCKS_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_STOCKS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.GET_STOCKS_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const GetStock = (guid) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.GET_STOCK_INIT })
    await instanse.get(config.services.Warehouse, `${ROUTES.STOCK}/${guid}`)
        .then(response => {
            dispatch({ type: ACTION_TYPES.GET_STOCK_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_STOCKS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.GET_STOCK_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const AddStocks = (data, historypusher) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.ADD_STOCK_INIT })
    await instanse.post(config.services.Warehouse, ROUTES.STOCK, data)
        .then(response => {
                dispatch({ type: ACTION_TYPES.ADD_STOCK_SUCCESS, payload: response.data })
                historypusher.push('/Stocks')
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_STOCKS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.ADD_STOCK_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const EditStocks = (data, historypusher) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.EDIT_STOCK_INIT })
    await instanse.post(config.services.Warehouse, ROUTES.STOCK, data)
        .then(response => {
                dispatch({ type: ACTION_TYPES.EDIT_STOCK_SUCCESS, payload: response.data })
                historypusher.push('/Stocks')
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_STOCKS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.EDIT_STOCK_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const DeleteStocks = (data) => async (dispatch, getState) => {
    delete data['edit']
    delete data['delete']
    dispatch({ type: ACTION_TYPES.DELETE_STOCK_INIT })
    await instanse.delete(config.services.Warehouse, `${ROUTES.STOCK}/${data.Uuid}`)
        .then(response => {
                dispatch({ type: ACTION_TYPES.DELETE_STOCK_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_STOCKS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.DELETE_STOCK_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const RemoveSelectedStock = payload => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.REMOVE_SELECTED_STOCK, payload })
    }
}

export const fillStocknotification = payload => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.FILL_STOCKS_NOTIFICATION, payload })
    }
}

export const removeStocknotification = () => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.REMOVE_STOCKS_NOTIFICATION })
    }
}

export const MoveStocks = (data, historypusher) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.MOVE_STOCK_INIT })
    await instanse.post(ROUTES.STOCK + "/Movestock", data)
        .then(response => {
                dispatch({ type: ACTION_TYPES.MOVE_STOCK_SUCCESS, payload: response.data })
                historypusher.pushing('/Stocks')
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_STOCKS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.MOVE_STOCK_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const DeactivateStocks = (data, historypusher) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.DEACTIVATE_STOCK_INIT })
    await instanse.post(ROUTES.STOCK + "/Deactivestocks", data)
        .then(response => {
                dispatch({ type: ACTION_TYPES.DEACTIVATE_STOCK_SUCCESS, payload: response.data })
                historypusher.pushing('/Stocks')
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_STOCKS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.DEACTIVATE_STOCK_ERROR, payload: AxiosErrorHelper(error) })
        })
}

