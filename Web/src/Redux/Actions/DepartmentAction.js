import { ROUTES } from "../../Utils/Constants";
import AxiosErrorHelper from "../../Utils/AxiosErrorHelper";
import instanse from "./axios"
import config from "../../Config";

export const ACTION_TYPES = {
    GET_DEPARTMENTS_INIT: 'GET_DEPARTMENTS_INIT',
    GET_DEPARTMENTS_SUCCESS: 'GET_DEPARTMENTS_SUCCESS',
    GET_DEPARTMENTS_ERROR: 'GET_DEPARTMENTS_ERROR',

    GET_ALLDEPARTMENTS_INIT: 'GET_ALLDEPARTMENTS_INIT',
    GET_ALLDEPARTMENTS_SUCCESS: 'GET_ALLDEPARTMENTS_SUCCESS',
    GET_ALLDEPARTMENTS_ERROR: 'GET_ALLDEPARTMENTS_ERROR',

    GET_DEPARTMENT_INIT: 'GET_DEPARTMENT_INIT',
    GET_DEPARTMENT_SUCCESS: 'GET_DEPARTMENT_SUCCESS',
    GET_DEPARTMENT_ERROR: 'GET_DEPARTMENT_ERROR',

    ADD_DEPARTMENT_INIT: 'ADD_DEPARTMENT_INIT',
    ADD_DEPARTMENT_SUCCESS: 'ADD_DEPARTMENT_SUCCESS',
    ADD_DEPARTMENT_ERROR: 'ADD_DEPARTMENT_ERROR',

    EDIT_DEPARTMENT_INIT: 'EDIT_DEPARTMENT_INIT',
    EDIT_DEPARTMENT_SUCCESS: 'EDIT_DEPARTMENT_SUCCESS',
    EDIT_DEPARTMENT_ERROR: 'EDIT_DEPARTMENT_ERROR',

    DELETE_DEPARTMENT_INIT: 'DELETE_DEPARTMENT_INIT',
    DELETE_DEPARTMENT_SUCCESS: 'DELETE_DEPARTMENT_SUCCESS',
    DELETE_DEPARTMENT_ERROR: 'DELETE_DEPARTMENT_ERROR',

    REMOVE_SELECTED_DEPARTMENT: 'REMOVE_SELECTED_DEPARTMENT',

    FILL_DEPARTMENTS_NOTIFICATION: 'FILL_DEPARTMENTS_NOTIFICATION',
    REMOVE_DEPARTMENTS_NOTIFICATION: 'REMOVE_DEPARTMENTS_NOTIFICATION',
}

export const GetDepartments = () => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.GET_DEPARTMENTS_INIT })
    await instanse.get(config.services.Setting, "Departments")
        .then(response => {
            dispatch({ type: ACTION_TYPES.GET_DEPARTMENTS_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_DEPARTMENTS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.GET_DEPARTMENTS_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const GetDepartment = (guid) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.GET_DEPARTMENT_INIT })
    await instanse.get(config.services.Setting, `Departments/${guid}`)
        .then(response => {
            dispatch({ type: ACTION_TYPES.GET_DEPARTMENT_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_DEPARTMENTS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.GET_DEPARTMENT_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const AddDepartments = (data, historypusher) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.ADD_DEPARTMENT_INIT })
    await instanse.post(config.services.Setting, `Departments`, data)
        .then(response => {
            dispatch({ type: ACTION_TYPES.ADD_DEPARTMENT_SUCCESS, payload: response.data })
            historypusher.push('/Departments')
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_DEPARTMENTS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.ADD_DEPARTMENT_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const EditDepartments = (data, historypusher) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.EDIT_DEPARTMENT_INIT })
    await instanse.put(config.services.Setting, `Departments`, data)
        .then(response => {
            dispatch({ type: ACTION_TYPES.EDIT_DEPARTMENT_SUCCESS, payload: response.data })
            historypusher.push('/Departments')
        })
        .catch(error => {
            console.log('AxiosErrorHelper(error): ', AxiosErrorHelper(error));
            dispatch({ type: ACTION_TYPES.FILL_DEPARTMENTS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.EDIT_DEPARTMENT_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const DeleteDepartments = (data) => async (dispatch, getState) => {
    delete data['edit']
    delete data['delete']
    dispatch({ type: ACTION_TYPES.DELETE_DEPARTMENT_INIT })
    await instanse.delete(config.services.Setting, `Departments`, data)
        .then(response => {
            dispatch({ type: ACTION_TYPES.DELETE_DEPARTMENT_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_DEPARTMENTS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.DELETE_DEPARTMENT_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const RemoveSelectedDepartment = payload => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.REMOVE_SELECTED_DEPARTMENT, payload })
    }
}

export const fillDepartmentnotification = payload => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.FILL_DEPARTMENTS_NOTIFICATION, payload })
    }
}

export const removeDepartmentnotification = () => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.REMOVE_DEPARTMENTS_NOTIFICATION })
    }
}
