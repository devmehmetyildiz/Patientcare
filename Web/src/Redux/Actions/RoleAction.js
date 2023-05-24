import { ROUTES } from "../../Utils/Constants";
import AxiosErrorHelper from "../../Utils/AxiosErrorHelper";
import instanse from "./axios"

export const ACTION_TYPES = {
    GET_ROLES_INIT: 'GET_ROLES_INIT',
    GET_ROLES_SUCCESS: 'GET_ROLES_SUCCESS',
    GET_ROLES_ERROR: 'GET_ROLES_ERROR',

    GET_ALLROLES_INIT: 'GET_ALLROLES_INIT',
    GET_ALLROLES_SUCCESS: 'GET_ALLROLES_SUCCESS',
    GET_ALLROLES_ERROR: 'GET_ALLROLES_ERROR',

    GET_ALLAUTHS_INIT: 'GET_ALLAUTHS_INIT',
    GET_ALLAUTHS_SUCCESS: 'GET_ALLAUTHS_SUCCESS',
    GET_ALLAUTHS_ERROR: 'GET_ALLAUTHS_ERROR',

    GET_ALLAUTHGROUP_INIT: 'GET_ALLAUTHGROUP_INIT',
    GET_ALLAUTHGROUP_SUCCESS: 'GET_ALLAUTHGROUP_SUCCESS',
    GET_ALLAUTHGROUP_ERROR: 'GET_ALLAUTHGROUP_ERROR',

    GET_ROLE_INIT: 'GET_ROLE_INIT',
    GET_ROLE_SUCCESS: 'GET_ROLE_SUCCESS',
    GET_ROLE_ERROR: 'GET_ROLE_ERROR',

    ADD_ROLE_INIT: 'ADD_ROLE_INIT',
    ADD_ROLE_SUCCESS: 'ADD_ROLE_SUCCESS',
    ADD_ROLE_ERROR: 'ADD_ROLE_ERROR',

    EDIT_ROLE_INIT: 'EDIT_ROLE_INIT',
    EDIT_ROLE_SUCCESS: 'EDIT_ROLE_SUCCESS',
    EDIT_ROLE_ERROR: 'EDIT_ROLE_ERROR',

    DELETE_ROLE_INIT: 'DELETE_ROLE_INIT',
    DELETE_ROLE_SUCCESS: 'DELETE_ROLE_SUCCESS',
    DELETE_ROLE_ERROR: 'DELETE_ROLE_ERROR',

    REMOVE_SELECTED_ROLE: 'REMOVE_SELECTED_ROLE',

    FILL_ROLES_NOTIFICATION: 'FILL_ROLES_NOTIFICATION',
    REMOVE_ROLES_NOTIFICATION: 'REMOVE_ROLES_NOTIFICATION',
}

export const GetRoles = () => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.GET_ROLES_INIT })
    await instanse.get(ROUTES.ROLE + "/GetAll")
        .then(response => {
            dispatch({ type: ACTION_TYPES.GET_ROLES_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_ROLES_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.GET_ROLES_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const GetRole = (guid) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.GET_ROLE_INIT })
    await instanse.get(ROUTES.ROLE + `/Getselected?guid=${guid}`)
        .then(response => {
            dispatch({ type: ACTION_TYPES.GET_ROLE_SUCCESS, payload: response.data }) 
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_ROLES_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.GET_ROLE_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const GetAuthories = () => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.GET_ALLAUTHS_INIT })
    await instanse.get(ROUTES.ROLE + "/GetAllAuthories")
        .then(response => {
            dispatch({ type: ACTION_TYPES.GET_ALLAUTHS_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_ROLES_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.GET_ALLAUTHS_ERROR, payload: AxiosErrorHelper(error) })
        })
}
export const GetAuthorygroups = () => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.GET_ALLAUTHGROUP_INIT })
    await instanse.get(ROUTES.ROLE + "/GetAllAuthoryGroups")
        .then(response => {
            dispatch({ type: ACTION_TYPES.GET_ALLAUTHGROUP_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_ROLES_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.GET_ALLAUTHGROUP_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const AddRoles = (data, historypusher) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.ADD_ROLE_INIT })
    await instanse.post(ROUTES.ROLE + "/Add", data)
        .then(response => {
                dispatch({ type: ACTION_TYPES.ADD_ROLE_SUCCESS, payload: response.data })
                historypusher.push('/Roles')
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_ROLES_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.ADD_ROLE_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const EditRoles = (data, historypusher) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.EDIT_ROLE_INIT })
    await instanse.post(ROUTES.ROLE + "/Update", data)
        .then(response => {
                dispatch({ type: ACTION_TYPES.EDIT_ROLE_SUCCESS, payload: response.data })
                historypusher.push('/Roles')
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_ROLES_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.EDIT_ROLE_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const DeleteRoles = (data) => async (dispatch, getState) => {
    delete data['edit']
    delete data['delete']
    dispatch({ type: ACTION_TYPES.DELETE_ROLE_INIT })
    await instanse.post(ROUTES.ROLE + "/Delete", data)
        .then(response => {
                dispatch({ type: ACTION_TYPES.DELETE_ROLE_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_ROLES_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.DELETE_ROLE_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const RemoveSelectedRole = payload => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.REMOVE_SELECTED_ROLE, payload })
    }
}

export const fillRolenotification = payload => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.FILL_ROLES_NOTIFICATION, payload })
    }
}

export const removeRolenotification = () => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.REMOVE_ROLES_NOTIFICATION })
    }
}
