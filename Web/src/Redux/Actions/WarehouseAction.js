import { ROUTES } from "../../Utils/Constants";
import AxiosErrorHelper from "../../Utils/AxiosErrorHelper";
import instanse from "./axios"
import config from "../../Config";

export const ACTION_TYPES = {
    GET_WAREHOUSES_INIT: 'GET_WAREHOUSES_INIT',
    GET_WAREHOUSES_SUCCESS: 'GET_WAREHOUSES_SUCCESS',
    GET_WAREHOUSES_ERROR: 'GET_WAREHOUSES_ERROR',

    GET_ALLWAREHOUSES_INIT: 'GET_ALLWAREHOUSES_INIT',
    GET_ALLWAREHOUSES_SUCCESS: 'GET_ALLWAREHOUSES_SUCCESS',
    GET_ALLWAREHOUSES_ERROR: 'GET_ALLWAREHOUSES_ERROR',

    GET_WAREHOUSE_INIT: 'GET_WAREHOUSE_INIT',
    GET_WAREHOUSE_SUCCESS: 'GET_WAREHOUSE_SUCCESS',
    GET_WAREHOUSE_ERROR: 'GET_WAREHOUSE_ERROR',

    ADD_WAREHOUSE_INIT: 'ADD_WAREHOUSE_INIT',
    ADD_WAREHOUSE_SUCCESS: 'ADD_WAREHOUSE_SUCCESS',
    ADD_WAREHOUSE_ERROR: 'ADD_WAREHOUSE_ERROR',

    EDIT_WAREHOUSE_INIT: 'EDIT_WAREHOUSE_INIT',
    EDIT_WAREHOUSE_SUCCESS: 'EDIT_WAREHOUSE_SUCCESS',
    EDIT_WAREHOUSE_ERROR: 'EDIT_WAREHOUSE_ERROR',

    DELETE_WAREHOUSE_INIT: 'DELETE_WAREHOUSE_INIT',
    DELETE_WAREHOUSE_SUCCESS: 'DELETE_WAREHOUSE_SUCCESS',
    DELETE_WAREHOUSE_ERROR: 'DELETE_WAREHOUSE_ERROR',

    REMOVE_SELECTED_WAREHOUSE: 'REMOVE_SELECTED_WAREHOUSE',

    FILL_WAREHOUSES_NOTIFICATION: 'FILL_WAREHOUSES_NOTIFICATION',
    REMOVE_WAREHOUSES_NOTIFICATION: 'REMOVE_WAREHOUSES_NOTIFICATION',
}

export const GetWarehouses = () => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.GET_WAREHOUSES_INIT })
    await instanse.get(config.services.Warehouse, ROUTES.WAREHOUSE)
        .then(response => {
            dispatch({ type: ACTION_TYPES.GET_WAREHOUSES_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_WAREHOUSES_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.GET_WAREHOUSES_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const GetWarehouse = (guid) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.GET_WAREHOUSE_INIT })
    await instanse.get(config.services.Warehouse, `${ROUTES.WAREHOUSE}/${guid}`)
        .then(response => {
            dispatch({ type: ACTION_TYPES.GET_WAREHOUSE_SUCCESS, payload: response.data }) 
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_WAREHOUSES_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.GET_WAREHOUSE_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const AddWarehouses = (data, historypusher) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.ADD_WAREHOUSE_INIT })
    await instanse.post(config.services.Warehouse, ROUTES.WAREHOUSE, data)
        .then(response => {
                dispatch({ type: ACTION_TYPES.ADD_WAREHOUSE_SUCCESS, payload: response.data })
                historypusher.push('/Warehouses')
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_WAREHOUSES_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.ADD_WAREHOUSE_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const EditWarehouses = (data, historypusher) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.EDIT_WAREHOUSE_INIT })
    await instanse.put(config.services.Warehouse, ROUTES.WAREHOUSE, data)
        .then(response => {
                dispatch({ type: ACTION_TYPES.EDIT_WAREHOUSE_SUCCESS, payload: response.data })
                historypusher.push('/Warehouses')
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_WAREHOUSES_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.EDIT_WAREHOUSE_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const DeleteWarehouses = (data) => async (dispatch, getState) => {
    delete data['edit']
    delete data['delete']
    dispatch({ type: ACTION_TYPES.DELETE_WAREHOUSE_INIT })
    await instanse.delete(config.services.Warehouse, `${ROUTES.WAREHOUSE}/${data.Uuid}`)
        .then(response => {
                dispatch({ type: ACTION_TYPES.DELETE_WAREHOUSE_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_WAREHOUSES_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.DELETE_WAREHOUSE_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const RemoveSelectedWarehouse = payload => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.REMOVE_SELECTED_WAREHOUSE, payload })
    }
}

export const fillWarehousenotification = payload => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.FILL_WAREHOUSES_NOTIFICATION, payload })
    }
}

export const removeWarehousenotification = () => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.REMOVE_WAREHOUSES_NOTIFICATION })
    }
}
