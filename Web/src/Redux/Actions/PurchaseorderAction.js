import { ROUTES } from "../../Utils/Constants";
import AxiosErrorHelper from "../../Utils/AxiosErrorHelper";
import instanse from "./axios"
import config from "../../Config";

export const ACTION_TYPES = {
    GET_PURCHASEORDERS_INIT: 'GET_PURCHASEORDERS_INIT',
    GET_PURCHASEORDERS_SUCCESS: 'GET_PURCHASEORDERS_SUCCESS',
    GET_PURCHASEORDERS_ERROR: 'GET_PURCHASEORDERS_ERROR',

    GET_ALLPURCHASEORDERS_INIT: 'GET_ALLPURCHASEORDERS_INIT',
    GET_ALLPURCHASEORDERS_SUCCESS: 'GET_ALLPURCHASEORDERS_SUCCESS',
    GET_ALLPURCHASEORDERS_ERROR: 'GET_ALLPURCHASEORDERS_ERROR',

    GET_PURCHASEORDER_INIT: 'GET_PURCHASEORDER_INIT',
    GET_PURCHASEORDER_SUCCESS: 'GET_PURCHASEORDER_SUCCESS',
    GET_PURCHASEORDER_ERROR: 'GET_PURCHASEORDER_ERROR',

    ADD_PURCHASEORDER_INIT: 'ADD_PURCHASEORDER_INIT',
    ADD_PURCHASEORDER_SUCCESS: 'ADD_PURCHASEORDER_SUCCESS',
    ADD_PURCHASEORDER_ERROR: 'ADD_PURCHASEORDER_ERROR',

    COMPLETE_PURCHASEORDER_INIT: 'COMPLETE_PURCHASEORDER_INIT',
    COMPLETE_PURCHASEORDER_SUCCESS: 'COMPLETE_PURCHASEORDER_SUCCESS',
    COMPLETE_PURCHASEORDER_ERROR: 'COMPLETE_PURCHASEORDER_ERROR',

    EDIT_PURCHASEORDER_INIT: 'EDIT_PURCHASEORDER_INIT',
    EDIT_PURCHASEORDER_SUCCESS: 'EDIT_PURCHASEORDER_SUCCESS',
    EDIT_PURCHASEORDER_ERROR: 'EDIT_PURCHASEORDER_ERROR',

    DELETE_PURCHASEORDER_INIT: 'DELETE_PURCHASEORDER_INIT',
    DELETE_PURCHASEORDER_SUCCESS: 'DELETE_PURCHASEORDER_SUCCESS',
    DELETE_PURCHASEORDER_ERROR: 'DELETE_PURCHASEORDER_ERROR',

    REMOVE_SELECTED_PURCHASEORDER: 'REMOVE_SELECTED_PURCHASEORDER',

    FILL_PURCHASEORDERS_NOTIFICATION: 'FILL_PURCHASEORDERS_NOTIFICATION',
    REMOVE_PURCHASEORDERS_NOTIFICATION: 'REMOVE_PURCHASEORDERS_NOTIFICATION',
}

export const GetPurchaseorders = () => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.GET_PURCHASEORDERS_INIT })
    await instanse.get(config.services.Warehouse, ROUTES.PURCHASEORDER)
        .then(response => {
            dispatch({ type: ACTION_TYPES.GET_PURCHASEORDERS_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_PURCHASEORDERS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.GET_PURCHASEORDERS_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const GetPurchaseorder = (guid) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.GET_PURCHASEORDER_INIT })
    await instanse.get(config.services.Warehouse, `${ROUTES.PURCHASEORDER}/${guid}`)
        .then(response => {
            dispatch({ type: ACTION_TYPES.GET_PURCHASEORDER_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_PURCHASEORDERS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.GET_PURCHASEORDER_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const AddPurchaseorders = (data, historypusher) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.ADD_PURCHASEORDER_INIT , payload: data })
    await instanse.post(config.services.Warehouse, ROUTES.PURCHASEORDER, data)
        .then(response => {
            dispatch({ type: ACTION_TYPES.ADD_PURCHASEORDER_SUCCESS, payload: response.data })
            historypusher.push('/Purchaseorders')
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_PURCHASEORDERS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.ADD_PURCHASEORDER_ERROR, payload: AxiosErrorHelper(error) })
        })
}
export const CompletePurchaseorders = (data) => async (dispatch, getState) => {
    delete data['complete']
    delete data['edit']
    delete data['delete']
    dispatch({ type: ACTION_TYPES.COMPLETE_PURCHASEORDER_INIT })
    await instanse.put(config.services.Warehouse, ROUTES.PURCHASEORDER + `/Complete`, data)
        .then(response => {
            dispatch({ type: ACTION_TYPES.COMPLETE_PURCHASEORDER_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_PURCHASEORDERS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.COMPLETE_PURCHASEORDER_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const EditPurchaseorders = (data, historypusher) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.EDIT_PURCHASEORDER_INIT, payload: data })
    await instanse.put(config.services.Warehouse, ROUTES.PURCHASEORDER, data)
        .then(response => {
            dispatch({ type: ACTION_TYPES.EDIT_PURCHASEORDER_SUCCESS, payload: response.data })
            historypusher.push('/Purchaseorders')
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_PURCHASEORDERS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.EDIT_PURCHASEORDER_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const DeletePurchaseorders = (data) => async (dispatch, getState) => {
    delete data['edit']
    delete data['delete']
    dispatch({ type: ACTION_TYPES.DELETE_PURCHASEORDER_INIT })
    await instanse.delete(config.services.Warehouse, ROUTES.PURCHASEORDER, data)
        .then(response => {
            dispatch({ type: ACTION_TYPES.DELETE_PURCHASEORDER_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_PURCHASEORDERS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.DELETE_PURCHASEORDER_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const RemoveSelectedPurchaseorders = payload => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.REMOVE_SELECTED_PURCHASEORDER, payload })
    }
}

export const fillPurchaseordernotification = payload => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.FILL_PURCHASEORDERS_NOTIFICATION, payload })
    }
}

export const removePurchaseordernotification = () => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.REMOVE_PURCHASEORDERS_NOTIFICATION })
    }
}
