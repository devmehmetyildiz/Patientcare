import { ROUTES } from "../../Utils/Constants";
import AxiosErrorHelper from "../../Utils/AxiosErrorHelper";
import instanse from "./axios"
import config from "../../Config";

export const ACTION_TYPES = {
    GET_PURCHASEORDERSTOCKS_INIT: 'GET_PURCHASEORDERSTOCKS_INIT',
    GET_PURCHASEORDERSTOCKS_SUCCESS: 'GET_PURCHASEORDERSTOCKS_SUCCESS',
    GET_PURCHASEORDERSTOCKS_ERROR: 'GET_PURCHASEORDERSTOCKS_ERROR',

    GET_ALLPURCHASEORDERSTOCKS_INIT: 'GET_ALLPURCHASEORDERSTOCKS_INIT',
    GET_ALLPURCHASEORDERSTOCKS_SUCCESS: 'GET_ALLPURCHASEORDERSTOCKS_SUCCESS',
    GET_ALLPURCHASEORDERSTOCKS_ERROR: 'GET_ALLPURCHASEORDERSTOCKS_ERROR',

    GET_PURCHASEORDERSTOCK_INIT: 'GET_PURCHASEORDERSTOCK_INIT',
    GET_PURCHASEORDERSTOCK_SUCCESS: 'GET_PURCHASEORDERSTOCK_SUCCESS',
    GET_PURCHASEORDERSTOCK_ERROR: 'GET_PURCHASEORDERSTOCK_ERROR',

    ADD_PURCHASEORDERSTOCK_INIT: 'ADD_PURCHASEORDERSTOCK_INIT',
    ADD_PURCHASEORDERSTOCK_SUCCESS: 'ADD_PURCHASEORDERSTOCK_SUCCESS',
    ADD_PURCHASEORDERSTOCK_ERROR: 'ADD_PURCHASEORDERSTOCK_ERROR',

    EDIT_PURCHASEORDERSTOCK_INIT: 'EDIT_PURCHASEORDERSTOCK_INIT',
    EDIT_PURCHASEORDERSTOCK_SUCCESS: 'EDIT_PURCHASEORDERSTOCK_SUCCESS',
    EDIT_PURCHASEORDERSTOCK_ERROR: 'EDIT_PURCHASEORDERSTOCK_ERROR',

    DELETE_PURCHASEORDERSTOCK_INIT: 'DELETE_PURCHASEORDERSTOCK_INIT',
    DELETE_PURCHASEORDERSTOCK_SUCCESS: 'DELETE_PURCHASEORDERSTOCK_SUCCESS',
    DELETE_PURCHASEORDERSTOCK_ERROR: 'DELETE_PURCHASEORDERSTOCK_ERROR',

    REMOVE_SELECTED_PURCHASEORDERSTOCK: 'REMOVE_SELECTED_PURCHASEORDERSTOCK',

    FILL_PURCHASEORDERSTOCKS_NOTIFICATION: 'FILL_PURCHASEORDERSTOCKS_NOTIFICATION',
    REMOVE_PURCHASEORDERSTOCKS_NOTIFICATION: 'REMOVE_PURCHASEORDERSTOCKS_NOTIFICATION',
}

export const GetPurchaseorderstocks = () => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.GET_PURCHASEORDERSTOCKS_INIT })
    await instanse.get(config.services.Warehouse, ROUTES.PURCHASEORDERSTOCK)
        .then(response => {
            dispatch({ type: ACTION_TYPES.GET_PURCHASEORDERSTOCKS_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_PURCHASEORDERSTOCKS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.GET_PURCHASEORDERSTOCKS_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const GetPurchaseorderstock = (guid) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.GET_PURCHASEORDERSTOCK_INIT })
    await instanse.get(config.services.Warehouse, `${ROUTES.PURCHASEORDERSTOCK}/${guid}`)
        .then(response => {
            dispatch({ type: ACTION_TYPES.GET_PURCHASEORDERSTOCK_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_PURCHASEORDERSTOCKS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.GET_PURCHASEORDERSTOCK_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const AddPurchaseorderstocks = (data, historypusher) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.ADD_PURCHASEORDERSTOCK_INIT })
    await instanse.post(config.services.Warehouse, ROUTES.PURCHASEORDERSTOCK, data)
        .then(response => {
                dispatch({ type: ACTION_TYPES.ADD_PURCHASEORDERSTOCK_SUCCESS, payload: response.data })
                historypusher.push('/Purchaseorderstocks')
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_PURCHASEORDERSTOCKS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.ADD_PURCHASEORDERSTOCK_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const EditPurchaseorderstocks = (data, historypusher) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.EDIT_PURCHASEORDERSTOCK_INIT })
    await instanse.put(config.services.Warehouse, ROUTES.PURCHASEORDERSTOCK, data)
        .then(response => {
                dispatch({ type: ACTION_TYPES.EDIT_PURCHASEORDERSTOCK_SUCCESS, payload: response.data })
                historypusher.push('/Purchaseorderstocks')
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_PURCHASEORDERSTOCKS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.EDIT_PURCHASEORDERSTOCK_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const DeletePurchaseorderstocks = (data) => async (dispatch, getState) => {
    delete data['edit']
    delete data['delete']
    dispatch({ type: ACTION_TYPES.DELETE_PURCHASEORDERSTOCK_INIT })
    await instanse.delete(config.services.Warehouse, ROUTES.PURCHASEORDERSTOCK, data)
        .then(response => {
                dispatch({ type: ACTION_TYPES.DELETE_PURCHASEORDERSTOCK_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_PURCHASEORDERSTOCKS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.DELETE_PURCHASEORDERSTOCK_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const RemoveSelectedPurchaseorderstock = payload => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.REMOVE_SELECTED_PURCHASEORDERSTOCK, payload })
    }
}

export const fillPurchaseorderstocknotification = payload => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.FILL_PURCHASEORDERSTOCKS_NOTIFICATION, payload })
    }
}

export const removePurchaseorderstocknotification = () => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.REMOVE_PURCHASEORDERSTOCKS_NOTIFICATION })
    }
}
