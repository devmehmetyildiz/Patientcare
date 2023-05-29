import { ROUTES } from "../../Utils/Constants";
import AxiosErrorHelper from "../../Utils/AxiosErrorHelper";
import instanse from "./axios"
import config from "../../Config";

export const ACTION_TYPES = {
    GET_ROLES_INIT: 'GET_ROLES_INIT',
    GET_ROLES_SUCCESS: 'GET_ROLES_SUCCESS',
    GET_ROLES_ERROR: 'GET_ROLES_ERROR',

    GET_ALLROLES_INIT: 'GET_ALLROLES_INIT',
    GET_ALLROLES_SUCCESS: 'GET_ALLROLES_SUCCESS',
    GET_ALLROLES_ERROR: 'GET_ALLROLES_ERROR',

    GET_PRIVILEGES_INIT: 'GET_PRIVILEGES_INIT',
    GET_PRIVILEGES_SUCCESS: 'GET_PRIVILEGES_SUCCESS',
    GET_PRIVILEGES_ERROR: 'GET_PRIVILEGES_ERROR',

    GET_PRIVILEGEGROUPS_INIT: 'GET_PRIVILEGEGROUPS_INIT',
    GET_PRIVILEGEGROUPS_SUCCESS: 'GET_PRIVILEGEGROUPS_SUCCESS',
    GET_PRIVILEGEROUPS_ERROR: 'GET_PRIVILEGEROUPS_ERROR',

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
    await instanse.get(config.services.Userrole, ROUTES.ROLE)
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
    await instanse.get(config.services.Userrole, `${ROUTES.ROLE}/${guid}`)
        .then(response => {
            dispatch({ type: ACTION_TYPES.GET_ROLE_SUCCESS, payload: response.data }) 
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_ROLES_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.GET_ROLE_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const GetPrivileges = () => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.GET_PRIVILEGES_INIT })
    await instanse.get(config.services.Userrole, ROUTES.ROLE+`/Getprivileges`)
        .then(response => {
            dispatch({ type: ACTION_TYPES.GET_PRIVILEGES_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_ROLES_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.GET_PRIVILEGES_ERROR, payload: AxiosErrorHelper(error) })
        })
}
export const GetPrivilegegroups = () => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.GET_PRIVILEGEGROUPS_INIT })
    await instanse.get(config.services.Userrole, ROUTES.ROLE+`/Getprivilegegroups`)
        .then(response => {
            dispatch({ type: ACTION_TYPES.GET_PRIVILEGEGROUPS_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_ROLES_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.GET_PRIVILEGEROUPS_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const AddRoles = (data, historypusher) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.ADD_ROLE_INIT })
    await instanse.post(config.services.Userrole, ROUTES.ROLE, data)
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
    await instanse.put(config.services.Userrole, ROUTES.ROLE, data)
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
    await instanse.delete(config.services.Userrole, ROUTES.ROLE, data)
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
