import { ROUTES } from "../../Utils/Constants";
import AxiosErrorHelper from "../../Utils/AxiosErrorHelper";
import instanse from "./axios"
import config from "../../Config";

export const ACTION_TYPES = {
    GET_COSTUMERTYPES_INIT: 'GET_COSTUMERTYPES_INIT',
    GET_COSTUMERTYPES_SUCCESS: 'GET_COSTUMERTYPES_SUCCESS',
    GET_COSTUMERTYPES_ERROR: 'GET_COSTUMERTYPES_ERROR',

    GET_ALLCOSTUMERTYPES_INIT: 'GET_ALLCOSTUMERTYPES_INIT',
    GET_ALLCOSTUMERTYPES_SUCCESS: 'GET_ALLCOSTUMERTYPES_SUCCESS',
    GET_ALLCOSTUMERTYPES_ERROR: 'GET_ALLCOSTUMERTYPES_ERROR',

    GET_COSTUMERTYPE_INIT: 'GET_COSTUMERTYPE_INIT',
    GET_COSTUMERTYPE_SUCCESS: 'GET_COSTUMERTYPE_SUCCESS',
    GET_COSTUMERTYPE_ERROR: 'GET_COSTUMERTYPE_ERROR',

    ADD_COSTUMERTYPE_INIT: 'ADD_COSTUMERTYPE_INIT',
    ADD_COSTUMERTYPE_SUCCESS: 'ADD_COSTUMERTYPE_SUCCESS',
    ADD_COSTUMERTYPE_ERROR: 'ADD_COSTUMERTYPE_ERROR',

    EDIT_COSTUMERTYPE_INIT: 'EDIT_COSTUMERTYPE_INIT',
    EDIT_COSTUMERTYPE_SUCCESS: 'EDIT_COSTUMERTYPE_SUCCESS',
    EDIT_COSTUMERTYPE_ERROR: 'EDIT_COSTUMERTYPE_ERROR',

    DELETE_COSTUMERTYPE_INIT: 'DELETE_COSTUMERTYPE_INIT',
    DELETE_COSTUMERTYPE_SUCCESS: 'DELETE_COSTUMERTYPE_SUCCESS',
    DELETE_COSTUMERTYPE_ERROR: 'DELETE_COSTUMERTYPE_ERROR',

    REMOVE_SELECTED_COSTUMERTYPE: 'REMOVE_SELECTED_COSTUMERTYPE',

    FILL_COSTUMERTYPES_NOTIFICATION: 'FILL_COSTUMERTYPES_NOTIFICATION',
    REMOVE_COSTUMERTYPES_NOTIFICATION: 'REMOVE_COSTUMERTYPES_NOTIFICATION',
}

export const GetCostumertypes = () => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.GET_COSTUMERTYPES_INIT })
    await instanse.get(config.services.Setting, ROUTES.COSTUMERTYPE)
        .then(response => {
            dispatch({ type: ACTION_TYPES.GET_COSTUMERTYPES_SUCCESS, payload: response.data }) 
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_COSTUMERTYPES_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.GET_COSTUMERTYPES_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const GetCostumertype = (guid) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.GET_COSTUMERTYPE_INIT })
    await instanse.get(config.services.Setting, `${ROUTES.COSTUMERTYPE}/${guid}`)
        .then(response => {
            dispatch({ type: ACTION_TYPES.GET_COSTUMERTYPE_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_COSTUMERTYPES_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.GET_COSTUMERTYPE_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const AddCostumertypes = (data, historypusher) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.ADD_COSTUMERTYPE_INIT })
    await instanse.post(config.services.Setting, ROUTES.COSTUMERTYPE, data)
        .then(response => {
                dispatch({ type: ACTION_TYPES.ADD_COSTUMERTYPE_SUCCESS, payload: response.data })
                historypusher.push('/Costumertypes')
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_COSTUMERTYPES_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.ADD_COSTUMERTYPE_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const EditCostumertypes = (data, historypusher) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.EDIT_COSTUMERTYPE_INIT })
    await instanse.put(config.services.Setting, ROUTES.COSTUMERTYPE, data)
        .then(response => {
                dispatch({ type: ACTION_TYPES.EDIT_COSTUMERTYPE_SUCCESS, payload: response.data })
                historypusher.push('/Costumertypes')
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_COSTUMERTYPES_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.EDIT_COSTUMERTYPE_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const DeleteCostumertypes = (data) => async (dispatch, getState) => {
    delete data['edit']
    delete data['delete']
    dispatch({ type: ACTION_TYPES.DELETE_COSTUMERTYPE_INIT })
    await instanse.delete(config.services.Setting, `${ROUTES.COSTUMERTYPE}/${data.Uuid}`)
        .then(response => {
                dispatch({ type: ACTION_TYPES.DELETE_COSTUMERTYPE_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_COSTUMERTYPES_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.DELETE_COSTUMERTYPE_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const RemoveSelectedCostumertype = payload => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.REMOVE_SELECTED_COSTUMERTYPE, payload })
    }
}

export const fillCostumertypenotification = payload => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.FILL_COSTUMERTYPES_NOTIFICATION, payload })
    }
}

export const removeCostumertypenotification = () => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.REMOVE_COSTUMERTYPES_NOTIFICATION })
    }
}
